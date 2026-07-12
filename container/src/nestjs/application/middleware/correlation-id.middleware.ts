/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file correlation-id.middleware.ts
 * @module @stackra/container/nestjs
 * @description Propagates X-Correlation-ID from request or generates a new one.
 *   Used for distributed tracing across microservices.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

/**
 * Propagates or generates a correlation identifier for distributed tracing.
 *
 * Unlike request IDs (which are unique per request), correlation IDs follow
 * a logical operation across multiple services. If the upstream service provides
 * one via `X-Correlation-ID`, it is preserved. Otherwise, a new one is generated.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  /**
   * Process the request and attach a correlation ID.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Next middleware function
   */
  public use(req: any, res: any, next: () => void): void {
    const correlationId = req.headers['x-correlation-id'] ?? randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
  }
}
