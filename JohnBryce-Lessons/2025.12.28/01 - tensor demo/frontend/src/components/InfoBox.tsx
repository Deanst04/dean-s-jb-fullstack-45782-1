// ═══════════════════════════════════════════════════════════════
// 💡 Info Box Component
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { itemVariants } from "../constants";

interface InfoBoxProps {
  children: React.ReactNode;
}

export function InfoBox({ children }: InfoBoxProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-3 p-4 rounded-xl bg-slate-500/5 border border-slate-500/10"
    >
      <Sparkles className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-slate-400 leading-relaxed">{children}</p>
    </motion.div>
  );
}

