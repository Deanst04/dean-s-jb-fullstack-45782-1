import { motion } from 'framer-motion';
import { Fingerprint, Shield } from 'lucide-react';
import type { SessionProps } from '../../models/types';

/**
 * Welcome screen - shown after successful authentication
 * Displays a verification animation before transitioning to dashboard
 */
export function WelcomeScreen({ session }: SessionProps) {
  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center scanlines crt hex-pattern">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {/* Spinning Fingerprint Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, type: 'spring' }}
          className="mb-8"
        >
          <Fingerprint className="w-32 h-32 mx-auto text-neon-green neon-text" />
        </motion.div>

        {/* Identity Verified Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-neon-green neon-text mb-4">
            IDENTITY VERIFIED
          </h1>
        </motion.div>

        {/* Welcome Message with Full Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-2xl text-neon-green font-mono mt-4"
        >
          Welcome, Agent{' '}
          <span className="text-neon-blue neon-text-blue">{session.name}</span>
        </motion.div>

        {/* User ID Hash Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm mt-2"
        >
          <Shield className="w-4 h-4 text-neon-cyan" />
          <span>{session.userId}</span>
        </motion.div>

        {/* Animated Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent mt-8 mx-auto max-w-md"
        />

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-gray-500 mt-4 font-mono text-sm"
        >
          Loading secure dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
}
