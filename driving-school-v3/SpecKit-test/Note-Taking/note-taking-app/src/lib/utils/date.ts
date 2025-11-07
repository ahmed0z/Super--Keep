/**
 * Date Utilities
 * Functions for date formatting and manipulation
 */

import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }

  return format(date, 'MMM d, yyyy');
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
