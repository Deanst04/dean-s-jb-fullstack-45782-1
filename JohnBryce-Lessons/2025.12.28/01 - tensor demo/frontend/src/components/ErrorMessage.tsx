// ═══════════════════════════════════════════════════════════════
// ⚠️ Error Message Component
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { resultVariants } from "../constants";

interface ErrorMessageProps {
  error: string | null;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-300">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

