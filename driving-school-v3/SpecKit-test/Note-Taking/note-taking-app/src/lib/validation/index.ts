/**
 * Validation Utilities
 * Helper functions for data validation
 */

import { z } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodIssue[];
}

export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.issues,
  };
}

export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Validation failed'
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new Error(`${errorMessage}: ${errorDetails}`);
    }
    throw error;
  }
}

export function getFirstError(errors?: z.ZodIssue[]): string | null {
  if (!errors || errors.length === 0) {
    return null;
  }
  const firstError = errors[0];
  return `${firstError.path.join('.')}: ${firstError.message}`;
}
