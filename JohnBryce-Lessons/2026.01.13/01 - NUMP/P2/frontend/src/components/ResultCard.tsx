import { motion } from 'framer-motion';
import { PredictionResponse } from '../types';
import ConfidenceGauge from './ConfidenceGauge';

interface ResultCardProps {
  result: PredictionResponse;
  imagePreview: string | null;
  onReset: () => void;
}

export default function ResultCard({ result, imagePreview, onReset }: ResultCardProps) {
  const getHeadline = () => {
    switch (result.prediction) {
      case 'Lily':
        return { text: "It's a Lily!", emoji: '🌸', color: 'text-forest-600' };
      case 'Possibly Lily':
        return { text: 'Possibly a Lily', emoji: '🌱', color: 'text-yellow-600' };
      case 'Not Lily':
        return { text: 'Not a Lily', emoji: '🌿', color: 'text-lily-600' };
    }
  };

  const headline = getHeadline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-3xl p-8"
    >
      {/* Image preview */}
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-2xl overflow-hidden"
        >
          <img
            src={imagePreview}
            alt="Analyzed flower"
            className="w-full h-48 object-cover"
          />
        </motion.div>
      )}

      {/* Result headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-5xl block mb-3"
        >
          {headline.emoji}
        </motion.span>
        <h2 className={`text-3xl font-bold ${headline.color}`}>
          {headline.text}
        </h2>
      </motion.div>

      {/* Confidence gauge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-6"
      >
        <ConfidenceGauge
          confidence={result.confidence}
          prediction={result.prediction}
        />
      </motion.div>

      {/* Note from backend */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-gray-600 mb-8 px-4"
      >
        {result.note}
      </motion.p>

      {/* Action button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-forest-500 to-forest-600
                   text-white font-semibold shadow-lg shadow-forest-500/30
                   hover:from-forest-600 hover:to-forest-700 transition-all"
      >
        Analyze Another Flower
      </motion.button>
    </motion.div>
  );
}
