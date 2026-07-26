"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

export default function AdminError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-7">
      <AlertTriangle size={24} className="text-rose-300" />
      <h1 className="mt-4 font-display text-2xl font-semibold">
        This admin page could not load
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-rose-100/75">
        Your public portfolio is unaffected. Retry the request; if it repeats,
        check the database connection before making more edits.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-rose-200"
      >
        <RotateCw size={15} />
        Try again
      </button>
    </section>
  );
}
