import { useState, useEffect, useMemo } from 'react';
import { ANIMATION } from '../data/constants';
import type { UserSession } from '../models/types';

interface UseUserReturn {
  /** The raw user name from URL (null if not present) */
  user: string | null;
  /** Full session object with all computed data */
  session: UserSession | null;
  /** Whether to show the welcome screen animation */
  showWelcome: boolean;
}

/**
 * Generates a fake "techy" hash from a string
 * Creates that cyberpunk aesthetic with hex-like characters
 */
function generateUserHash(name: string): string {
  // Simple hash algorithm - converts name to a hex-like string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex and make it look "techy"
  const hexPart = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `USR-${hexPart}`;
}

/**
 * Generates a random session ID with a techy format
 */
function generateSessionId(): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `SES-${random}-${timestamp}`;
}

/**
 * Formats a date into a cyberpunk-style timestamp
 */
function formatLoginTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', ' //');
}

/**
 * Custom hook to handle user authentication via URL parameters
 * Reads the 'user' query parameter and manages session state
 * 
 * @returns {UseUserReturn} User state, session data, and welcome screen flag
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loginTime] = useState<Date>(() => new Date()); // Captured once on mount

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    setUser(userParam);

    // If user exists, hide welcome screen after animation completes
    if (userParam) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, ANIMATION.WELCOME_DURATION);

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }
  }, []);

  // Compute session data only when user changes (stable reference)
  const session = useMemo<UserSession | null>(() => {
    if (!user) return null;

    return {
      name: user,
      userId: generateUserHash(user),
      sessionId: generateSessionId(),
      loginTime,
      loginTimeFormatted: formatLoginTime(loginTime),
    };
  }, [user, loginTime]);

  return { user, session, showWelcome };
}
