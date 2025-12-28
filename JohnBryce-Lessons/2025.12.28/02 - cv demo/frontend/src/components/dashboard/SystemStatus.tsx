import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { STATUS_ITEMS } from '../../data/constants';

interface SystemStatusProps {
  logs: string[];
}

/**
 * System status panel with live scrolling logs
 */
export function SystemStatus({ logs }: SystemStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-1"
    >
      <div className="neon-border rounded-lg p-6 bg-cyber-dark/50 h-full">
        {/* Title */}
        <h3 className="text-lg font-display text-neon-green mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          SYSTEM STATUS
        </h3>

        {/* Status Indicators */}
        <StatusIndicators />

        {/* Live Feed */}
        <LiveFeed logs={logs} />
      </div>
    </motion.div>
  );
}

/**
 * Grid of system status indicators
 */
function StatusIndicators() {
  return (
    <div className="space-y-3 mb-6">
      {STATUS_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="flex items-center justify-between text-sm font-mono"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <item.icon className="w-4 h-4 text-neon-green" />
            {item.label}
          </div>
          <span className="text-neon-green">{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface LiveFeedProps {
  logs: string[];
}

/**
 * Scrolling terminal-style log display
 */
function LiveFeed({ logs }: LiveFeedProps) {
  return (
    <div className="border-t border-neon-green/30 pt-4">
      <h4 className="text-sm text-gray-500 mb-2 font-mono">LIVE FEED</h4>
      <div className="h-48 overflow-hidden bg-cyber-black/50 rounded p-2 font-mono text-xs">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={`${log}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-neon-green/80 mb-1"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="terminal-cursor text-neon-green" />
      </div>
    </div>
  );
}

