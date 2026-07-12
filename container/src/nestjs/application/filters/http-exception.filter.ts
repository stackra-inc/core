/**
 * @file http-exception.filter.ts
 * @module @stackra/container/nestjs
 * @description Formats NestJS HttpException responses into a consistent shape.
 *   Works alongside AllExceptionsFilter for HTTP-specific errors (4xx).
 */
import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

/**
 * HTTP exception formatter filter.
 *
 * Catches all `HttpException` instances and formats them into a consistent
 * error response shape with timestamp, path, and request ID. Ensures that
 * all HTTP errors (400, 401, 403, 404, 409, etc.) follow the same structure
 * regardless of where they are thrown.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Handle the caught HTTP exception and produce a consistent response.
   *
   * @param exception - The caught HttpException
   * @param host - NestJS arguments host providing access to request/response
   */
  public catch(exception: HttpException, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorBody =
      typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse;

    response.status(status).json({
      statusCode: status,
      ...(typeof errorBody === 'object' ? errorBody : { message: errorBody }),
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers?.['x-request-id'] ?? null,
    });
  }
}
