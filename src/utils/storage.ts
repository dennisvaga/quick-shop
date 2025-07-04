/**
 * Storage utility for browser localStorage
 * Note: This will only work in browser environments
 */

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window !== "undefined") {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Load data from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 * @param key - Storage key to remove
 */
export function removeFromStorage(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
