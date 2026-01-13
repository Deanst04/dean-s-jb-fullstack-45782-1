import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionStatus } from '../types';

interface UploadCardProps {
  status: PredictionStatus;
  imagePreview: string | null;
  error: string | null;
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

const analyzingMessages = [
  'Analyzing petal structure...',
  'Examining color patterns...',
  'Processing leaf shapes...',
  'Running neural network...',
  'Computing confidence...',
];

export default function UploadCard({
  status,
  imagePreview,
  error,
  onImageSelect,
  onAnalyze,
  onReset,
}: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle through analyzing messages
  useState(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % analyzingMessages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-3xl p-8"
    >
      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={onReset}
              className="mt-2 text-red-600 text-sm font-medium hover:underline"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!imagePreview ? handleClick : undefined}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300
          ${!imagePreview ? 'cursor-pointer hover:border-forest-400 hover:bg-forest-50/50' : ''}
          ${isDragging ? 'border-forest-500 bg-forest-50' : 'border-forest-200'}
          ${imagePreview ? 'border-solid border-forest-300' : ''}
          min-h-[280px] flex items-center justify-center overflow-hidden
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {imagePreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
              <img
                src={imagePreview}
                alt="Selected flower"
                className="w-full h-64 object-cover rounded-xl"
              />
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="text-6xl mb-4"
              >
                🌸
              </motion.div>
              <p className="text-forest-700 font-medium mb-2">
                Drop your flower image here
              </p>
              <p className="text-forest-500 text-sm">
                or click to browse (JPG, PNG)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyzing overlay */}
        <AnimatePresence>
          {status === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center"
            >
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-forest-200 mb-4"
              />
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-forest-700 font-medium"
              >
                {analyzingMessages[messageIndex]}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-3">
        {imagePreview && status !== 'analyzing' && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReset}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-forest-300 text-forest-700 font-medium
                         hover:bg-forest-50 transition-colors"
            >
              Change Image
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAnalyze}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-forest-500 to-forest-600
                         text-white font-semibold shadow-lg shadow-forest-500/30
                         hover:from-forest-600 hover:to-forest-700 transition-all"
            >
              Analyze Flower
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
