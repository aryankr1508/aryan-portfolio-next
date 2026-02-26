"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      isInitialized?: boolean;
    };
  }
}

const unicornScriptUrl = "https://cdn.unicorn.studio/v1.4.2/unicornStudio.umd.js";

type UnicornEmbedProps = {
  projectId?: string;
  height?: number;
  className?: string;
  mode?: "panel" | "background";
};

export default function UnicornEmbed({
  projectId,
  height = 420,
  className,
  mode = "panel"
}: UnicornEmbedProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const hasProject = Boolean(projectId);
  const isBackground = mode === "background";

  useEffect(() => {
    if (!hasProject || !isScriptLoaded || !window.UnicornStudio?.init) return;

    const timer = window.setTimeout(() => {
      window.UnicornStudio?.init();
      if (window.UnicornStudio) {
        window.UnicornStudio.isInitialized = true;
      }
    }, 20);

    return () => window.clearTimeout(timer);
  }, [hasProject, isScriptLoaded, projectId]);

  if (!hasProject) return null;

  return (
    <>
      <Script
        src={unicornScriptUrl}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div
        data-us-project={projectId}
        data-us-scale="1"
        className={
          isBackground
            ? `relative h-full min-h-[260px] overflow-hidden ${className ?? ""}`
            : `relative h-full min-h-[260px] overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-soft backdrop-blur-sm ${className ?? ""}`
        }
        style={{ height: `${height}px` }}
      />
    </>
  );
}
