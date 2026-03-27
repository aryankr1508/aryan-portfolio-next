"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnswerModalProps {
  title: string;
  content: string;
  accentColor: string;
  onClose: () => void;
}

export default function AnswerModal({ title, content, accentColor, onClose }: AnswerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 12px",
        animation: "modalFadeIn 0.2s ease",
        overscrollBehavior: "contain"
      }}
    >
      <div
        style={{
          background: "#111111", borderRadius: 16,
          border: `1px solid ${accentColor}33`,
          maxWidth: 780, width: "100%",
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${accentColor}15`,
          animation: "modalSlideUp 0.25s ease",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid #222",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          flexShrink: 0
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e8e8e8", margin: 0, lineHeight: 1.5, flex: 1 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "#1e1e1e", border: "1px solid #333", borderRadius: 8,
              color: "#888", fontSize: 13, fontWeight: 600, padding: "4px 10px",
              cursor: "pointer", flexShrink: 0, transition: "all 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#555"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
          >
            ESC
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          data-lenis-prevent=""
          className="prep-markdown scrollbar-thin"
          style={{
            padding: "20px 24px 28px", overflowY: "auto", flex: 1,
            fontSize: 14, lineHeight: 1.75, color: "#c8c8c8",
            minHeight: 0,
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            ["--accent" as string]: accentColor
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
