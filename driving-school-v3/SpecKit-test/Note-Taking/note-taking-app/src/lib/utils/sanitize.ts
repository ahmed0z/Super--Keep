/**
 * Sanitization Utilities
 * Functions for sanitizing user input
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * For now, we'll use a basic approach that escapes HTML entities
 * In production, consider using a library like DOMPurify
 */
export function sanitizeHTML(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Remove potential XSS vectors from user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Sanitize tag input
 * - Remove special characters
 * - Convert to lowercase
 * - Trim whitespace
 */
export function sanitizeTag(tag: string): string {
  return tag
    .replace(/[^\w\s-]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Sanitize search query
 * - Remove special characters that could cause issues
 * - Trim whitespace
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
