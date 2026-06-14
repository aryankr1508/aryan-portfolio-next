import fs from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import path from "path";
import { ArrowLeft } from "lucide-react";
import PrintButton from "./print-button";
import "./styles.css";

export const metadata: Metadata = {
  title: "Adobe Interview Prep | Aryan Kumar",
  description:
    "Expanded Adobe Full Stack Java Developer interview preparation guide for Aryan Kumar."
};

const guidePath = path.join(
  process.cwd(),
  "content",
  "adobe-interview-prep-expanded-aryan.html"
);

function extractHtml(source: string, selectorClass: string): string {
  const pattern = new RegExp(
    `<(?:aside|main) class="${selectorClass}">([\\s\\S]*?)<\\/(?:aside|main)>`,
    "i"
  );
  return source.match(pattern)?.[1] ?? "";
}

function getGuideHtml() {
  const source = fs.readFileSync(guidePath, "utf8");

  return {
    sidebar: extractHtml(source, "sidebar"),
    main: extractHtml(source, "main")
  };
}

export default function AdobeInterviewPrepPage() {
  const guide = getGuideHtml();

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_82%_10%,rgba(20,184,166,0.15),transparent_46%),linear-gradient(to_bottom,#f8fafc,#eef2f7)] text-slate-900"
    >
      <div className="mx-auto flex w-[min(1240px,calc(100%-2rem))] flex-col gap-5 py-5 lg:py-7">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/75 bg-white/80 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500/45 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Portfolio
          </Link>
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-semibold text-slate-950">
              Adobe Interview Prep
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Aryan Kumar study guide
            </p>
          </div>
          <PrintButton />
        </header>

        <div className="adobe-guide grid gap-5 lg:grid-cols-[19rem_1fr]">
          <aside
            className="adobe-sidebar"
            dangerouslySetInnerHTML={{ __html: guide.sidebar }}
          />
          <article
            className="adobe-main"
            dangerouslySetInnerHTML={{ __html: guide.main }}
          />
        </div>
      </div>
    </main>
  );
}
