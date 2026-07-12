#!/usr/bin/env node
/**
 * @file rewrite-imports.mjs
 * @description Rewrites parent-traversal relative imports (`../`, `../../`, …)
 *   inside every package's `src/` tree to use the `@/*` path alias.
 *
 *   Sibling imports (`./file`, `./sub/file`) are left alone — they're readable
 *   and don't benefit from aliasing.
 *
 *   Handles:
 *     - `import ... from '../…'`
 *     - `export ... from '../…'`
 *     - `import('../…')`  (dynamic import)
 *     - Both single and double quotes
 *     - Bare specifiers with or without an extension
 *
 *   Also normalizes trailing `/index` (drops it since bare folder imports
 *   resolve to `index` automatically).
 *
 *   ⚠️  Scope: this script **only** rewrites `__tests__/` and standalone
 *   app folders (like `vite-example/`). It intentionally leaves package
 *   `src/` trees alone because our workspace exports raw source
 *   (`exports: { ".": "./src/index.ts" }`) for hot-reload dev. Path
 *   aliases don't cross package boundaries — when package A imports
 *   from package B via the workspace symlink, tsc reads B's source but
 *   applies A's `paths` config, so `@/*` in B resolves to A's `src/`.
 *   Using aliases inside package `src/` breaks every consumer's
 *   typecheck.
 *
 *   Aliases are safe in:
 *     - `<package>/__tests__/**` (never imported by other packages)
 *     - `vite-example/**`         (consumer app, terminal)
 *     - Root-level scripts and configs
 *
 *   Usage:
 *     node scripts/rewrite-imports.mjs                     # every eligible root
 *     node scripts/rewrite-imports.mjs cache/__tests__     # specific paths
 *     node scripts/rewrite-imports.mjs --dry               # preview, no writes
 *     node scripts/rewrite-imports.mjs --verbose           # log every rewrite
 *     node scripts/rewrite-imports.mjs --include-src       # opt in to package src/
 *                                                          #  (only useful if you've
 *                                                          #  switched to dist-only
 *                                                          #  workspace linking)
 *
 *   Runs from the repo root.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO_ROOT = path.resolve(url.fileURLToPath(import.meta.url), '../..');

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun = args.includes('--dry') || args.includes('--dry-run');
const verbose = args.includes('--verbose') || args.includes('-v');
const includeSrc = args.includes('--include-src');
const explicitPaths = args.filter((a) => !a.startsWith('-'));

// ---------------------------------------------------------------------------
// Discover eligible root directories.
//
// A "root" is a directory whose imports are safe to rewrite:
//   - Each package's `__tests__/` (a leaf: never imported by others)
//   - `vite-example/src/` and any other future consumer app
//
// Each root pairs with the `srcRoot` its `@/*` alias points at so we
// can compute the alias correctly. For `__tests__/`, the alias points
// at the sibling `src/`; for apps, `@/*` points at their own `src/`.
// ---------------------------------------------------------------------------
function discoverRoots() {
  const yamlPath = path.join(REPO_ROOT, 'pnpm-workspace.yaml');
  const raw = fs.readFileSync(yamlPath, 'utf8');
  const packagesBlock = raw.match(/^packages:\s*\n([\s\S]*?)(?:\n[a-zA-Z]|\n$)/m);

  const pkgNames = [];
  if (packagesBlock) {
    for (const line of packagesBlock[1].split('\n')) {
      const match = line.match(/^\s+-\s+['"]?([^'"\s]+)['"]?/);
      if (match) pkgNames.push(match[1]);
    }
  }

  const roots = [];

  // Every package's __tests__ folder — leaf, safe to alias.
  for (const pkg of pkgNames) {
    const tests = path.join(REPO_ROOT, pkg, '__tests__');
    const src = path.join(REPO_ROOT, pkg, 'src');
    if (fs.existsSync(tests) && fs.existsSync(src)) {
      roots.push({ walkFrom: tests, aliasSrc: src, label: `${pkg}/__tests__` });
    }
  }

  // Standalone consumer apps — flag by presence of `src/main.tsx` or
  // similar app-entry heuristic. Extend as new demo apps land.
  const apps = ['vite-example'];
  for (const app of apps) {
    const src = path.join(REPO_ROOT, app, 'src');
    if (fs.existsSync(src)) {
      roots.push({ walkFrom: src, aliasSrc: src, label: `${app}/src` });
    }
  }

  // Opt-in: package src/ trees. Only useful if the workspace has
  // switched to dist-only linking (top-level exports no longer point
  // at ./src/*.ts). Without that switch, running this mode WILL break
  // cross-package typechecks.
  if (includeSrc) {
    for (const pkg of pkgNames) {
      const src = path.join(REPO_ROOT, pkg, 'src');
      if (fs.existsSync(src)) {
        roots.push({ walkFrom: src, aliasSrc: src, label: `${pkg}/src` });
      }
    }
  }

  return roots;
}

// ---------------------------------------------------------------------------
// File walker (source files only)
// ---------------------------------------------------------------------------
const CODE_EXT = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (CODE_EXT.has(ext) && !entry.name.endsWith('.d.ts')) {
        out.push(full);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Import rewriter
// ---------------------------------------------------------------------------
/**
 * Regex captures every parent-traversal specifier in `import`/`export`/dynamic
 * `import()`. We only match strings that start with `../` — sibling imports
 * (`./foo`) are left as-is.
 *
 * Groups:
 *   1. specifier text (without quotes)
 */
const REL_IMPORT_RE =
  /(?<=\bfrom\s+|import\s*\(\s*)(['"])(\.\.\/[^'"]+)\1|(?<=^import\s+)(['"])(\.\.\/[^'"]+)\3/gm;

/**
 * Resolve a relative specifier from `fromFile` and translate it to a
 * `@/…` alias relative to `srcRoot`. Returns null when the resolved path
 * falls outside `src/` (e.g. `../../../shared/thing` in a package with a
 * flat `src/` — those keep their relative form).
 */
function rewriteSpecifier(specifier, fromFile, srcRoot) {
  const fromDir = path.dirname(fromFile);
  const absTarget = path.resolve(fromDir, specifier);
  const relToSrc = path.relative(srcRoot, absTarget);

  // Escapes above src/? Leave it alone — caller decides whether to warn.
  if (relToSrc.startsWith('..') || path.isAbsolute(relToSrc)) return null;

  // Normalize: drop trailing `/index` (bare folder imports resolve to it).
  let clean = relToSrc.split(path.sep).join('/');
  clean = clean.replace(/\/index(\.[cm]?[jt]sx?)?$/, '');

  return `@/${clean}`;
}

function rewriteFile(filePath, srcRoot) {
  const source = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const rewrites = [];

  const next = source.replace(REL_IMPORT_RE, (match, q1, spec1, q2, spec2) => {
    const quote = q1 ?? q2;
    const specifier = spec1 ?? spec2;
    const rewritten = rewriteSpecifier(specifier, filePath, srcRoot);
    if (!rewritten) return match;
    changed = true;
    rewrites.push({ from: specifier, to: rewritten });
    return match.replace(`${quote}${specifier}${quote}`, `${quote}${rewritten}${quote}`);
  });

  return { changed, next, rewrites };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  let roots;

  if (explicitPaths.length > 0) {
    // Treat each explicit path as `<walkFrom>` and infer aliasSrc as the
    // nearest sibling `src/` (falls back to itself when the walk root
    // *is* the src/).
    roots = explicitPaths.map((rel) => {
      const abs = path.resolve(REPO_ROOT, rel);
      const parent = path.dirname(abs);
      const siblingSrc = path.join(parent, 'src');
      const aliasSrc =
        path.basename(abs) === 'src'
          ? abs
          : fs.existsSync(siblingSrc)
            ? siblingSrc
            : abs;
      return { walkFrom: abs, aliasSrc, label: rel };
    });
  } else {
    roots = discoverRoots();
  }

  if (roots.length === 0) {
    console.error('No roots to process.');
    process.exit(1);
  }

  let totalFiles = 0;
  let totalRewrites = 0;
  const changedFiles = [];

  for (const root of roots) {
    if (!fs.existsSync(root.walkFrom)) {
      console.error(`skip ${root.label}: not found`);
      continue;
    }

    for (const file of walk(root.walkFrom)) {
      totalFiles++;
      const { changed, next, rewrites } = rewriteFile(file, root.aliasSrc);
      if (!changed) continue;

      totalRewrites += rewrites.length;
      changedFiles.push(path.relative(REPO_ROOT, file));

      if (verbose || dryRun) {
        console.log(`\n${path.relative(REPO_ROOT, file)}`);
        for (const { from, to } of rewrites) {
          console.log(`  ${from}  →  ${to}`);
        }
      }

      if (!dryRun) fs.writeFileSync(file, next);
    }
  }

  const mode = dryRun ? 'would rewrite' : 'rewrote';
  console.log(
    `\n${mode} ${totalRewrites} import(s) across ${changedFiles.length} file(s) ` +
      `(scanned ${totalFiles} files across ${roots.length} root(s))`
  );

  if (!includeSrc) {
    console.log(
      'Note: package src/ trees are excluded by default (would break cross-\n' +
        'package typechecks with our src-based workspace linking). Pass\n' +
        '`--include-src` if you know what you\'re doing.'
    );
  }
}

main();
