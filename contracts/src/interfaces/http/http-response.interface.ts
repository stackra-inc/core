/**
 * @file http-response.interface.ts
 * @module @stackra/contracts/interfaces/http
 * @description Minimal HTTP response interface for assertions and health checks.
 */

/**
 * Minimal HTTP response interface for status code assertions.
 *
 * Supports both `status` and `statusCode` property names for
 * compatibility with various HTTP client libraries (supertest, axios, fetch).
 */
export interface IHttpResponse {
  /** HTTP status code (used by fetch/axios). */
  status?: number;

  /** HTTP status code (used by NestJS/Express). */
  statusCode?: number;
}
