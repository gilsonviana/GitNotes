import { useEffect, useCallback } from 'react';

export const useKeyboardShortcut = (key: string, handler: () => void) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === key) {
      event.preventDefault();
      handler();
    }
  }, [key, handler]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
