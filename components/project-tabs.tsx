"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, Lock, Briefcase } from "lucide-react";
import type { Project, EnterpriseProjectCard } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

/* ── Types ────────────────────────────────────────────────────────────────── */

export type ProjectTab = "enterprise" | "independent";

export interface ProjectTabsProps {
  projects: Project[];
  enterpriseProjects: EnterpriseProjectCard[];
  isDark: boolean;
  /** Externally controlled active tab (for experience-to-project bridging) */
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
  /** ID of enterprise project card to pulse-highlight */
  pulseTargetId: string | null;
  onPulseComplete: () => void;
}

/* ── Tab labels ───────────────────────────────────────────────────────────── */

const tabs: { key: ProjectTab; label: string }[] = [
  { key: "enterprise", label: "Enterprise Work" },
  { key: "independent", label: "Independent Projects" },
];

/* ── Stagger variants ─────────────────────────────────────────────────────── */

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Main component ───────────────────────────────────────────────────────── */

export default function ProjectTabs({
  projects,
  enterpriseProjects,
  isDark,
  activeTab,
  onTabChange,
  pulseTargetId,
  onPulseComplete,
}: ProjectTabsProps) {
  return (
    <div className="space-y-7">
      {/* ── Toggle switch ─────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div
          className={`inline-flex rounded-full border p-1 backdrop-blur-xl ${
            isDark
              ? "border-slate-600/55 bg-slate-900/60"
              : "border-slate-200/80 bg-white/70"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : isDark
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {activeTab === tab.key ? (
                <motion.span
                  layoutId="project-tab-indicator"
                  className={`absolute inset-0 rounded-full ${
                    isDark ? "bg-white/12" : "bg-teal-100/80"
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "enterprise" ? (
          <motion.div
            key="enterprise"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <EnterpriseGrid
              projects={enterpriseProjects}
              isDark={isDark}
              pulseTargetId={pulseTargetId}
              onPulseComplete={onPulseComplete}
            />
          </motion.div>
        ) : (
          <motion.div
            key="independent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <IndependentGrid projects={projects} isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Enterprise project grid ──────────────────────────────────────────────── */

function EnterpriseGrid({
  projects,
  isDark,
  pulseTargetId,
  onPulseComplete,
}: {
  projects: EnterpriseProjectCard[];
  isDark: boolean;
  pulseTargetId: string | null;
  onPulseComplete: () => void;
}) {
  return (
    <motion.div
      className="grid gap-5 md:grid-cols-2"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => (
        <EnterpriseCard
          key={project.id}
          project={project}
          isDark={isDark}
          isPulseTarget={pulseTargetId === project.id}
          onPulseComplete={onPulseComplete}
        />
      ))}
    </motion.div>
  );
}

function EnterpriseCard({
  project,
  isDark,
  isPulseTarget,
  onPulseComplete,
}: {
  project: EnterpriseProjectCard;
  isDark: boolean;
  isPulseTarget: boolean;
  onPulseComplete: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (!isPulseTarget || !cardRef.current) return;

    // Scroll into view, then pulse
    cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

    const pulseTimer = setTimeout(() => {
      setIsPulsing(true);
    }, 600);

    const clearTimer = setTimeout(() => {
      setIsPulsing(false);
      onPulseComplete();
    }, 2600);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(clearTimer);
    };
  }, [isPulseTarget, onPulseComplete]);

  return (
    <motion.div variants={cardVariants}>
      <motion.article
        ref={cardRef}
        data-project-id={project.id}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.22 }}
        className={`project-card showcase-card card-project relative flex h-full flex-col rounded-[2rem] border p-6 shadow-soft backdrop-blur-xl ${
          isDark
            ? "border-slate-600/45 bg-slate-950/74"
            : "border-white/80 bg-white/78"
        } ${isPulsing ? "enterprise-card-pulse" : ""}`}
      >
        {/* Pulse overlay */}
        <AnimatePresence>
          {isPulsing ? (
            <motion.div
              className={`pointer-events-none absolute inset-0 z-[5] rounded-[inherit] ${
                isDark
                  ? "shadow-[inset_0_0_30px_rgba(94,234,212,0.25),0_0_40px_rgba(94,234,212,0.15)]"
                  : "shadow-[inset_0_0_30px_rgba(20,184,166,0.2),0_0_40px_rgba(20,184,166,0.12)]"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1, 0] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          ) : null}
        </AnimatePresence>

        {/* Company badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isDark
                ? "border-indigo-400/35 bg-indigo-500/12 text-indigo-200"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            <Briefcase size={12} />
            {project.company}
          </span>
          <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
            {project.companyDuration}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold text-slate-900">
          {project.name}
        </h3>
        {project.role ? (
          <p className="mt-1 text-sm font-semibold text-teal-700">{project.role}</p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="chip chip-compact">
              {tech}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-1.5">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>

        {project.confidentialityNote ? (
          <p
            className={`mt-4 inline-flex items-start gap-2 rounded-xl border px-3 py-2 text-xs leading-relaxed ${
              isDark
                ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <Lock size={13} className="mt-0.5 shrink-0" />
            {project.confidentialityNote}
          </p>
        ) : null}
      </motion.article>
    </motion.div>
  );
}

/* ── Independent project grid ─────────────────────────────────────────────── */

function IndependentGrid({
  projects,
  isDark,
}: {
  projects: Project[];
  isDark: boolean;
}) {
  return (
    <motion.div
      className="grid gap-5 md:grid-cols-2"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => {
        const liveOrDemoUrl = project.liveUrl ?? project.demoUrl;
        const liveLabel = project.liveUrl
          ? "Live Demo"
          : project.demoUrl
            ? "Demo Video"
            : null;

        return (
          <motion.div key={project.slug} variants={cardVariants}>
            <motion.article
              whileHover={{ y: -8 }}
              transition={{ duration: 0.22 }}
              className={`project-card showcase-card card-project flex h-full flex-col rounded-[2rem] border p-5 shadow-soft backdrop-blur-xl ${
                isDark
                  ? "border-slate-600/45 bg-slate-950/74"
                  : "border-white/80 bg-white/78"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-white/60">
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} preview`}
                  width={1280}
                  height={720}
                  className="h-52 w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? "border-teal-300/45 bg-teal-500/12 text-teal-100"
                      : "border-teal-200 bg-teal-50 text-teal-700"
                  }`}
                >
                  {project.resultMetric}
                </span>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  {project.period}
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900">
                {project.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-teal-700">
                {project.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() =>
                    trackEvent("project_detail_click", {
                      project: project.slug,
                      source: "home_grid",
                    })
                  }
                  className="button-primary"
                >
                  Case Study
                  <ArrowUpRight size={15} />
                </Link>

                <div className="flex items-center gap-2">
                  {liveOrDemoUrl && liveLabel ? (
                    <a
                      href={liveOrDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} ${liveLabel}`}
                      onClick={() =>
                        trackEvent("project_live_click", {
                          project: project.slug,
                          source: "home_grid",
                        })
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/85 text-slate-700 transition hover:border-teal-500/45 hover:text-slate-900"
                    >
                      <ExternalLink size={15} />
                    </a>
                  ) : null}

                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      onClick={() =>
                        trackEvent("project_repo_click", {
                          project: project.slug,
                          source: "home_grid",
                        })
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/85 text-slate-700 transition hover:border-teal-500/45 hover:text-slate-900"
                    >
                      <Github size={15} />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
