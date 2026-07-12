/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file raw-body.middleware.ts
 * @module @stackra/container/nestjs
 * @description Preserves the raw request body on `req.rawBody` for webhook signature verification.
 *   Must be applied BEFORE the JSON body parser.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';

/**
 * Captures the raw request body buffer for webhook signature verification.
 *
 * Many payment providers (Stripe, Paddle, etc.) require the raw, unparsed body
 * to verify HMAC signatures. This middleware listens to the request stream and
 * stores the concatenated buffer on `req.rawBody` before the JSON parser consumes it.
 */
@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  /**
   * Capture the raw body from the request stream.
   *
   * @param req - Express request object
   * @param _res - Express response object (unused)
   * @param next - Next middleware function
   */
  public use(req: any, _res: any, next: () => void): void {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      req.rawBody = Buffer.concat(chunks);
    });
    next();
  }
}
