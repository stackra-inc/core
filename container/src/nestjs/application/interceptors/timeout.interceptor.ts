/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file timeout.interceptor.ts
 * @module @stackra/container/nestjs
 * @description Kills requests exceeding a configurable duration.
 *   Returns 408 Request Timeout to the client.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Global request timeout interceptor.
 *
 * Enforces a maximum duration for request processing. If the handler does not
 * complete within the configured timeout, the request is terminated with a
 * 408 Request Timeout response. Prevents runaway requests from exhausting
 * server resources.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  /**
   * @param timeoutMs - Maximum allowed request duration in milliseconds. Default: 30000.
   */
  public constructor(private readonly timeoutMs: number = 30_000) {}

  /**
   * Intercept the request and apply a timeout operator.
   *
   * @param _context - NestJS execution context (unused)
   * @param next - Call handler for the next interceptor/handler
   * @returns Observable that errors with RequestTimeoutException on timeout
   */
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException(`Request timed out after ${this.timeoutMs}ms`)
          );
        }
        return throwError(() => err);
      })
    );
  }
}
