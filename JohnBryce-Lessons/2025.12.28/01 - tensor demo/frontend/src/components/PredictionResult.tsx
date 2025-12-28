// ═══════════════════════════════════════════════════════════════
// 🎯 Prediction Result Display Component
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";
import { resultVariants } from "../constants";
import type { PredictionResponse } from "../models";

interface PredictionResultProps {
  result: PredictionResponse | null;
}

// Helper for confidence styling
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "from-emerald-500 to-cyan-500";
  if (confidence >= 0.5) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-pink-500";
}

export function PredictionResult({ result }: PredictionResultProps) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden"
        >
          {/* Result Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">
              Analysis Complete
            </span>
          </div>

          {/* Result Body */}
          <div className="p-5 space-y-5">
            {/* Class Name */}
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Detected Class
              </p>
              <p className="text-2xl font-display font-bold text-gradient">
                {result.class}
              </p>
            </div>

            {/* Confidence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Confidence
                </span>
                <span
                  className={cn(
                    "text-lg font-bold font-mono",
                    result.confidence >= 0.8
                      ? "text-emerald-400"
                      : result.confidence >= 0.5
                      ? "text-amber-400"
                      : "text-rose-400"
                  )}
                >
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r relative",
                    getConfidenceColor(result.confidence)
                  )}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

