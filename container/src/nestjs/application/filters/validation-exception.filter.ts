/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file validation-exception.filter.ts
 * @module @stackra/container/nestjs
 * @description Formats class-validator errors into a clean
 *   { errors: [{ field, message, constraint }] } shape.
 *   Catches BadRequestException thrown by ValidationPipe.
 */
import { Catch, BadRequestException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

/**
 * Validation exception formatter filter.
 *
 * Intercepts `BadRequestException` instances (typically thrown by the global
 * `ValidationPipe`) and reformats them into a structured validation error
 * response with a 422 status code. Provides a consistent, frontend-friendly
 * shape for form validation errors.
 *
 * Response format:
 * ```json
 * {
 *   "statusCode": 422,
 *   "error": "Validation Error",
 *   "message": "One or more fields failed validation.",
 *   "errors": [{ "message": "..." }, ...],
 *   "timestamp": "...",
 *   "path": "...",
 *   "requestId": "..."
 * }
 * ```
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  /**
   * Handle the caught BadRequestException and produce validation error response.
   *
   * @param exception - The caught BadRequestException (from ValidationPipe)
   * @param host - NestJS arguments host providing access to request/response
   */
  public catch(exception: BadRequestException, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse() as any;

    // class-validator errors come as { message: string[] } or { message: [{...}] }
    const messages = exceptionResponse?.message;
    const errors = Array.isArray(messages)
      ? messages.map((msg: any) => (typeof msg === 'string' ? { message: msg } : msg))
      : [{ message: exception.message }];

    response.status(422).json({
      statusCode: 422,
      error: 'Validation Error',
      message: 'One or more fields failed validation.',
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers?.['x-request-id'] ?? null,
    });
  }
}
