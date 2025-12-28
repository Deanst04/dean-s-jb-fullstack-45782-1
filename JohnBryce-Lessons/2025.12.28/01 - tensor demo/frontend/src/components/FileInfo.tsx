// ═══════════════════════════════════════════════════════════════
// 📄 File Info Display Component
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";

interface FileInfoProps {
  file: File | null;
}

export function FileInfo({ file }: FileInfoProps) {
  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="text-sm text-slate-300 truncate max-w-[60%]">
            {file.name}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

