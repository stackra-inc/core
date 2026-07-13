/**
 * @file index.ts
 * @module @stackra/contracts/interfaces
 * @description Barrel export for every interface shipped by contracts.
 *   Type aliases and enums live in ../types and ../enums respectively.
 */

// DI foundation shapes
export type { Type } from './type.interface';
export type { Abstract } from './abstract.interface';
export type { ScopeOptions } from './scope-options.interface';
export * from './modules';
export * from './hooks';

// Domain-specific
export * from './cache';
export * from './container';
export * from './discovery';
export * from './events';
export * from './http';
export * from './logger';
