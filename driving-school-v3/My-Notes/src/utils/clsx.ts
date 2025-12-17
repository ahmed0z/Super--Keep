/**
 * Utility function for conditional class names.
 * A minimal implementation of the clsx library.
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function clsx(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = clsx(...arg);
      if (inner) classes.push(inner);
    }
  }

  return classes.join(' ');
}

/**
 * Merge class names with Tailwind CSS conflict resolution.
 * Prefers later classes when there are conflicts.
 */
export function cn(...args: ClassValue[]): string {
  return clsx(...args);
}
