"use client";

import { useFormStatus } from "react-dom";

export default function AdminSubmitButton({
  idleLabel,
  pendingLabel,
  tone = "primary"
}: {
  idleLabel: string;
  pendingLabel: string;
  tone?: "primary" | "danger" | "neutral";
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
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-wait disabled:opacity-60 ${toneClass}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
