// ═══════════════════════════════════════════════════════════════
// 🎓 Training Success Display Component
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { resultVariants } from "../constants";
import type { TrainSuccessState } from "../models";

interface TrainSuccessResultProps {
  success: TrainSuccessState | null;
}

export function TrainSuccessResult({ success }: TrainSuccessResultProps) {
  return (
    <AnimatePresence>
      {success && (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 overflow-hidden"
        >
          {/* Success Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-cyan-500/10 border-b border-cyan-500/10">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
              Training Complete
            </span>
          </div>

          {/* Success Body */}
          <div className="p-5 text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/25"
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </motion.div>
            <p className="text-lg font-semibold text-white">{success.message}</p>
            <p className="text-sm text-slate-400">
              Total classes:{" "}
              <span className="text-cyan-400 font-mono font-bold">
                {success.classCount}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

