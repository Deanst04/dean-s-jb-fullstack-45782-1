import { motion } from 'framer-motion';
import { Unlock, CheckCircle2, Clock, Hash, User, Shield } from 'lucide-react';
import type { SessionProps } from '../../models/types';

/**
 * Identity Card - Displays authenticated user information prominently
 * Shows user name, ID hash, session ID, and login timestamp
 */
export function IdentityCard({ session }: SessionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="neon-border rounded-lg p-6 bg-cyber-dark/50 hover-card pulse-ring">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Animated Lock Icon */}
          <div className="relative flex-shrink-0">
            <Unlock className="w-16 h-16 text-neon-green" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-2 border-2 border-neon-green/50 rounded-full"
            />
          </div>

          {/* Main Info */}
          <div className="flex-grow">
            {/* Verified Badge */}
            <h2 className="text-xl font-display text-neon-green neon-text flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              ACCESS GRANTED
            </h2>

            {/* Prominent User Name */}
            <div className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Welcome, Agent{' '}
              <span className="text-neon-blue neon-text-blue">{session.name}</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-mono">
              {/* User ID Hash */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neon-green" />
                <span className="text-gray-500">USER ID:</span>
                <span className="text-neon-cyan">{session.userId}</span>
              </div>

              {/* Session ID */}
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-neon-green" />
                <span className="text-gray-500">SESSION:</span>
                <span className="text-neon-purple">{session.sessionId}</span>
              </div>

              {/* Login Time */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-green" />
                <span className="text-gray-500">LOGGED IN:</span>
                <span className="text-neon-yellow">{session.loginTimeFormatted}</span>
              </div>

              {/* Clearance Level */}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                <span className="text-gray-500">CLEARANCE:</span>
                <span className="text-neon-blue">OMEGA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
