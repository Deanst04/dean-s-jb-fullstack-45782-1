import type { ComponentType, SVGProps } from 'react';

/**
 * Type for Lucide icons (compatible with all versions)
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

/**
 * Represents a mission in the dashboard
 */
export interface Mission {
  title: string;
  status: MissionStatus;
  progress: number;
}

export type MissionStatus = 'ACTIVE' | 'PENDING' | 'COMPLETE' | 'CLASSIFIED' | 'STANDBY';

/**
 * Represents a system status indicator
 */
export interface StatusItem {
  icon: IconComponent;
  label: string;
  value: string;
}

/**
 * Represents a stat card in the footer
 */
export interface Stat {
  label: string;
  value: string;
}

/**
 * Represents the authenticated user session
 * Centralized data structure for all session-related info
 */
export interface UserSession {
  /** The user's full name from URL param */
  name: string;
  /** Fake "techy" user ID hash for cyberpunk aesthetics */
  userId: string;
  /** Session ID for this login instance */
  sessionId: string;
  /** Timestamp when authentication occurred */
  loginTime: Date;
  /** Formatted login time string */
  loginTimeFormatted: string;
}

/**
 * Props for components that need user info
 */
export interface UserProps {
  user: string;
}

/**
 * Props for components that need full session data
 */
export interface SessionProps {
  session: UserSession;
}

