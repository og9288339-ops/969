/**
 * @module useDebounce
 * @description Production-grade debouncing hook for $10k+ enterprise marketplace
 * @author Senior React Engineer
 * @version 2.1.0
 */

import { useState, useEffect } from 'react';

/**
 * @template T
 * @param {T} value 
 * @param {number} delay 
 * @returns {T}
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
