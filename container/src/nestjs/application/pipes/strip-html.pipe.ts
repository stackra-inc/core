/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file strip-html.pipe.ts
 * @module @stackra/container/nestjs
 * @description Sanitizes HTML from string inputs to prevent XSS.
 *   Strips all HTML tags from string values.
 *   Apply globally or per-field via a decorator (todo).
 */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

/**
 * Global HTML tag stripping pipe for XSS prevention.
 *
 * Recursively removes all HTML tags from string values in incoming request data.
 * Provides a basic defense-in-depth layer against stored XSS attacks by ensuring
 * that no HTML markup can be persisted through API inputs.
 *
 * Handles:
 * - Simple string values (strip tags)
 * - Nested objects (recursive strip)
 * - Skips arrays and non-plain objects
 */
@Injectable()
export class StripHtmlPipe implements PipeTransform {
  private readonly htmlRegex = /<[^>]*>/g;

  /**
   * Transform the incoming value by stripping HTML tags from all strings.
   *
   * @param value - The incoming value (string, object, or other)
   * @param _metadata - Argument metadata (unused)
   * @returns The sanitized value with HTML tags removed
   */
  public transform(value: any, _metadata: ArgumentMetadata): any {
    if (typeof value === 'string') return this.strip(value);
    if (typeof value === 'object' && value !== null) return this.stripObject(value);
    return value;
  }

  /**
   * Remove all HTML tags from a string.
   *
   * @param str - The string to sanitize
   * @returns The string with all HTML tags removed
   */
  private strip(str: string): string {
    return str.replace(this.htmlRegex, '');
  }

  /**
   * Recursively strip HTML from all string properties in an object.
   *
   * @param obj - The object to process
   * @returns A new object with all string values sanitized
   */
  private stripObject(obj: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') cleaned[key] = this.strip(value);
      else if (typeof value === 'object' && value !== null && !Array.isArray(value))
        cleaned[key] = this.stripObject(value);
      else cleaned[key] = value;
    }
    return cleaned;
  }
}
