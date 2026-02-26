"use client";

import { motion } from "framer-motion";

type SectionAmbientProps = {
  tone?: "teal" | "orange" | "sky";
};

const toneMap = {
  teal: ["rgba(15,118,110,0.22)", "rgba(20,184,166,0.17)", "rgba(249,115,22,0.12)"],
  orange: ["rgba(249,115,22,0.22)", "rgba(251,146,60,0.16)", "rgba(15,118,110,0.1)"],
  sky: ["rgba(2,132,199,0.2)", "rgba(14,165,233,0.14)", "rgba(15,118,110,0.12)"]
} as const;

export default function SectionAmbient({ tone = "teal" }: SectionAmbientProps) {
  const [colorA, colorB, colorC] = toneMap[tone];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-14 top-8 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: colorA }}
        animate={{
          x: [0, 26, -10, 0],
          y: [0, 12, -14, 0],
          scale: [1, 1.08, 0.95, 1]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: colorB }}
        animate={{
          x: [0, -22, 14, 0],
          y: [0, -18, 10, 0],
          scale: [1, 0.9, 1.05, 1]
        }}
        transition={{ duration: 14.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full blur-3xl"
        style={{ backgroundColor: colorC }}
        animate={{
          x: [0, 12, -16, 0],
          y: [0, -16, 12, 0],
          scale: [1, 1.06, 0.92, 1]
        }}
        transition={{ duration: 12.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
