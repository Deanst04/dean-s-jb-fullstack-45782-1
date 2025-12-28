import { Cpu, Database, Globe, Satellite, Radio } from 'lucide-react';
import type { Mission, StatusItem, Stat } from '../models/types';

/**
 * Fake system logs for the scrolling terminal effect
 */
export const SYSTEM_LOGS: string[] = [
  '> Initializing secure connection...',
  '> Establishing encrypted tunnel...',
  '> Connecting to satellite network...',
  '> Decrypting payload...',
  '> Verifying biometric signature...',
  '> Loading classified modules...',
  '> Synchronizing with HQ database...',
  '> Firewall status: ACTIVE',
  '> Intrusion detection: MONITORING',
  '> Neural link established...',
  '> Quantum encryption: ENABLED',
  '> GPS spoofing: ACTIVE',
  '> Voice modulation: READY',
  '> Stealth mode: ENGAGED',
  '> Mission parameters loaded...',
  '> Awaiting agent commands...',
  '> System integrity: 100%',
  '> Memory allocation: OPTIMAL',
  '> Core temperature: NOMINAL',
  '> All systems operational...',
];

/**
 * Mission data cards for the dashboard
 */
export const MISSIONS: Mission[] = [
  { title: 'Operation Blackout', status: 'ACTIVE', progress: 78 },
  { title: 'Protocol Omega', status: 'PENDING', progress: 45 },
  { title: 'Project Chimera', status: 'COMPLETE', progress: 100 },
  { title: 'Task Force Delta', status: 'ACTIVE', progress: 62 },
  { title: 'Ghost Protocol', status: 'CLASSIFIED', progress: 0 },
  { title: 'Operation Viper', status: 'STANDBY', progress: 23 },
];

/**
 * System status indicators
 */
export const STATUS_ITEMS: StatusItem[] = [
  { icon: Cpu, label: 'CPU Core', value: '98%' },
  { icon: Database, label: 'Database', value: 'ONLINE' },
  { icon: Globe, label: 'Network', value: 'SECURE' },
  { icon: Satellite, label: 'Satellite', value: 'LINKED' },
  { icon: Radio, label: 'Comms', value: 'ACTIVE' },
];

/**
 * Footer statistics
 */
export const FOOTER_STATS: Stat[] = [
  { label: 'Active Missions', value: '12' },
  { label: 'Agents Online', value: '47' },
  { label: 'Threats Neutralized', value: '2,847' },
  { label: 'System Uptime', value: '99.97%' },
];

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION = {
  WELCOME_DURATION: 3000,
  LOG_INTERVAL: 800,
  MAX_VISIBLE_LOGS: 15,
} as const;

