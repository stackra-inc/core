/**
 * @file ssr-renderer.service.ts
 * @module @stackra/ssr/core/server/services
 * @description The SSR renderer — orchestrates request → response.
 *
 *   Pipeline order for every incoming request:
 *     1. Emit `SSR_EVENTS.RENDER_STARTED`.
 *     2. Run global HTTP middleware (via `MIDDLEWARE_RESOLVER`).
 *     3. Try API route match — dispatch if hit.
 *     4. Decide crawler vs human via `isCrawler(User-Agent)`.
 *     5. Crawler path — build a `StaticHandler`, execute loaders,
 *        stream the resulting React tree via `renderToReadableStream`.
 *     6. Human path — return the HTML shell that boots the client bundle.
 *     7. Any signal thrown along the way (`redirect` / `notFound` /
 *        `abort`) is mapped to a `Response` via `signalToResponse`.
 *     8. Emit `SSR_EVENTS.RENDER_COMPLETED` or `RENDER_FAILED`.
 */

import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  type StaticHandler,
} from 'react-router-dom';

import { Inject, Injectable, Optional } from '@stackra/container';
import type { IApplication, ILoggerManager } from '@stackra/contracts';
import {
  API_ROUTE_REGISTRY,
  APPLICATION,
  LOGGER_MANAGER,
  MIDDLEWARE_RESOLVER,
  ROUTE_REGISTRY,
  SSR_CONFIG,
  SSR_EVENTS,
} from '@stackra/contracts';

import { ContainerProvider } from '@stackra/container/react';
import { Pipeline } from '@stackra/pipeline';

import type { HttpContext } from '../../middleware/interfaces';
import { MiddlewareResolver, toPipe } from '../../middleware';
import type { SsrModuleOptions } from '../interfaces/ssr-module-options.interface';
import { attachMiddleware } from '../../../react/utils/attach-middleware.util';
import { isCrawler as defaultIsCrawler } from '../utils/is-crawler.util';
import { errorToResponse, signalToResponse } from '../utils/signal-to-response.util';
import { RouteRegistry } from './route-registry.service';
import { ApiRouteRegistry } from './api-route-registry.service';

/**
 * Minimal event-emitter shape — declared inline so we don't take a hard
 * dependency on `@stackra/events`.
 */
interface IEventEmitterSync {
  emit(event: string, payload: unknown): void;
}
const EVENT_EMITTER_TOKEN = Symbol.for('EVENT_EMITTER');

/**
 * The SSR renderer service.
 */
@Injectable()
export class SsrRenderer {
  public constructor(
    @Inject(APPLICATION) private readonly app: IApplication,
    @Inject(SSR_CONFIG) private readonly config: SsrModuleOptions,
    @Inject(ROUTE_REGISTRY) private readonly routes: RouteRegistry,
    @Inject(API_ROUTE_REGISTRY) private readonly apiRoutes: ApiRouteRegistry,
    @Inject(MIDDLEWARE_RESOLVER) private readonly resolver: MiddlewareResolver,
    @Optional() @Inject(LOGGER_MANAGER) private readonly loggerManager?: ILoggerManager,
    @Optional() @Inject(EVENT_EMITTER_TOKEN) private readonly events?: IEventEmitterSync
  ) {}

  /**
   * Handle an incoming HTTP request and produce a Response.
   */
  public async render(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const startedAt = performance.now();
    const userAgent = request.headers.get('user-agent');
    const detector = this.config.isCrawler ?? defaultIsCrawler;
    const isCrawlerRequest = this.config.force
      ? this.config.force === 'crawler'
      : detector(userAgent);

    this.emit(SSR_EVENTS.RENDER_STARTED, {
      url: url.toString(),
      method: request.method,
      isCrawler: isCrawlerRequest,
    });

    try {
      // 1. Global HTTP middleware.
      await this.runGlobalMiddleware(request, url);

      // 2. API route match → dispatch.
      const apiMatch = this.apiRoutes.match(request);
      if (apiMatch) {
        this.emit(SSR_EVENTS.API_ROUTE_MATCHED, {
          url: url.toString(),
          method: request.method,
          path: apiMatch.route.path,
        });
        const response = await this.dispatchApiRoute(request, url, apiMatch.route, apiMatch.params);
        this.emit(SSR_EVENTS.RENDER_COMPLETED, {
          url: url.toString(),
          status: response.status,
          durationMs: performance.now() - startedAt,
        });
        return response;
      }

      // 3. UI route dispatch.
      const response = isCrawlerRequest
        ? await this.renderCrawlerHtml(request)
        : this.renderClientShell();

      this.emit(SSR_EVENTS.RENDER_COMPLETED, {
        url: url.toString(),
        status: response.status,
        durationMs: performance.now() - startedAt,
      });
      return response;
    } catch (err) {
      const signalResponse = signalToResponse(err);
      if (signalResponse) {
        this.emit(SSR_EVENTS.RENDER_COMPLETED, {
          url: url.toString(),
          status: signalResponse.status,
          durationMs: performance.now() - startedAt,
        });
        return signalResponse;
      }

      this.warn(`SSR render failed: ${err instanceof Error ? err.message : String(err)}`);
      this.emit(SSR_EVENTS.RENDER_FAILED, { url: url.toString(), error: err });
      return errorToResponse(err, this.config.exposeErrors);
    }
  }

  /**
   * Run global HTTP middleware — non-route-specific chain.
   */
  private async runGlobalMiddleware(request: Request, url: URL): Promise<void> {
    const global = this.config.globalMiddleware ?? [];
    const groups = this.config.globalGroups ?? [];
    if (global.length === 0 && groups.length === 0) return;

    const chain = this.resolver.resolve({
      global,
      groups,
      environment: 'server',
      stage: 'http',
    });
    if (chain.length === 0) return;

    const pipes = chain.map((m) => toPipe(m.definition, this.app, m.name));
    const ctx: HttpContext = {
      container: this.app,
      request,
      response: new Response(),
      params: {},
      url,
      state: {},
    };
    await new Pipeline(this.app).send(ctx).through(pipes).thenReturn();
  }

  /**
   * Dispatch a matched API route through its middleware chain and
   * normalise the result into a `Response`.
   */
  private async dispatchApiRoute(
    request: Request,
    url: URL,
    route: import('../../../react/types/stackra-api-route.type').StackraApiRoute,
    params: Record<string, string>
  ): Promise<Response> {
    // Run route middleware first.
    if (route.middleware && route.middleware.length > 0) {
      const chain = this.resolver.resolve({
        route: route.middleware as never,
        environment: 'server',
        stage: 'http',
      });
      const pipes = chain.map((m) => toPipe(m.definition, this.app, m.name));
      const ctx: HttpContext = {
        container: this.app,
        request,
        response: new Response(),
        params,
        url,
        state: {},
      };
      await new Pipeline(this.app).send(ctx).through(pipes).thenReturn();
    }

    const handlerCtx: HttpContext = {
      container: this.app,
      request,
      response: new Response(),
      params,
      url,
      state: {},
    };
    const result = await route.handler(handlerCtx);
    return normaliseApiResult(result);
  }

  /**
   * Crawler path — full server render via `createStaticHandler`.
   */
  private async renderCrawlerHtml(request: Request): Promise<Response> {
    const wired = attachMiddleware(this.routes.getTree(), this.app, 'server');
    if (wired.length === 0) {
      // No routes — fall back to the shell so the client can attempt
      // to boot (even a crawler will get *something* rather than 404).
      return this.renderClientShell();
    }

    const handler: StaticHandler = createStaticHandler(wired);
    const context = await handler.query(request);

    if (context instanceof Response) {
      return context; // Loader-thrown redirect / response.
    }

    const router = createStaticRouter(handler.dataRoutes, context);
    const stream = await renderToReadableStream(
      createElement(
        ContainerProvider,
        { context: this.app as never } as never,
        createElement(
          StaticRouterProvider as never,
          {
            router,
            context,
          } as never
        )
      )
    );

    return new Response(stream, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
      status: context.statusCode ?? 200,
    });
  }

  /**
   * Human path — return the client SPA shell.
   */
  private renderClientShell(): Response {
    const renderer = this.config.renderShell ?? defaultRenderShell;
    const html = renderer({
      clientEntry: this.config.clientEntry,
      clientCss: this.config.clientCss,
    });
    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  private emit(event: string, payload: unknown): void {
    if (!this.events) return;
    try {
      this.events.emit(event, payload);
    } catch {
      /* fail-soft */
    }
  }

  private warn(message: string): void {
    if (!this.loggerManager) return;
    try {
      this.loggerManager.create('ssr').warn(message);
    } catch {
      /* fail-soft */
    }
  }
}

/**
 * Default `<!DOCTYPE html>` shell for the SPA path.
 */
function defaultRenderShell({
  clientEntry,
  clientCss,
}: {
  clientEntry?: string;
  clientCss?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${clientCss ? `<link rel="stylesheet" href="${escapeAttr(clientCss)}" />` : ''}
</head>
<body>
<div id="app"></div>
${clientEntry ? `<script type="module" src="${escapeAttr(clientEntry)}"></script>` : ''}
</body>
</html>`;
}

function escapeAttr(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/**
 * Normalise the return value of an API handler to a Response.
 */
function normaliseApiResult(result: Response | object | string): Response {
  if (result instanceof Response) return result;
  if (typeof result === 'string') {
    return new Response(result, {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  return new Response(JSON.stringify(result), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
