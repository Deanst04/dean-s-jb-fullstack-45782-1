import { motion } from 'framer-motion';
import { FOOTER_STATS } from '../../data/constants';

/**
 * Footer statistics grid with animated entrance
 */
export function FooterStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {FOOTER_STATS.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

/**
 * Individual stat card with hover effect
 */
function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="border border-neon-green/20 rounded-lg p-4 bg-cyber-dark/30 text-center hover:border-neon-green/40 transition-colors">
      <p className="text-2xl font-display text-neon-green neon-text">
        {value}
      </p>
      <p className="text-xs text-gray-500 font-mono mt-1">
        {label}
      </p>
    </div>
  );
}

