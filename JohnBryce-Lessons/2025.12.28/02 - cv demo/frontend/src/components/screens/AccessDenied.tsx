import { motion } from 'framer-motion';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

/**
 * Access Denied screen - shown when no user parameter is present
 * Features a glitchy, red-themed cyberpunk aesthetic
 */
export function AccessDenied() {
  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center scanlines crt">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        {/* Pulsing Shield Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <ShieldAlert className="w-32 h-32 mx-auto text-neon-red" />
        </motion.div>

        {/* Glitch Title */}
        <h1
          className="glitch text-6xl md:text-8xl font-display font-bold text-neon-red mb-4 neon-text-red"
          data-text="ACCESS DENIED"
        >
          ACCESS DENIED
        </h1>

        {/* Warning Message */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8"
        >
          <Lock className="w-16 h-16 mx-auto text-neon-red mb-4" />
          <p className="text-xl text-neon-red font-mono">
            UNAUTHORIZED ACCESS ATTEMPT DETECTED
          </p>
          <p className="text-sm text-gray-500 mt-4 font-mono">
            ERROR CODE: 0x7B3F9A2E
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 bg-neon-red mt-8 mx-auto max-w-md"
        />

        {/* Hint */}
        <p className="text-gray-600 mt-8 text-sm font-mono">
          Hint: Try accessing with ?user=YourName
        </p>
      </motion.div>

      {/* Floating Alert Icons */}
      <FloatingAlerts />
    </div>
  );
}

/**
 * Floating warning triangles in the background
 */
function FloatingAlerts() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-neon-red/30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            rotate: 360,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <AlertTriangle className="w-8 h-8" />
        </motion.div>
      ))}
    </>
  );
}

