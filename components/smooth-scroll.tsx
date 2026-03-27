"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

declare global {
  interface Window {
    __portfolioScrollTo?: (
      target: number | string | HTMLElement,
      options?: { offset?: number; immediate?: boolean }
    ) => void;
  }
}

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isScrollable = (value: string) => /(auto|scroll|overlay)/.test(value);
    const shouldUseNativeScroll = (node: unknown) => {
      if (!(node instanceof HTMLElement)) return false;

      let current: HTMLElement | null = node;

      while (current && current !== document.body) {
        if (
          current.hasAttribute("data-lenis-prevent") ||
          current.hasAttribute("data-lenis-prevent-wheel") ||
          current.hasAttribute("data-lenis-prevent-touch")
        ) {
          return true;
        }

        const styles = window.getComputedStyle(current);
        const canScrollY = isScrollable(styles.overflowY) && current.scrollHeight > current.clientHeight;
        const canScrollX = isScrollable(styles.overflowX) && current.scrollWidth > current.clientWidth;

        if (canScrollY || canScrollX) {
          return true;
        }

        current = current.parentElement;
      }

      return false;
    };

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.15,
      prevent: shouldUseNativeScroll,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: prefersReducedMotion ? 1 : 0.95,
      touchMultiplier: prefersReducedMotion ? 1 : 1.15
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    window.__portfolioScrollTo = (target, options = {}) => {
      lenis.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.immediate || prefersReducedMotion ? 0 : 1.05,
        immediate: options.immediate ?? prefersReducedMotion
      });
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      delete window.__portfolioScrollTo;
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
