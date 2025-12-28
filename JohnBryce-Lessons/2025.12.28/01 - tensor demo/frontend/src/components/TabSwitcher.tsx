// ═══════════════════════════════════════════════════════════════
// 🔀 Tab Switcher Component
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Search, GraduationCap } from "lucide-react";
import { cn } from "../lib/utils";
import type { TabMode } from "../models";
import { itemVariants } from "../constants";

interface TabSwitcherProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <motion.div variants={itemVariants} className="px-6 pb-4">
      <div className="relative flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 shadow-lg"
          layoutId="activeTab"
          initial={false}
          animate={{
            left: activeTab === "identify" ? "4px" : "50%",
            right: activeTab === "identify" ? "50%" : "4px",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />

        {/* Identify Tab */}
        <button
          onClick={() => onTabChange("identify")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
            activeTab === "identify"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
          )}
        >
          <Search className="w-4 h-4" />
          <span>Identify</span>
        </button>

        {/* Teach Tab */}
        <button
          onClick={() => onTabChange("teach")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
            activeTab === "teach"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
          )}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Teach</span>
        </button>
      </div>
    </motion.div>
  );
}

