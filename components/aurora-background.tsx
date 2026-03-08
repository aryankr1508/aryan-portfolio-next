"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-40 overflow-hidden bg-zinc-950"
    >
      {/* Primary teal blob — top-left drift */}
      <motion.div
        className="absolute -left-[10%] -top-[14%] h-[56vh] w-[56vh] rounded-full bg-teal-500/[0.07] blur-[120px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Purple/indigo blob — top-right drift */}
      <motion.div
        className="absolute -right-[8%] top-[6%] h-[48vh] w-[48vh] rounded-full bg-indigo-500/[0.06] blur-[110px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.9, 1.12, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Amber accent blob — center-bottom drift */}
      <motion.div
        className="absolute bottom-[8%] left-[30%] h-[40vh] w-[40vh] rounded-full bg-amber-500/[0.04] blur-[100px]"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary teal bloom — mid-right */}
      <motion.div
        className="absolute right-[15%] top-[45%] h-[36vh] w-[36vh] rounded-full bg-cyan-500/[0.05] blur-[100px]"
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
