"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Github,
  Handshake,
  Lock,
  X
} from "lucide-react";
import type { ShowcaseProject } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

type ProjectsShowcaseProps = {
  projects: ShowcaseProject[];
  isDark: boolean;
  requestedProjectId?: string | null;
};

type ProjectFilter = "all" | ShowcaseProject["category"];

type ProjectGroup = {
  label: string;
  description: string;
  projects: ShowcaseProject[];
};

const filterLabels: { key: ProjectFilter; label: string }[] = [
  { key: "all", label: "All Work" },
  { key: "company", label: "Company" },
  { key: "freelance", label: "Freelance" },
  { key: "personal", label: "Personal" }
];

const featuredProjectIds = [
  "midas-nuclear-safety-plume-monitoring-system",
  "zenought-renewables",
  "syncdev"
];

function projectsForFilter(
  projects: ShowcaseProject[],
  filter: ProjectFilter
): ShowcaseProject[] {
  if (filter === "all") return projects;
  return projects.filter((project) => project.category === filter);
}

function projectGroups(
  projects: ShowcaseProject[],
  filter: ProjectFilter
): ProjectGroup[] {
  if (filter === "company") {
    return [
      {
        label: "Company Projects",
        description: "Production systems delivered in full-time roles",
        projects: projects.filter((project) => project.category === "company")
      }
    ];
  }

  if (filter === "personal") {
    return [
      {
        label: "Personal Builds",
        description: "Products and experiments built from the ground up",
        projects: projects.filter((project) => project.category === "personal")
      }
    ];
  }

  if (filter === "freelance") {
    return [
      {
        label: "Freelance Projects",
        description: "Client work delivered independently from discovery to deployment",
        projects: projects.filter((project) => project.category === "freelance")
      }
    ];
  }

  const featured = featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is ShowcaseProject => Boolean(project));
  const featuredIds = new Set(featured.map((project) => project.id));

  return [
    {
      label: "Featured Work",
      description: "A snapshot of professional depth and product ownership",
      projects: featured
    },
    {
      label: "Company Projects",
      description: "More production work delivered in full-time roles",
      projects: projects.filter(
        (project) => project.category === "company" && !featuredIds.has(project.id)
      )
    },
    {
      label: "Freelance Projects",
      description: "Independent client engagements across product and platform delivery",
      projects: projects.filter(
        (project) => project.category === "freelance" && !featuredIds.has(project.id)
      )
    },
    {
      label: "Personal Builds",
      description: "More independent products and experiments",
      projects: projects.filter(
        (project) => project.category === "personal" && !featuredIds.has(project.id)
      )
    }
  ].filter((group) => group.projects.length > 0);
}

function ProjectsShowcase({
  projects,
  isDark,
  requestedProjectId = null
}: ProjectsShowcaseProps) {
  const requestedProject = projects.find(
    (project) => project.id === requestedProjectId
  );
  const [filter, setFilter] = useState<ProjectFilter>(
    requestedProject?.category ?? "all"
  );
  const [activeId, setActiveId] = useState(
    requestedProject?.id ?? projects[0]?.id ?? ""
  );
  const [mobileDetailId, setMobileDetailId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filteredProjects = useMemo(
    () => projectsForFilter(projects, filter),
    [filter, projects]
  );
  const groups = useMemo(() => projectGroups(projects, filter), [filter, projects]);
  const activeProject =
    filteredProjects.find((project) => project.id === activeId) ??
    filteredProjects[0] ??
    null;
  const mobileProject =
    projects.find((project) => project.id === mobileDetailId) ?? null;

  const counts = useMemo(
    () => ({
      all: projects.length,
      company: projects.filter((project) => project.category === "company").length,
      freelance: projects.filter((project) => project.category === "freelance").length,
      personal: projects.filter((project) => project.category === "personal").length
    }),
    [projects]
  );

  useEffect(() => {
    if (!mobileProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileDetailId(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileProject]);

  if (!projects.length) {
    return (
      <div className="surface-panel card-project p-6 text-sm text-slate-600">
        Projects will appear here once data is available.
      </div>
    );
  }

  const selectFilter = (nextFilter: ProjectFilter) => {
    const nextProjects = projectsForFilter(projects, nextFilter);
    setFilter(nextFilter);
    setActiveId((current) =>
      nextProjects.some((project) => project.id === current)
        ? current
        : (nextProjects[0]?.id ?? "")
    );
    trackEvent("showcase_filter_select", { filter: nextFilter });
  };

  return (
    <div className="space-y-5">
      <div
        className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
        role="tablist"
        aria-label="Filter selected work"
      >
        {filterLabels.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectFilter(tab.key)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] transition ${
                isActive
                  ? isDark
                    ? "border-sky-300/55 bg-sky-500/15 text-sky-100 shadow-[0_8px_24px_rgba(56,189,248,0.12)]"
                    : "border-sky-300 bg-sky-100/90 text-sky-900 shadow-[0_8px_24px_rgba(14,165,233,0.1)]"
                  : isDark
                    ? "border-slate-600/55 bg-slate-900/60 text-slate-300 hover:border-slate-400/65 hover:text-slate-100"
                    : "border-slate-300/85 bg-white/80 text-slate-600 hover:border-slate-500/55 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  isActive
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-white/75 text-sky-900"
                    : isDark
                      ? "bg-white/5 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="hidden gap-5 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div
          data-lenis-prevent=""
          className={`surface-panel card-project scrollbar-thin h-[42rem] overflow-y-auto border p-3 ${
            isDark ? "border-slate-600/40" : "border-white/80"
          }`}
        >
          <ProjectGroups
            groups={groups}
            activeId={activeProject?.id ?? ""}
            isDark={isDark}
            onSelect={(project) => {
              setActiveId(project.id);
              trackEvent("showcase_project_select", { project: project.id });
            }}
          />
        </div>

        <div
          data-lenis-prevent=""
          className="surface-panel card-project scrollbar-thin h-[42rem] overflow-y-auto p-7 xl:p-8"
        >
          <AnimatePresence mode="wait">
            {activeProject ? (
              <ProjectDetail
                key={activeProject.id}
                project={activeProject}
                isDark={isDark}
              />
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

      <div className="space-y-6 lg:hidden">
        <ProjectGroups
          groups={groups}
          activeId=""
          isDark={isDark}
          onSelect={(project) => {
            setActiveId(project.id);
            setMobileDetailId(project.id);
            trackEvent("showcase_project_select", {
              project: project.id,
              source: "mobile_list"
            });
          }}
        />
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {mobileProject ? (
                <motion.div
                  className={`fixed inset-0 z-[120] overflow-y-auto ${
                    isDark ? "bg-[#050811]" : "bg-[#f3f6fb]"
                  }`}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-project-title"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`sticky top-0 z-20 border-b px-4 py-3 backdrop-blur-md ${
                      isDark
                        ? "border-slate-700/60 bg-slate-950/85"
                        : "border-slate-200/80 bg-white/85"
                    }`}
                  >
                    <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setMobileDetailId(null)}
                        className="button-ghost !px-4 !py-2.5"
                      >
                        <ArrowLeft size={16} />
                        Back to projects
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileDetailId(null)}
                        aria-label="Close project details"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6">
                    <div className="surface-panel card-project p-5 sm:p-7">
                      <ProjectDetail
                        project={mobileProject}
                        isDark={isDark}
                        mobile
                        onNavigate={() => setMobileDetailId(null)}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}

function ProjectGroups({
  groups,
  activeId,
  isDark,
  onSelect
}: {
  groups: ProjectGroup[];
  activeId: string;
  isDark: boolean;
  onSelect: (project: ShowcaseProject) => void;
}) {
  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <div className="mb-3 px-1.5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                {group.label}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {group.projects.length}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {group.description}
            </p>
          </div>

          <div className="space-y-3">
            {group.projects.map((project) => (
              <ProjectListCard
                key={project.id}
                project={project}
                selected={project.id === activeId}
                isDark={isDark}
                onSelect={() => onSelect(project)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProjectListCard({
  project,
  selected,
  isDark,
  onSelect
}: {
  project: ShowcaseProject;
  selected: boolean;
  isDark: boolean;
  onSelect: () => void;
}) {
  const isCompany = project.category === "company";
  const isFreelance = project.category === "freelance";
  const CategoryIcon = isCompany ? Briefcase : isFreelance ? Handshake : Code2;
  const categoryLabel = isCompany ? "Company" : isFreelance ? "Freelance" : "Personal";
  const StatusIcon = project.confidential ? Lock : CheckCircle2;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative w-full overflow-hidden rounded-[1.45rem] border p-4 text-left transition duration-200 sm:p-5 ${
        selected
          ? isDark
            ? "border-sky-300/55 bg-sky-500/10 shadow-[0_18px_45px_rgba(14,165,233,0.12)]"
            : "border-sky-300 bg-sky-50/85 shadow-[0_18px_45px_rgba(14,165,233,0.1)]"
          : isDark
            ? "border-slate-600/45 bg-slate-950/55 hover:border-sky-400/45 hover:bg-slate-900/70"
            : "border-white/90 bg-white/72 hover:border-sky-300/80 hover:bg-white/90"
      }`}
    >
      {selected ? (
        <motion.span
          layoutId="selected-work-card"
          className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-sky-500"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700">
          <CategoryIcon size={13} />
          {categoryLabel}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {project.year}
        </span>
      </div>

      <h4 className="mt-3 font-display text-xl font-semibold leading-tight text-slate-900">
        {project.title}
      </h4>
      <p className="mt-1 line-clamp-1 text-sm text-slate-600">
        {project.subtitle}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
        {project.role}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="chip chip-compact">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            project.confidential ? "text-amber-700" : "text-slate-600"
          }`}
        >
          <StatusIcon size={13} />
          {project.status}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 transition group-hover:gap-2">
          Explore
          <ArrowUpRight size={13} />
        </span>
      </div>
    </button>
  );
}

function ProjectDetail({
  project,
  isDark,
  mobile = false,
  onNavigate
}: {
  project: ShowcaseProject;
  isDark: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const isCompany = project.category === "company";
  const isFreelance = project.category === "freelance";
  const CategoryIcon = isCompany ? Briefcase : isFreelance ? Handshake : Code2;
  const categoryLabel = isCompany
    ? "Company Project"
    : isFreelance
      ? "Freelance Project"
      : "Personal Build";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >
      <header>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">
          <CategoryIcon size={13} />
          <span>{categoryLabel}</span>
          {project.company ? (
            <>
              <span aria-hidden="true" className="text-slate-400">•</span>
              <span>{project.company}</span>
            </>
          ) : null}
          <span aria-hidden="true" className="text-slate-400">•</span>
          <span>{project.year}</span>
        </div>

        <h3
          id={mobile ? "mobile-project-title" : undefined}
          className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl"
        >
          {project.title}
        </h3>
        <p className="mt-2 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
          {project.subtitle}
        </p>

        {!isCompany ? (
          <div className="mt-5">
            <ProjectActions
              project={project}
              compact={mobile}
              onNavigate={onNavigate}
            />
          </div>
        ) : null}
      </header>

      <dl
        className={`grid overflow-hidden rounded-2xl border ${
          isDark
            ? "border-slate-600/45 bg-slate-950/40"
            : "border-slate-200/90 bg-white/60"
        } sm:grid-cols-3`}
      >
        <Metadata label="Role" value={project.role} />
        <Metadata label="Engagement" value={project.engagement} />
        <Metadata label="Status" value={project.status} />
      </dl>

      <DetailSection label="Overview">
        <p className="leading-relaxed text-slate-600">{project.overview}</p>
      </DetailSection>

      <DetailSection label="The Challenge">
        <p className="leading-relaxed text-slate-600">{project.challenge}</p>
      </DetailSection>

      <DetailSection label="What I Owned">
        <ul className="space-y-2.5">
          {project.contributions.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection label="Outcome">
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
            isDark
              ? "border-emerald-400/25 bg-emerald-500/8"
              : "border-emerald-200 bg-emerald-50/75"
          }`}
        >
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
          <p className="text-sm leading-relaxed text-slate-700">{project.outcome}</p>
        </div>
      </DetailSection>

      <DetailSection label="Technology">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </DetailSection>

      {project.confidential ? (
        <div
          className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
            isDark
              ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <Lock size={15} className="mt-0.5 shrink-0" />
          This is a sanitized case study. Source code, internal visuals, and proprietary architecture remain restricted under NDA.
        </div>
      ) : null}

      {isCompany ? (
        <a
          href="#resume"
          onClick={() => {
            onNavigate?.();
            trackEvent("showcase_role_click", { project: project.id });
          }}
          className="button-primary"
        >
          View Role Experience
          <ArrowUpRight size={15} />
        </a>
      ) : null}
    </motion.article>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200/80 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold leading-snug text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function DetailSection({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="text-xs font-bold uppercase tracking-[0.17em] text-slate-500">
        {label}
      </h4>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function ProjectActions({
  project,
  compact,
  onNavigate
}: {
  project: ShowcaseProject;
  compact: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackEvent("showcase_live_click", { project: project.id })
          }
          className={`button-primary ${compact ? "!px-4 !py-2.5" : ""}`}
        >
          {project.liveLabel ?? "Live Demo"}
          <ExternalLink size={15} />
        </a>
      ) : null}

      {project.githubUrl ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackEvent("showcase_github_click", { project: project.id })
          }
          className={`button-ghost ${compact ? "!px-4 !py-2.5" : ""}`}
        >
          Source Code
          <Github size={15} />
        </a>
      ) : null}

      {project.caseStudyUrl ? (
        <Link
          href={project.caseStudyUrl}
          onClick={() => {
            onNavigate?.();
            trackEvent("project_detail_click", {
              project: project.id,
              source: "showcase_panel"
            });
          }}
          className={`button-ghost ${compact ? "!px-4 !py-2.5" : ""}`}
        >
          Full Case Study
          <ArrowUpRight size={15} />
        </Link>
      ) : null}

      {project.category === "freelance" ? (
        <a
          href="#contact"
          onClick={() => {
            onNavigate?.();
            trackEvent("showcase_freelance_contact_click", { project: project.id });
          }}
          className={`button-primary ${compact ? "!px-4 !py-2.5" : ""}`}
        >
          Build Something Similar
          <ArrowUpRight size={15} />
        </a>
      ) : null}
    </div>
  );
}

export default memo(ProjectsShowcase);
