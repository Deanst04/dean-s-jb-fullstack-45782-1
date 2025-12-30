import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, ArrowRight, User } from 'lucide-react';

interface SplashScreenProps {
  onJoin: (username: string) => void;
}

export function SplashScreen({ onJoin }: SplashScreenProps) {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="animated-bg" />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-indigo-500/30"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: 0 
          }}
          animate={{ 
            y: [0, -100, 0],
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-8 md:p-12 w-full max-w-md relative"
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10" />
        
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-3">
            Flux Chat
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Real-time conversations, beautifully simple
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Input wrapper */}
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: isFocused 
                  ? '0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)' 
                  : '0 0 0 1px rgba(148, 163, 184, 0.1)',
              }}
              transition={{ duration: 0.2 }}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <User className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-indigo-400' : 'text-slate-500'}`} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your name..."
                className="w-full bg-slate-800/50 text-white placeholder-slate-500 py-4 pl-12 pr-4 outline-none text-lg"
                autoFocus
              />
            </motion.div>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={!username.trim()}
            whileHover={{ scale: username.trim() ? 1.02 : 1 }}
            whileTap={{ scale: username.trim() ? 0.98 : 1 }}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-3
              transition-all duration-300
              ${username.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 cursor-pointer'
                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <span>Join the Conversation</span>
            <motion.div
              animate={{ x: username.trim() ? [0, 5, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.form>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-500 text-xs mt-6"
        >
          Messages are ephemeral • No account needed
        </motion.p>
      </motion.div>
    </div>
  );
}

