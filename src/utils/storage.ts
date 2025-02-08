export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (!key) return fallback;
    
    try {
      // Check if localStorage is available
      if (!isStorageAvailable('localStorage')) {
        console.warn('localStorage is not available');
        return fallback;
      }

      const item = localStorage.getItem(key);
      if (!item) return fallback;

      try {
        return JSON.parse(item) as T;
      } catch (parseError) {
        console.error(`Error parsing stored value for ${key}:`, parseError);
        // If the stored value is corrupted, remove it
        localStorage.removeItem(key);
        return fallback;
      }
    } catch (error) {
      console.error(`Error accessing localStorage for ${key}:`, error);
      return fallback;
    }
  },
  
  set: (key: string, value: unknown): void => {
    if (!key) {
      console.error('Invalid storage key');
      return;
    }
    
    try {
      // Check if localStorage is available
      if (!isStorageAvailable('localStorage')) {
        console.warn('localStorage is not available');
        return;
      }

      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error('Storage quota exceeded. Trying to clear some space...');
          try {
            // Try to remove old items to make space
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('poker-trainer-')) {
                localStorage.removeItem(key);
              }
            }
            // Try setting the item again
            localStorage.setItem(key, JSON.stringify(value));
          } catch (retryError) {
            console.error('Failed to make space in storage:', retryError);
          }
        } else {
          console.error(`Error saving ${key}:`, error);
        }
      }
    }
  },

  clear: (prefix: string = 'poker-trainer-'): void => {
    try {
      if (!isStorageAvailable('localStorage')) {
        console.warn('localStorage is not available');
        return;
      }

      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

// Helper function to check if storage is available
function isStorageAvailable(type: 'localStorage'): boolean {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}