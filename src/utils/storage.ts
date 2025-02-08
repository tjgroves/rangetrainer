export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (!key) return fallback;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },
  
  set: (key: string, value: unknown): void => {
    if (!key) {
      console.error('Invalid storage key');
      return;
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }
};