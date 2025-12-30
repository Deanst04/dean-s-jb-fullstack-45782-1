import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { SplashScreen } from './components/SplashScreen';
import { ChatComponent } from './components/ChatComponent';

function App() {
  const [username, setUsername] = useState<string>('');

  const handleJoin = (name: string) => {
    setUsername(name);
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <>
      {/* Toast notifications container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />

      {/* Main content with animated transitions */}
      <AnimatePresence mode="wait">
        {!username ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <SplashScreen onJoin={handleJoin} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatComponent username={username} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
