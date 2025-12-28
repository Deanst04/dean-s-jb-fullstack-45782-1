// ═══════════════════════════════════════════════════════════════
// 🎩 Header Component
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { itemVariants } from "../constants";

export function Header() {
  return (
    <motion.div variants={itemVariants} className="p-6 pb-4 text-center">
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 shadow-lg shadow-violet-500/25"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>
      <h1 className="text-3xl font-display font-bold text-gradient mb-2">
        Vision AI
      </h1>
      <p className="text-sm text-slate-400 tracking-wide uppercase">
        Neural Image Classification
      </p>
    </motion.div>
  );
}

