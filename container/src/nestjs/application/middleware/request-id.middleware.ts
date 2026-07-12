/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file request-id.middleware.ts
 * @module @stackra/container/nestjs
 * @description Generates X-Request-ID if not present on incoming request.
 *   Attaches to both request and response headers for end-to-end tracing.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

/**
 * Generates or propagates a unique request identifier for every HTTP request.
 *
 * If the incoming request already carries an `X-Request-ID` header, it is preserved.
 * Otherwise, a new UUIDv4 is generated. The identifier is attached to both the
 * request object (`req.requestId`) and the response header for end-to-end tracing.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  /**
   * Process the request and attach a request ID.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Next middleware function
   */
  public use(req: any, res: any, next: () => void): void {
    const requestId = req.headers['x-request-id'] ?? randomUUID();
    req.headers['x-request-id'] = requestId;
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  }
}
