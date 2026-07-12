/**
 * @stackra/container/react
 *
 * React bindings for the DI container.
 * Import from '@stackra/container/react' to use React hooks
 * and providers. This entry point requires React as a peer dependency.
 *
 * @module @stackra/container/react
 */

// Context
export { ContainerContext } from './contexts/container.context';

// Hooks
export { useInject } from './hooks/use-inject';
export { useContainer } from './hooks/use-container';
export { useOptionalInject } from './hooks/use-optional-inject';
export { useDiscovery } from './hooks/use-discovery';
export { useDiscovered } from './hooks/use-discovered';

// Provider
export { ContainerProvider } from './providers/container/container.provider';
