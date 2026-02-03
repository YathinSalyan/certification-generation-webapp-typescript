export class DateUtils {
  /**
   * Format date to YYYY-MM-DD for input fields
   */
  static toInputFormat(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  /**
   * Format date to readable format (e.g., "Jan 15, 2024")
   */
  static toReadableFormat(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format date to full format (e.g., "January 15, 2024")
   */
  static toFullFormat(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Check if date is valid
   */
  static isValid(date: string | Date): boolean {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }

  /**
   * Get current date in YYYY-MM-DD format
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}