"use client";

import { LoaderCircle } from "lucide-react";
import type { MouseEvent } from "react";
import { useFormStatus } from "react-dom";

export default function AdminSubmitButton({
  idleLabel,
  pendingLabel,
  tone = "primary",
  disabled = false,
  confirmation
}: {
  idleLabel: string;
  pendingLabel: string;
  tone?: "primary" | "danger" | "neutral";
  disabled?: boolean;
  confirmation?: string;
}) {
  const { pending } = useFormStatus();
  const toneClass =
    tone === "danger"
      ? "bg-rose-500 text-white hover:bg-rose-400"
      : tone === "neutral"
        ? "border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
        : "bg-emerald-400 text-slate-950 hover:bg-emerald-300";

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (confirmation && !window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
    >
      {pending ? (
        <LoaderCircle size={15} className="animate-spin" aria-hidden />
      ) : null}
      <span>{pending ? pendingLabel : idleLabel}</span>
    </button>
  );
}
