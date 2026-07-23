"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export const themeChangeEvent = "portfolio-theme-change";

export type ThemeMode = "dark" | "light";

function getThemeSnapshot(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== "theme") return;
    document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
    onStoreChange();
  };

  window.addEventListener(themeChangeEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Shared theme state for every route. Reads the `data-theme` attribute the
 * bootstrap script sets on <html>, stays in sync across tabs, and exposes a
 * toggle that persists the choice and notifies other subscribers.
 */
export function useThemeMode() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = () => {
    const nextTheme = getThemeSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  return { theme, isDark: theme === "dark", toggleTheme };
}

/**
 * True when the viewport is small or the visitor prefers reduced motion, so
 * heavy 3D visuals can fall back to lighter alternatives.
 */
export function useLiteVisualMode() {
  const [useLiteVisuals, setUseLiteVisuals] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 1024px), (prefers-reduced-motion: reduce)"
    );

    const updateVisualMode = () => {
      setUseLiteVisuals(mediaQuery.matches);
    };

    updateVisualMode();
    mediaQuery.addEventListener("change", updateVisualMode);

    return () => {
      mediaQuery.removeEventListener("change", updateVisualMode);
    };
  }, []);

  return useLiteVisuals;
}
