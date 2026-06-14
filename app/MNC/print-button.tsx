"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
    >
      <Printer size={16} />
      Print
    </button>
  );
}
