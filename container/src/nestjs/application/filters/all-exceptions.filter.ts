/**
 * @file all-exceptions.filter.ts
 * @module @stackra/container/nestjs
 * @description Catch-all exception filter. Handles ANY unhandled error with a structured
 *   JSON response including request ID and stack trace (dev only).
 */
import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * Global catch-all exception filter.
 *
 * Catches every unhandled exception and converts it into a structured JSON
 * response. Includes the request ID for correlation, stack traces in non-production
 * environments, and logs 5xx errors at the error level.
 *
 * Extends NestJS `BaseExceptionFilter` to inherit proper lifecycle management
 * and HTTP adapter awareness.
 */
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Handle the caught exception and produce a structured error response.
   *
   * @param exception - The caught exception (any type)
   * @param host - NestJS arguments host providing access to request/response
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      super.catch(exception, host);
      return;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      message,
      error: HttpStatus[status] ?? 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers?.['x-request-id'] ?? null,
      ...(process.env.NODE_ENV !== 'production' && exception instanceof Error
        ? { stack: exception.stack }
        : {}),
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${message}`,
        exception instanceof Error ? exception.stack : ''
      );
    }

    response.status(status).json(errorResponse);
  }
}
