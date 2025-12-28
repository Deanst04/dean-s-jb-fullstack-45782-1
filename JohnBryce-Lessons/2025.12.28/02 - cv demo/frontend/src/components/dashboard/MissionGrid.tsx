import { motion } from 'framer-motion';
import { Activity, Lock } from 'lucide-react';
import type { Mission, MissionStatus } from '../../models/types';
import { MISSIONS } from '../../data/constants';

/**
 * Grid of mission cards with progress indicators
 */
export function MissionGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="lg:col-span-2"
    >
      <div className="neon-border rounded-lg p-6 bg-cyber-dark/50">
        {/* Title */}
        <h3 className="text-lg font-display text-neon-green mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          MISSION DATA
        </h3>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MISSIONS.map((mission, i) => (
            <MissionCard key={mission.title} mission={mission} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface MissionCardProps {
  mission: Mission;
  index: number;
}

/**
 * Individual mission card with status badge and progress bar
 */
function MissionCard({ mission, index }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="border border-neon-green/30 rounded-lg p-4 bg-cyber-black/50 hover:border-neon-green/60 hover:shadow-neon-green-sm transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-mono text-neon-green">{mission.title}</h4>
        <StatusBadge status={mission.status} />
      </div>

      {/* Progress Bar or Classified Lock */}
      {mission.status !== 'CLASSIFIED' ? (
        <ProgressBar progress={mission.progress} />
      ) : (
        <ClassifiedLock />
      )}
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: MissionStatus;
}

/**
 * Color-coded status badge
 */
function StatusBadge({ status }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);

  return (
    <span className={`text-xs font-mono px-2 py-1 rounded ${colorClasses}`}>
      {status}
    </span>
  );
}

/**
 * Get Tailwind classes for status badge colors
 */
function getStatusColor(status: MissionStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-900/50 text-green-400';
    case 'COMPLETE':
      return 'bg-blue-900/50 text-blue-400';
    case 'CLASSIFIED':
      return 'bg-red-900/50 text-red-400';
    case 'PENDING':
    case 'STANDBY':
    default:
      return 'bg-yellow-900/50 text-yellow-400';
  }
}

interface ProgressBarProps {
  progress: number;
}

/**
 * Animated progress bar
 */
function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative h-2 bg-cyber-black rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute h-full bg-gradient-to-r from-neon-green/50 to-neon-green rounded-full"
      />
    </div>
  );
}

/**
 * Lock icon for classified missions
 */
function ClassifiedLock() {
  return (
    <div className="text-center py-2">
      <Lock className="w-4 h-4 mx-auto text-red-400" />
    </div>
  );
}

