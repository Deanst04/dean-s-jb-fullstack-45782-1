import { useState, useEffect } from 'react';
import { SYSTEM_LOGS, ANIMATION } from '../data/constants';

/**
 * Custom hook to manage the scrolling system logs effect
 * Progressively adds logs at a set interval to create a "live feed" effect
 * 
 * @param isActive - Whether the logs should be actively updating
 */
export function useSystemLogs(isActive: boolean): string[] {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  useEffect(() => {
    // Don't run if not active
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentLogIndex((prev) => {
        const nextIndex = (prev + 1) % SYSTEM_LOGS.length;
        
        setDisplayedLogs((logs) => {
          const newLogs = [...logs, SYSTEM_LOGS[nextIndex]];
          // Keep only the last N logs for performance
          return newLogs.slice(-ANIMATION.MAX_VISIBLE_LOGS);
        });
        
        return nextIndex;
      });
    }, ANIMATION.LOG_INTERVAL);

    // Cleanup interval on unmount or when isActive changes
    return () => clearInterval(interval);
  }, [isActive]);

  return displayedLogs;
}

