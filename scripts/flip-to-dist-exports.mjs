#!/usr/bin/env node
/**
 * @file flip-to-dist-exports.mjs
 * @description Rewrites each workspace package.json so its top-level
 *   `main` / `module` / `types` / `exports` fields point at built
 *   `./dist/*` artifacts, and drops the `publishConfig` split.
 *
 *   Why: with src-based top-level exports, cross-package tsc runs
 *   read raw source through workspace symlinks and apply the
 *   consumer's `paths` alias to it — breaking `@/*` inside any
 *   package's `src/`. Dist-based exports force tsc to read pre-built
 *   `.d.ts` files (with aliases already resolved by tsup), so aliases
 *   work per-package and never leak across boundaries.
 *
 *   Cost: every workspace-internal change requires a rebuild of the
 *   changed package before dependents see it (via `pnpm --filter`
 *   or `tsup --watch`).
 *
 *   Usage:
 *     node scripts/flip-to-dist-exports.mjs        # apply
 *     node scripts/flip-to-dist-exports.mjs --dry  # preview
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO_ROOT = path.resolve(url.fileURLToPath(import.meta.url), '../..');
const dryRun = process.argv.includes('--dry') || process.argv.includes('--dry-run');

/**
 * Discover workspace packages from pnpm-workspace.yaml.
 */
function discoverPackages() {
  const raw = fs.readFileSync(path.join(REPO_ROOT, 'pnpm-workspace.yaml'), 'utf8');
  const block = raw.match(/^packages:\s*\n([\s\S]*?)(?:\n[a-zA-Z]|\n$)/m);
  if (!block) return [];
  const names = [];
  for (const line of block[1].split('\n')) {
    const m = line.match(/^\s+-\s+['"]?([^'"\s]+)['"]?/);
    if (m) names.push(m[1]);
  }
  return names.filter((n) => fs.existsSync(path.join(REPO_ROOT, n, 'package.json')));
}

/**
 * Flip a single package.json. Returns { changed, before, after } for logging.
 */
function flipPackage(pkgName) {
  const pkgPath = path.join(REPO_ROOT, pkgName, 'package.json');
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);

  // Only flip packages that have a publishConfig with dist paths.
  // Testing package is a workspace-only dev tool with a different shape.
  if (!pkg.publishConfig?.exports) {
    return { changed: false, reason: 'no publishConfig.exports' };
  }

  const publishExports = pkg.publishConfig.exports;

  // Copy publishConfig.main/module/types/exports up to top level.
  pkg.main = pkg.publishConfig.main ?? pkg.main;
  pkg.module = pkg.publishConfig.module ?? pkg.module;
  pkg.types = pkg.publishConfig.types ?? pkg.types;
  pkg.exports = publishExports;

  // Simplify publishConfig — only `access: "public"` remains.
  pkg.publishConfig = { access: pkg.publishConfig.access ?? 'public' };

  if (!dryRun) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  return { changed: true };
}

// --- Main ---
const packages = discoverPackages();
let flipped = 0;

for (const pkg of packages) {
  const result = flipPackage(pkg);
  if (result.changed) {
    console.log(`✓ ${pkg}`);
    flipped++;
  } else {
    console.log(`  ${pkg} — skipped (${result.reason})`);
  }
}

console.log(
  `\n${dryRun ? 'would flip' : 'flipped'} ${flipped} package.json file(s) to ` +
    `dist-based exports.`
);
if (!dryRun && flipped > 0) {
  console.log('\nNext:');
  console.log('  1. Rebuild everything:    pnpm build');
  console.log('  2. Verify typecheck:      pnpm typecheck');
  console.log('  3. Verify tests:          pnpm -r run test');
}
