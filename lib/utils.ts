/**
 * Utility for merging class names.
 * Simple implementation — no external dependencies needed.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a phone number for tel: links.
 */
export function formatPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}
