import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  LogOut, 
  Radio, 
  MessageCircle,
  Smile
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types/chat';

interface ChatComponentProps {
  username: string;
  onLogout: () => void;
}

// Message bubble component
function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isOwn = message.isOwn;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`max-w-[80%] md:max-w-[65%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Username label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs mb-1 ${
            isOwn ? 'text-right text-indigo-400' : 'text-left text-slate-500'
          }`}
        >
          {isOwn ? 'You' : message.username}
        </motion.p>
        
        {/* Message bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl
            ${isOwn 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md' 
              : 'bg-slate-700/80 text-slate-100 rounded-bl-md'
            }
          `}
        >
          {/* Subtle shine effect for own messages */}
          {isOwn && (
            <div className="absolute inset-0 rounded-2xl rounded-br-md bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          )}
          
          <p className="text-sm md:text-base leading-relaxed break-words relative z-10">
            {message.text}
          </p>
          
          {/* Timestamp */}
          <p className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-slate-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4"
      >
        <MessageCircle className="w-10 h-10 text-slate-500" />
      </motion.div>
      <h3 className="text-slate-400 text-lg font-medium mb-2">No messages yet</h3>
      <p className="text-slate-500 text-sm max-w-xs">
        Be the first to break the silence! Send a message to get the conversation started.
      </p>
    </motion.div>
  );
}

export function ChatComponent({ username, onLogout }: ChatComponentProps) {
  const { messages, sendMessage, isLoading, isPolling } = useChat(username);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-bg" />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass border-b border-slate-700/50 px-4 py-3 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h1 className="text-lg font-bold text-white">Flux Chat</h1>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
              <span className="text-xs text-slate-400">
                Connected as <span className="text-indigo-400 font-medium">{username}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/30"
          >
            <Radio className={`w-4 h-4 ${isPolling ? 'text-emerald-400 live-pulse' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">Live</span>
          </motion.div>

          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors border border-slate-600/30"
            title="Leave chat"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>
      </motion.header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass border-t border-slate-700/50 p-4 relative z-10"
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Emoji button (decorative) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <Smile className="w-6 h-6 text-slate-500 hover:text-slate-400" />
            </motion.button>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full bg-slate-800/60 text-white placeholder-slate-500 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                disabled={isLoading}
              />
              
              {/* Loading indicator inside input */}
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Send button */}
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
              whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
              className={`
                p-3 rounded-xl transition-all duration-200
                ${inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 cursor-pointer'
                  : 'bg-slate-700/50 cursor-not-allowed'
                }
              `}
            >
              <Send className={`w-5 h-5 ${inputValue.trim() && !isLoading ? 'text-white' : 'text-slate-500'}`} />
            </motion.button>
          </div>
        </form>

        {/* Bottom hint */}
        <p className="text-center text-slate-600 text-xs mt-3">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px]">Enter</kbd> to send
        </p>
      </motion.div>
    </div>
  );
}

