/**
 * @module useLocalStorage
 * @description Production-grade localStorage hook with multi-tab sync ($10k+ marketplace)
 * @author Senior React Engineer
 * @version 3.0.0
 */

import { useState, useEffect } from 'react';

/**
 * @template T
 * @param {string} key 
 * @param {T} initialValue 
 * @returns {[T, Function]}
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`⚠️ LOCAL_STORAGE_READ_ERROR [${key}]:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`❌ LOCAL_STORAGE_WRITE_ERROR [${key}]:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (err) {
          console.error("⚠️ SYNC_PARSE_ERROR:", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
