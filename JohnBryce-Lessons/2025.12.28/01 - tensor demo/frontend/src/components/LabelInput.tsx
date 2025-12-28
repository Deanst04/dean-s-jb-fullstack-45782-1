// ═══════════════════════════════════════════════════════════════
// 🏷️ Label Input Component (for Teach Mode)
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "../lib/utils";
import { itemVariants } from "../constants";

interface LabelInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LabelInput({ value, onChange }: LabelInputProps) {
  return (
    <motion.div variants={itemVariants}>
      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
        Class Label
      </label>
      <div className="relative">
        <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Guitar, Cat, Flower..."
          className={cn(
            "w-full py-3.5 pl-12 pr-4 rounded-xl text-sm text-white placeholder-slate-500",
            "bg-white/[0.03] border border-white/[0.08]",
            "focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-500/5",
            "focus:ring-2 focus:ring-cyan-400/20",
            "transition-all duration-300"
          )}
        />
        {/* Glowing border on focus */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ boxShadow: "0 0 0 rgba(34, 211, 238, 0)" }}
          whileFocus={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.15)" }}
        />
      </div>
    </motion.div>
  );
}

