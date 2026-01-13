import { motion } from 'framer-motion';

interface ConfidenceGaugeProps {
  confidence: number;
  prediction: 'Lily' | 'Possibly Lily' | 'Not Lily';
}

export default function ConfidenceGauge({ confidence, prediction }: ConfidenceGaugeProps) {
  // SVG circle parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = confidence / 100;
  const strokeDashoffset = circumference * (1 - fillPercent);

  // Color based on prediction
  const getColor = () => {
    switch (prediction) {
      case 'Lily':
        return {
          stroke: '#22c55e',
          bg: '#dcfce7',
          text: 'text-forest-600',
        };
      case 'Possibly Lily':
        return {
          stroke: '#eab308',
          bg: '#fef9c3',
          text: 'text-yellow-600',
        };
      case 'Not Lily':
        return {
          stroke: '#d17d64',
          bg: '#f9ede7',
          text: 'text-lily-600',
        };
    }
  };

  const colors = getColor();

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-3xl font-bold ${colors.text}`}
        >
          {confidence.toFixed(1)}%
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-1"
        >
          confidence
        </motion.span>
      </div>
    </div>
  );
}
