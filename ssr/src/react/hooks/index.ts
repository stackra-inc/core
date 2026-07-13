/**
 * @file index.ts
 * @module @stackra/ssr/react/hooks
 * @description Barrel export for react-subpath hooks.
 *
 *   Stackra-specific hooks + curated re-exports from `react-router-dom`
 *   and `@stackra/container/react` so consumers import everything from
 *   one module.
 */

// ═══════════════════════════════════════════════════════════════════════
// Stackra hooks
// ═══════════════════════════════════════════════════════════════════════
export { useRouteState } from './use-route-state';

// ═══════════════════════════════════════════════════════════════════════
// Container re-exports — resolve providers from the surrounding
// <ContainerProvider> (installed by <StackraRouter>).
// ═══════════════════════════════════════════════════════════════════════
export { useContainer, useInject, useOptionalInject } from '@stackra/container/react';

// ═══════════════════════════════════════════════════════════════════════
// Curated React Router re-exports
// ═══════════════════════════════════════════════════════════════════════
export {
  useNavigate,
  useLocation,
  useParams,
  useMatches,
  useMatch,
  useHref,
  useLoaderData,
  useActionData,
  useRouteLoaderData,
  useSubmit,
  useNavigation,
  useNavigationType,
  useSearchParams,
  useFetcher,
  useFetchers,
  useRevalidator,
  useOutlet,
  useOutletContext,
  useResolvedPath,
  useRouteError,
  useAsyncError,
  useAsyncValue,
  useBlocker,
} from 'react-router-dom';
