import { motion } from 'framer-motion';
import { Shield, Wifi, Eye } from 'lucide-react';
import type { UserProps } from '../../models/types';

/**
 * Dashboard header with logo and user info
 */
export function Header({ user }: UserProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b border-neon-green/30 bg-cyber-dark/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-neon-green" />
          <span className="text-xl font-display text-neon-green neon-text">
            NEXUS COMMAND
          </span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-neon-green">
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-mono">SECURE</span>
          </div>
          <div className="flex items-center gap-2 text-neon-green">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-mono">AGENT: {user}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

