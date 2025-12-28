// ═══════════════════════════════════════════════════════════════
// 📁 Upload Zone Component
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, RefreshCw, X } from "lucide-react";
import { cn } from "../lib/utils";
import { itemVariants } from "../constants";

interface UploadZoneProps {
  preview: string | null;
  isDragging: boolean;
  isLoading: boolean;
  variant?: "violet" | "cyan"; // Color variant for different modes
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onSelectClick: () => void;
  onClear: () => void;
}

export function UploadZone({
  preview,
  isDragging,
  isLoading,
  variant = "violet",
  onDragOver,
  onDragLeave,
  onDrop,
  onSelectClick,
  onClear,
}: UploadZoneProps) {
  const colors = {
    violet: {
      border: "border-violet-400",
      bg: "bg-violet-500/10",
      hover: "hover:border-violet-400/50 hover:bg-violet-500/5",
      icon: "text-violet-400",
      scanner: "via-violet-400",
    },
    cyan: {
      border: "border-cyan-400",
      bg: "bg-cyan-500/10",
      hover: "hover:border-cyan-400/50 hover:bg-cyan-500/5",
      icon: "text-cyan-400",
      scanner: "via-cyan-400",
    },
  };

  const colorConfig = colors[variant];
  const placeholderText =
    variant === "cyan" ? "Upload an image to teach" : "Click or drag to upload";

  return (
    <motion.div variants={itemVariants}>
      <motion.div
        onClick={!preview ? onSelectClick : undefined}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer group",
          isDragging
            ? `${colorConfig.border} ${colorConfig.bg}`
            : preview
            ? "border-white/20 bg-white/5"
            : `border-white/10 bg-white/[0.03] ${colorConfig.hover}`
        )}
        whileHover={!preview ? { scale: 1.01 } : {}}
        whileTap={!preview ? { scale: 0.99 } : {}}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClick();
                  }}
                  className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Scanner animation during loading */}
              {isLoading && (
                <motion.div
                  className={cn(
                    "absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent",
                    colorConfig.scanner
                  )}
                  animate={{ top: ["0%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                className={cn(
                  "p-4 rounded-2xl bg-white/5 border border-white/10 transition-colors",
                  `group-hover:border-${variant}-400/30`
                )}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {isDragging ? (
                  <ImageIcon className={cn("w-8 h-8", colorConfig.icon)} />
                ) : (
                  <Upload
                    className={cn(
                      "w-8 h-8 text-slate-400 transition-colors",
                      `group-hover:${colorConfig.icon}`
                    )}
                  />
                )}
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-300">
                  {isDragging ? "Drop your image here" : placeholderText}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

