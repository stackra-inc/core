/**
 * @file node-req-adapter.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Bridge between Node's `http` primitives and Web `fetch`.
 *
 *   The SSR renderer speaks Web `Request` / `Response`. Node's `http`
 *   uses `IncomingMessage` / `ServerResponse`. These helpers convert
 *   between the two so `createNodeHandler` can wire the renderer into
 *   any Node HTTP framework (`http.createServer`, Express middleware,
 *   Fastify plugin, Vite dev-server middleware).
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';

/**
 * Convert a Node `IncomingMessage` into a Web `Request`.
 *
 * @param req    - The incoming Node request.
 * @param origin - Optional origin (`http://host`). Derived from the `Host`
 *   header when omitted.
 */
export function nodeReqToWebRequest(req: IncomingMessage, origin?: string): Request {
  const host = origin ?? deriveOrigin(req);
  const url = new URL(req.url ?? '/', host);
  const method = (req.method ?? 'GET').toUpperCase();

  const headers = new Headers();
  for (const [key, raw] of Object.entries(req.headers)) {
    if (raw == null) continue;
    if (Array.isArray(raw)) {
      for (const value of raw) headers.append(key, value);
    } else {
      headers.set(key, raw);
    }
  }

  const init: RequestInit = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    // `Readable.toWeb` converts a Node stream into a Web ReadableStream.
    (init as RequestInit & { duplex?: string }).duplex = 'half';
    init.body = Readable.toWeb(req) as unknown as BodyInit;
  }

  return new Request(url, init);
}

/**
 * Stream a Web `Response` back through a Node `ServerResponse`.
 *
 * @param response - The Web response produced by the renderer.
 * @param res      - The Node response.
 */
export async function pipeResponseToNode(response: Response, res: ServerResponse): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(value);
    }
  } finally {
    reader.releaseLock();
    res.end();
  }
}

/**
 * Best-effort origin derivation from Node request headers.
 */
function deriveOrigin(req: IncomingMessage): string {
  const rawHost = req.headers['host'];
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
  if (!host) return 'http://localhost';
  const proto = detectProtocol(req);
  return `${proto}://${host}`;
}

function detectProtocol(req: IncomingMessage): 'http' | 'https' {
  const forwarded = req.headers['x-forwarded-proto'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (value === 'https') return 'https';
  const socket = req.socket as { encrypted?: boolean } | undefined;
  return socket?.encrypted ? 'https' : 'http';
}
