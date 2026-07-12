/**
 * @file index.ts
 * @module @stackra/contracts/interfaces
 * @description Complete barrel for every public interface declared in
 *   `@stackra/contracts/interfaces/`. Client-side vocabulary only —
 *   backend-only domains (workflow, queue, redis-server, SMTP, SMS,
 *   ORM, etc.) live in a separate backend contracts package.
 */

export * from './cache';
export * from './container';
export * from './cookie';
export * from './coordinator';
export * from './discovery';
export * from './events';
export * from './feature-flags';
export * from './health';
export * from './http';
export * from './i18n';
export * from './link';
export * from './logger';
export * from './mobile-pass';
export * from './navigation';
export * from './network';
export * from './notification';
export * from './preferences';
export * from './pubsub';
export * from './push';
export * from './queue';
export * from './realtime';
export * from './redis';
export * from './scheduler';
export * from './sdui';
export * from './state';
export * from './storage';
export * from './theming';
