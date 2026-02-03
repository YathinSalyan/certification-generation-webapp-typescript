import { STORAGE_KEYS } from './constants';

export class StorageUtils {
  /**
   * Get item from localStorage
   */
  static get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  static set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Get admin token
   */
  static getAdminToken(): string | null {
    return this.get(STORAGE_KEYS.ADMIN_TOKEN);
  }

  /**
   * Set admin token
   */
  static setAdminToken(token: string): void {
    this.set(STORAGE_KEYS.ADMIN_TOKEN, token);
  }

  /**
   * Remove admin token
   */
  static removeAdminToken(): void {
    this.remove(STORAGE_KEYS.ADMIN_TOKEN);
  }
}