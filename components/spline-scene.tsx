"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 px-4 text-center text-sm text-slate-500">
      Loading Spline scene...
    </div>
  )
});

type SplineSceneProps = {
  scene?: string;
  className?: string;
  fallback?: ReactNode;
};

export default function SplineScene({ scene, className, fallback }: SplineSceneProps) {
  if (!scene) return fallback ? <>{fallback}</> : null;

  return (
    <div
      className={`relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-soft backdrop-blur-sm ${className ?? ""}`}
    >
      <Spline scene={scene} />
    </div>
  );
}
