"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Code2, ExternalLink, Github, Lock } from "lucide-react";
import type { ShowcaseProject } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

type ProjectsShowcaseProps = {
  projects: ShowcaseProject[];
  isDark: boolean;
};

type ProjectFilter = "all" | "enterprise" | "personal";

const projectFilters: { key: ProjectFilter; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "enterprise", label: "Enterprise" },
  { key: "personal", label: "Personal" }
];

function filterProjectsByType(projects: ShowcaseProject[], filter: ProjectFilter): ShowcaseProject[] {
  if (filter === "all") return projects;
  return projects.filter((project) => project.type === filter);
}

export default function ProjectsShowcase({ projects, isDark }: ProjectsShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");

  const filteredProjects = useMemo(() => filterProjectsByType(projects, filter), [projects, filter]);

  const activeProject =
    filteredProjects.find((project) => project.id === activeId) ?? filteredProjects[0] ?? null;
  const activeProjectId = activeProject?.id ?? "";

  if (!projects.length) {
    return (
      <div className="surface-panel card-project p-6 text-sm text-slate-600">
        Projects will appear here once data is available.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {projectFilters.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                const nextProjects = filterProjectsByType(projects, tab.key);
                setFilter(tab.key);
                setActiveId((current) =>
                  nextProjects.some((project) => project.id === current)
                    ? current
                    : (nextProjects[0]?.id ?? "")
                );
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                isActive
                  ? isDark
                    ? "border-sky-300/45 bg-sky-500/12 text-sky-200"
                    : "border-sky-300/80 bg-sky-100/80 text-sky-800"
                  : isDark
                    ? "border-slate-600/55 bg-slate-900/60 text-slate-300 hover:border-slate-400/65 hover:text-slate-100"
                    : "border-slate-300/85 bg-white/80 text-slate-600 hover:border-slate-500/55 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="h-[24rem] space-y-2 overflow-y-auto pr-1 sm:h-[27rem] lg:h-[30rem]">
          {filteredProjects.map((project) => {
            const isEnterprise = project.type === "enterprise";
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setActiveId(project.id);
                  trackEvent("showcase_project_select", { project: project.id });
                }}
                className={`surface-panel showcase-card card-project flex w-full flex-col items-start gap-2.5 p-3.5 text-left transition ${
                  project.id === activeProjectId
                    ? isDark
                      ? "border-sky-300/40 bg-sky-500/10"
                      : "border-sky-300/70 bg-sky-50/75"
                    : ""
                }`}
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      isEnterprise
                        ? isDark
                          ? "border-amber-400/35 bg-amber-500/12 text-amber-300"
                          : "border-amber-200 bg-amber-100 text-amber-700"
                        : isDark
                          ? "border-sky-400/35 bg-sky-500/12 text-sky-300"
                          : "border-sky-200 bg-sky-100 text-sky-700"
                    }`}
                  >
                    {isEnterprise ? <Briefcase size={12} /> : <Code2 size={12} />}
                    {isEnterprise ? "Enterprise" : "Personal"}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{project.year}</span>
                </div>

                <h3 className="line-clamp-1 font-display text-base font-semibold text-slate-900">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {project.businessLogic}
                </p>
              </button>
            );
          })}
        </div>

        <div className="surface-panel showcase-card card-project h-[24rem] overflow-y-auto p-6 sm:h-[27rem] sm:p-7 lg:h-[30rem]">
          <AnimatePresence mode="wait">
            {activeProject ? (
              <ProjectDetail key={activeProject.id} project={activeProject} isDark={isDark} />
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-600"
              >
                No project found for this filter.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, isDark }: { project: ShowcaseProject; isDark: boolean }) {
  const isEnterprise = project.type === "enterprise";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isEnterprise
                ? isDark
                  ? "border-amber-400/35 bg-amber-500/12 text-amber-300"
                  : "border-amber-200 bg-amber-100 text-amber-700"
                : isDark
                  ? "border-sky-400/35 bg-sky-500/12 text-sky-300"
                  : "border-sky-200 bg-sky-100 text-sky-700"
            }`}
          >
            {isEnterprise ? <Briefcase size={12} /> : <Code2 size={12} />}
            {isEnterprise ? "Enterprise Project" : "Personal Project"}
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-slate-500">{project.year}</span>
        </div>

        <h3 className="font-display text-2xl font-semibold leading-tight text-slate-900">
          {project.title}
        </h3>
      </div>

      <p className="leading-relaxed text-slate-600">{project.businessLogic}</p>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Key Contributions
        </p>
        <ul className="space-y-1.5">
          {project.contributions.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.confidential ? (
        <div
          className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
            isDark
              ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <Lock size={15} className="mt-0.5 shrink-0" />
          Source code and proprietary architecture are restricted under enterprise NDA.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/projects/${project.id}`}
            onClick={() =>
              trackEvent("project_detail_click", { project: project.id, source: "showcase_panel" })
            }
            className="button-primary"
          >
            Case Study
            <ArrowUpRight size={15} />
          </Link>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("showcase_live_click", { project: project.id })}
              className="button-ghost"
            >
              Live Demo
              <ExternalLink size={15} />
            </a>
          ) : null}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("showcase_github_click", { project: project.id })}
              className="button-ghost"
            >
              GitHub
              <Github size={15} />
            </a>
          ) : null}
        </div>
      )}
    </motion.article>
  );
}
