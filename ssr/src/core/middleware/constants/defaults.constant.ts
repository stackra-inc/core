/**
 * @file defaults.constant.ts
 * @module @stackra/ssr/middleware/constants
 * @description Canonical defaults used across the middleware runtime.
 */

import { MiddlewareRunOn } from '../enums/middleware-run-on.enum';
import { MiddlewareStage } from '../enums/middleware-stage.enum';

/**
 * Default priority applied to middleware that does not specify one.
 *
 * Higher numbers execute earlier. Zero is the neutral value — negative
 * numbers push a middleware to the end of the chain, positive numbers
 * pull it forward. Ties are broken by declaration order.
 */
export const DEFAULT_PRIORITY = 0;

/**
 * Default `runOn` value — middleware runs in both server and client
 * environments unless explicitly narrowed.
 */
export const DEFAULT_RUN_ON: MiddlewareRunOn = MiddlewareRunOn.BOTH;

/**
 * Default stage for middleware without an explicit `stage` option.
 * Falls back to the generic pipe stage — safe for values that don't
 * carry request/response semantics.
 */
export const DEFAULT_STAGE: MiddlewareStage = MiddlewareStage.PIPE;
