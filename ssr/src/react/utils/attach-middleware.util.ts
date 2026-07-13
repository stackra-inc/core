/**
 * @file attach-middleware.util.ts
 * @module @stackra/ssr/react/utils
 * @description Wire the middleware resolver into React Router route trees.
 *
 *   For each route in the tree, wrap its `loader` (or install a
 *   pass-through loader if none exists) with a function that:
 *     1. Resolves the middleware chain via `MIDDLEWARE_RESOLVER`.
 *     2. Adapts every entry to a pipe via `toPipe`.
 *     3. Executes the chain through `@stackra/pipeline`.
 *     4. Catches control-flow signals — redirects and 404s become RRD's
 *        native `redirect()` / `Response` throws so error boundaries kick in.
 *     5. Invokes the original loader afterwards, passing accumulated
 *        middleware state onto `handle.middlewareState`.
 *
 *   Runs the same way on the client (`environment: 'client'`) and on
 *   the server (`environment: 'server'`) — the caller picks which via
 *   the `environment` argument.
 */

import type { IApplication } from '@stackra/contracts';
import { MIDDLEWARE_RESOLVER } from '@stackra/contracts';
import { Pipeline } from '@stackra/pipeline';
import { redirect as rrRedirect } from 'react-router-dom';
import type { LoaderFunction, LoaderFunctionArgs, RouteObject } from 'react-router-dom';

import {
  AbortSignal as MiddlewareAbortSignal,
  MiddlewareResolver,
  NotFoundSignal,
  RedirectSignal,
  toPipe,
  type MiddlewareRunOn,
} from '../../core/middleware';
import type { StackraRoute } from '../types/stackra-route.type';

/**
 * Environment argument for the attachment — controls the `runOn` filter
 * inside the resolver.
 */
export type AttachEnvironment = Extract<MiddlewareRunOn, 'server' | 'client'>;

/**
 * Walk a route tree and produce a new tree with middleware wiring in
 * place. The tree is not mutated — every node is cloned.
 *
 * @param routes      - The route tree authored via `defineRoutes(...)`.
 * @param app         - The container — used to resolve `MIDDLEWARE_RESOLVER`.
 * @param environment - `'client'` for browser routers, `'server'` for
 *   static routers.
 */
export function attachMiddleware(
  routes: readonly StackraRoute[],
  app: IApplication,
  environment: AttachEnvironment
): RouteObject[] {
  return routes.map((route) => attachToRoute(route, app, environment));
}

function attachToRoute(
  route: StackraRoute,
  app: IApplication,
  environment: AttachEnvironment
): RouteObject {
  const originalLoader = route.loader;
  const routeMiddleware = route.middleware ?? [];

  const wrappedLoader: LoaderFunction | undefined =
    routeMiddleware.length > 0 || originalLoader
      ? async (args: LoaderFunctionArgs) => {
          if (routeMiddleware.length > 0) {
            await runRouteMiddleware(app, environment, routeMiddleware, args);
          }
          if (typeof originalLoader === 'function') {
            return await (originalLoader as LoaderFunction)(args);
          }
          return null;
        }
      : undefined;

  const { middleware: _stripped, ...rest } = route as StackraRoute & {
    middleware?: readonly unknown[];
  };
  void _stripped;

  const cloned: RouteObject = {
    ...(rest as unknown as RouteObject),
    ...(wrappedLoader ? { loader: wrappedLoader } : {}),
    ...(route.children ? { children: attachMiddleware(route.children, app, environment) } : {}),
  } as RouteObject;

  return cloned;
}

async function runRouteMiddleware(
  app: IApplication,
  environment: AttachEnvironment,
  middleware: NonNullable<StackraRoute['middleware']>,
  args: LoaderFunctionArgs
): Promise<void> {
  const resolver = app.get(MIDDLEWARE_RESOLVER) as MiddlewareResolver;
  const url = new URL(args.request.url);
  const chain = resolver.resolve({
    route: middleware as unknown as readonly (
      import('../../core/middleware').MiddlewareDefinition | string
    )[],
    environment,
    stage: environment === 'server' ? 'http' : 'ui',
  });
  const pipes = chain.map((m) => toPipe(m.definition, app, m.name));

  try {
    await new Pipeline(app)
      .send({
        container: app,
        request: args.request,
        response: new Response(),
        params: args.params,
        url,
        state: {},
      })
      .through(pipes)
      .thenReturn();
  } catch (err) {
    if (err instanceof RedirectSignal) {
      // RRD's redirect helper throws a Response — the router surfaces it
      // as a native navigation both on client and server.
      throw rrRedirect(err.url, { status: err.status });
    }
    if (err instanceof NotFoundSignal) {
      throw new Response(err.reason, { status: 404 });
    }
    if (err instanceof MiddlewareAbortSignal) {
      if (err.result instanceof Response) throw err.result;
      throw new Response(JSON.stringify(err.result), {
        headers: { 'content-type': 'application/json' },
      });
    }
    throw err;
  }
}
