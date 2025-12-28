// ═══════════════════════════════════════════════════════════════
// 🔘 Action Button Component
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Loader2, Zap, Brain } from "lucide-react";
import { cn } from "../lib/utils";
import { itemVariants } from "../constants";

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  variant: "identify" | "train";
}

export function ActionButton({
  onClick,
  disabled,
  isLoading,
  variant,
}: ActionButtonProps) {
  const config = {
    identify: {
      gradient: "from-violet-600 to-fuchsia-600",
      shadow: "shadow-violet-500/25 hover:shadow-violet-500/40",
      icon: Zap,
      text: "Identify Image",
      loadingText: "Analyzing...",
    },
    train: {
      gradient: "from-cyan-600 to-teal-600",
      shadow: "shadow-cyan-500/25 hover:shadow-cyan-500/40",
      icon: Brain,
      text: "Train Model",
      loadingText: "Training Model...",
    },
  };

  const { gradient, shadow, icon: Icon, text, loadingText } = config[variant];

  return (
    <motion.div variants={itemVariants}>
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300",
          "flex items-center justify-center gap-2",
          disabled
            ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
            : `bg-gradient-to-r ${gradient} text-white shadow-lg ${shadow} hover:scale-[1.02]`
        )}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <Icon className="w-5 h-5" />
            <span>{text}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

