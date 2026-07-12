/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file trim.pipe.ts
 * @module @stackra/container/nestjs
 * @description Globally trims whitespace from all string values in request body/query/params.
 *   Applied as a global pipe — all string inputs are trimmed automatically.
 */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

/**
 * Global whitespace trimming pipe.
 *
 * Recursively trims all string values in incoming request data (body, query,
 * params). Prevents accidental leading/trailing whitespace from polluting
 * the database or causing validation issues.
 *
 * Handles:
 * - Simple string values (direct trim)
 * - Nested objects (recursive trim)
 * - Skips arrays, Dates, and non-plain objects
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  /**
   * Transform the incoming value by trimming all strings.
   *
   * @param value - The incoming value (string, object, or other)
   * @param _metadata - Argument metadata (unused)
   * @returns The trimmed value
   */
  public transform(value: any, _metadata: ArgumentMetadata): any {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object' && value !== null) return this.trimObject(value);
    return value;
  }

  /**
   * Recursively trim all string properties in an object.
   *
   * @param obj - The object to process
   * @returns A new object with all string values trimmed
   */
  private trimObject(obj: Record<string, any>): Record<string, any> {
    const trimmed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') trimmed[key] = value.trim();
      else if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      )
        trimmed[key] = this.trimObject(value);
      else trimmed[key] = value;
    }
    return trimmed;
  }
}
