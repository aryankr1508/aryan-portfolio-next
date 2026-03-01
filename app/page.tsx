"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  ChevronsLeft,
  ChevronsRight,
  BriefcaseBusiness,
  Download,
  ExternalLink,
  Facebook,
  FileText,
  FolderKanban,
  Github,
  House,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sparkles,
  Sun,
  Twitter,
  UserRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Application } from "@splinetool/runtime";
import { useEffect, useState } from "react";
import CollapsibleCard from "@/components/collapsible-card";
import ContactForm from "@/components/contact-form";
import HeroThreeScene from "@/components/hero-three-scene";
import Reveal from "@/components/reveal";
import SectionGraphScene from "@/components/section-graph-scene";
import SectionTitle from "@/components/section-title";
import SplineScene from "@/components/spline-scene";
import UnicornEmbed from "@/components/unicorn-embed";
import type { GraphMetric } from "@/lib/portfolio-data";
import {
  aboutHighlights,
  contactAddress,
  educationItems,
  experienceItems,
  freelanceServices,
  internships,
  navItems,
  personalInfo,
  projects,
  quickFacts,
  skillGroups,
  socialLinks,
  toolsAndTechnologies
} from "@/lib/portfolio-data";

const socialIconMap: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Twitter: Twitter,
  Facebook: Facebook
};

const navIconMap: Record<string, LucideIcon> = {
  home: House,
  about: UserRound,
  skills: Code2,
  resume: FileText,
  internships: BriefcaseBusiness,
  projects: FolderKanban,
  contact: Send
};

const containerClass = "mx-auto w-[min(1180px,calc(100%-2rem))]";
const graphPalette = ["#0f766e", "#0ea5e9", "#f97316", "#14b8a6", "#0369a1", "#334155"];
const HeroSpline = dynamic(() => import("@splinetool/react-spline"), { ssr: false, loading: () => null });

const metricWidth = (value: number, max: number) =>
  `${Math.max(8, Math.min(100, (value / max) * 100))}%`;

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("sidebar-collapsed");
    if (saved === null) return true;
    return saved === "true";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [skillsFocus, setSkillsFocus] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  });
  const heroSplineScene =
    process.env.NEXT_PUBLIC_HERO_SPLINE_SCENE_URL ?? process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ?? "";
  const splineScene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;
  const unicornProjectId = process.env.NEXT_PUBLIC_UNICORN_PROJECT_ID;

  const skillDepthMetrics: GraphMetric[] = skillGroups.map((group, index) => ({
    label: group.title,
    value: group.items.length,
    suffix: " tools",
    description: group.description,
    color: graphPalette[index % graphPalette.length]
  }));
  const skillMetricMax = Math.max(...skillDepthMetrics.map((metric) => metric.value), 1);

  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 145,
    damping: 28,
    mass: 0.32
  });
  const heroY = useTransform(scrollY, [0, 620], [0, 72]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    let frameId = 0;

    const updateActiveSection = () => {
      const probeLine = Math.max(120, window.innerHeight * 0.3);
      let current = sections[0].id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= probeLine && rect.bottom >= probeLine) {
          current = section.id;
          break;
        }

        if (rect.top <= probeLine) {
          current = section.id;
        }
      }

      setActiveSection((previous) => (previous === current ? previous : current));
    };

    const onViewportChange = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const sectionOffset = window.innerWidth >= 1024 ? -28 : -96;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollTo = (
      window as Window & {
        __portfolioScrollTo?: (
          target: number | string | HTMLElement,
          options?: { offset?: number; immediate?: boolean }
        ) => void;
      }
    ).__portfolioScrollTo;

    if (!prefersReducedMotion && scrollTo) {
      scrollTo(section, { offset: sectionOffset });
    } else {
      const top = section.getBoundingClientRect().top + window.scrollY + sectionOffset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }

    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const isDark = theme === "dark";

  return (
    <>
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[80] h-1 origin-left bg-gradient-to-r from-teal-700 via-cyan-500 to-orange-500"
        style={{ scaleX: progressScale }}
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {heroSplineScene ? (
          <HeroSpline
            scene={heroSplineScene}
            renderOnDemand={false}
            onLoad={(app: Application) => {
              app.setGlobalEvents(true);
            }}
            className="pointer-events-auto h-full w-full opacity-[0.82]"
          />
        ) : (
          <HeroThreeScene mode="background" className="opacity-[0.58]" />
        )}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 -z-20 ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.2),transparent_46%),radial-gradient(circle_at_80%_25%,rgba(37,99,235,0.18),transparent_50%),linear-gradient(to_bottom,rgba(2,6,23,0.22),rgba(2,6,23,0.58))]"
            : "bg-[radial-gradient(circle_at_20%_15%,rgba(20,184,166,0.18),transparent_48%),radial-gradient(circle_at_80%_25%,rgba(14,165,233,0.14),transparent_52%),linear-gradient(to_bottom,rgba(248,250,252,0.56),rgba(241,245,249,0.72))]"
        }`}
      />
      <div aria-hidden className="grid-fog" />
      <div aria-hidden className="grain-overlay" />

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="drift-blob drift-blob-a" />
        <div className="drift-blob drift-blob-b" />
        <div className="drift-blob drift-blob-c" />
      </div>

      <div className="relative z-20">
        <aside className="pointer-events-auto fixed left-3 top-2 z-50 hidden h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] lg:block xl:left-5">
          <div className="relative h-full">
            <div
              className={`game-sidebar-shell relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border p-[clamp(0.45rem,1.1vh,0.75rem)] shadow-[0_30px_100px_rgba(2,6,23,0.42)] backdrop-blur-xl transition-[width] duration-300 ${
                isSidebarCollapsed ? "w-[4.1rem]" : "w-56"
              } ${isDark ? "border-cyan-300/30 bg-slate-950/76" : "border-white/85 bg-white/74"}`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 ${
                  isDark
                    ? "bg-[radial-gradient(circle_at_15%_8%,rgba(34,211,238,0.25),transparent_42%),radial-gradient(circle_at_85%_90%,rgba(56,189,248,0.2),transparent_48%)]"
                    : "bg-[radial-gradient(circle_at_15%_8%,rgba(20,184,166,0.14),transparent_44%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.14),transparent_48%)]"
                }`}
              />

              <button
                type="button"
                onClick={() => scrollToSection("home")}
                className={`relative z-10 mb-[clamp(0.35rem,1vh,0.9rem)] flex w-full shrink-0 items-center overflow-hidden rounded-2xl border transition ${
                  isSidebarCollapsed
                    ? "justify-center px-0 py-[clamp(0.32rem,0.85vh,0.55rem)]"
                    : "gap-2 px-2 py-[clamp(0.32rem,0.85vh,0.55rem)] text-left"
                } ${isDark ? "border-cyan-300/20 bg-slate-900/70 hover:border-cyan-200/50" : "border-slate-300/80 bg-white/85 hover:border-teal-400/45"}`}
                title={isSidebarCollapsed ? "Home" : undefined}
              >
                <span className="inline-flex h-[clamp(1.75rem,3vh,2.4rem)] w-[clamp(1.75rem,3vh,2.4rem)] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 text-sm font-bold text-slate-950">
                  AK
                </span>
                {!isSidebarCollapsed ? (
                  <span
                    className={`whitespace-nowrap text-sm font-semibold ${
                      isDark ? "text-cyan-50" : "text-slate-800"
                    }`}
                  >
                    Aryan Kumar
                  </span>
                ) : null}
              </button>

              <nav className="relative z-10 min-h-0 flex-1 overflow-hidden">
                <div className="flex flex-col gap-[clamp(0.12rem,0.42vh,0.35rem)]">
                {navItems.map((item) => {
                  const Icon = navIconMap[item.id] ?? House;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`pointer-events-auto relative flex w-full items-center overflow-hidden rounded-xl transition ${
                        isSidebarCollapsed
                          ? "justify-center px-0 py-[clamp(0.28rem,0.8vh,0.52rem)]"
                          : "gap-2 px-2 py-[clamp(0.28rem,0.8vh,0.52rem)] text-left"
                      } ${
                        isActive
                          ? isDark
                            ? "text-white"
                            : "text-slate-900"
                          : isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                      aria-label={item.label}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="sidebar-active-pill"
                          className={`absolute inset-0 rounded-xl ${
                            isDark
                              ? "bg-gradient-to-r from-cyan-500/35 to-blue-500/30"
                              : "bg-gradient-to-r from-teal-400/30 to-sky-400/25"
                          }`}
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        />
                      ) : null}

                      <span
                        className={`relative z-10 inline-flex h-[clamp(1.7rem,3vh,2.4rem)] w-[clamp(1.7rem,3vh,2.4rem)] shrink-0 items-center justify-center rounded-xl border text-sm ${
                          isActive
                            ? isDark
                              ? "border-cyan-200/70 bg-cyan-500/35 text-cyan-50 ring-1 ring-cyan-200/55 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
                              : "border-teal-300/80 bg-teal-400/25 text-teal-700 ring-1 ring-teal-300/70 shadow-[0_0_18px_rgba(20,184,166,0.18)]"
                            : isDark
                              ? "border-slate-600/70 bg-slate-900/70 text-slate-300"
                              : "border-slate-300/80 bg-white/85 text-slate-600"
                        }`}
                      >
                        <Icon size={17} />
                      </span>
                      {!isSidebarCollapsed ? (
                        <span className="relative z-10 whitespace-nowrap text-sm font-semibold">
                          {item.label}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                </div>
              </nav>

              <div
                className={`relative z-10 mt-[clamp(0.35rem,0.95vh,0.9rem)] shrink-0 border-t pt-[clamp(0.35rem,0.95vh,0.9rem)] ${
                  isDark ? "border-cyan-300/18" : "border-slate-300/75"
                }`}
              >
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`pointer-events-auto flex w-full items-center rounded-xl border transition ${
                    isSidebarCollapsed
                      ? "justify-center px-0 py-1.5"
                      : "gap-2 px-2 py-1.5"
                  } ${
                    isDark
                      ? "border-slate-600/70 bg-slate-900/70 text-slate-200 hover:border-cyan-300/45 hover:text-white"
                      : "border-slate-300/80 bg-white/85 text-slate-700 hover:border-teal-400/45 hover:text-slate-900"
                  }`}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  title={isSidebarCollapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      isDark ? "border-slate-600/70 bg-slate-950/85" : "border-slate-300/80 bg-white"
                    }`}
                  >
                    {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
                  </span>
                  {!isSidebarCollapsed ? (
                    <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.02em]">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed((previous) => !previous)}
                  className={`pointer-events-auto mt-2 flex w-full items-center rounded-xl border transition ${
                    isSidebarCollapsed ? "justify-center px-0 py-1.5" : "gap-2 px-2 py-1.5"
                  } ${
                    isDark
                      ? "border-cyan-300/28 bg-slate-950/80 text-cyan-100 hover:border-cyan-200/65 hover:text-white"
                      : "border-slate-300/80 bg-white/90 text-slate-700 hover:border-teal-400/55 hover:text-slate-900"
                  }`}
                  aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={isSidebarCollapsed ? "Expand sidebar" : undefined}
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      isDark ? "border-cyan-300/25 bg-slate-950/85" : "border-slate-300/80 bg-white"
                    }`}
                  >
                    {isSidebarCollapsed ? <ChevronsRight size={11} /> : <ChevronsLeft size={11} />}
                  </span>
                  {!isSidebarCollapsed ? (
                    <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.02em]">
                      Collapse
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </aside>

      <header className="fixed inset-x-0 top-4 z-50 lg:hidden">
        <div className={`${containerClass} relative`}>
          <div className="surface-panel flex items-center justify-between px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDark
                  ? "border-cyan-300/35 bg-slate-900/80 text-cyan-100 hover:border-cyan-200/60 hover:text-white"
                  : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-400/55 hover:text-slate-900"
              }`}
              aria-label="Open sidebar menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-sidebar"
            >
              <Menu size={18} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                isDark
                  ? "border-cyan-300/35 bg-slate-900/80 text-cyan-100 hover:border-cyan-200/60 hover:text-white"
                  : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-400/55 hover:text-slate-900"
              }`}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          />

          <aside
            id="mobile-sidebar"
            className={`absolute left-0 top-0 h-full w-[min(19rem,84vw)] border-r p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl ${
              isDark ? "border-cyan-300/25 bg-slate-950/90" : "border-white/80 bg-white/88"
            }`}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => scrollToSection("home")}
                className={`font-display text-base font-semibold ${
                  isDark ? "text-cyan-50" : "text-slate-900"
                }`}
              >
                Aryan Kumar
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  isDark
                    ? "border-cyan-300/35 bg-slate-900/80 text-cyan-100 hover:border-cyan-200/60 hover:text-white"
                    : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-400/55 hover:text-slate-900"
                }`}
                aria-label="Close sidebar menu"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="mt-5 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = navIconMap[item.id] ?? House;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`inline-flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                      isActive
                        ? isDark
                          ? "border-cyan-300/60 bg-cyan-500/20 text-white"
                          : "border-teal-400/40 bg-teal-500/15 text-slate-900"
                        : isDark
                          ? "border-slate-700/70 bg-slate-900/70 text-slate-200 hover:border-cyan-300/45 hover:text-white"
                          : "border-slate-300/80 bg-white/90 text-slate-700 hover:border-teal-400/45 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <main
        className={`pb-20 pt-28 transition-[padding] duration-300 lg:pt-16 ${
          isSidebarCollapsed ? "lg:pl-28" : "lg:pl-72"
        }`}
      >
        <section id="home" className="pointer-events-none py-14 sm:py-20">
          <div className={`${containerClass} pointer-events-none`}>
            <div
              className={`pointer-events-none relative isolate overflow-hidden rounded-[2rem] border px-5 py-6 sm:px-8 sm:py-10 lg:px-10 ${
                isDark
                  ? "border-cyan-400/20 bg-slate-950/58 shadow-[0_40px_100px_rgba(2,6,23,0.55)]"
                  : "border-slate-300/80 bg-white/72 shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 ${
                  isDark
                    ? "bg-gradient-to-r from-slate-950/82 via-slate-950/62 to-slate-950/44 lg:from-slate-950/75 lg:via-slate-950/55 lg:to-slate-950/35"
                    : "bg-gradient-to-r from-white/84 via-white/64 to-white/44 lg:from-white/74 lg:via-white/56 lg:to-white/36"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,0.2),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.16),transparent_45%)]" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,116,144,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.14)_1px,transparent_1px)] bg-[length:42px_42px] opacity-30"
              />

              <div className="pointer-events-none relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <motion.div style={{ y: heroY }} className="space-y-7">
                  <p
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      isDark
                        ? "border-cyan-400/35 bg-cyan-500/12 text-cyan-100"
                        : "border-teal-300/45 bg-teal-400/10 text-teal-700"
                    }`}
                  >
                    <BriefcaseBusiness size={14} />
                    Building modern product systems
                  </p>

                  <div className="space-y-4">
                    <h1
                      className={`font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-[4.25rem] lg:leading-[1] ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {personalInfo.name}
                    </h1>
                    <p
                      className={`max-w-2xl text-xl ${
                        isDark ? "text-cyan-100/80" : "text-teal-700/90"
                      }`}
                    >
                      {personalInfo.role}
                    </p>
                    <p
                      className={`max-w-2xl leading-relaxed ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {personalInfo.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("projects")}
                      className="button-primary pointer-events-auto"
                    >
                      Explore Projects
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("contact")}
                      className="button-accent pointer-events-auto"
                    >
                      Let us work together
                      <ArrowUpRight size={16} />
                    </button>
                    <a
                      href={personalInfo.resumeFile}
                      target="_blank"
                      rel="noreferrer"
                      className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                        isDark
                          ? "border-cyan-300/35 bg-slate-900/70 text-cyan-100 hover:border-cyan-200/60 hover:bg-slate-900/85 hover:text-white"
                          : "border-slate-300/85 bg-white/85 text-slate-700 hover:border-teal-500/45 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      Resume
                      <Download size={16} />
                    </a>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {quickFacts.slice(0, 3).map((fact, index) => (
                      <motion.div
                        key={fact.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.45, delay: 0.12 + index * 0.06 }}
                        whileHover={{ y: -4 }}
                        className={`rounded-2xl border px-4 py-3 backdrop-blur-sm ${
                          isDark
                            ? "border-cyan-300/20 bg-slate-950/65"
                            : "border-slate-300/80 bg-white/82"
                        }`}
                      >
                        <p
                          className={`text-[11px] uppercase tracking-[0.18em] ${
                            isDark ? "text-cyan-100/70" : "text-slate-500"
                          }`}
                        >
                          {fact.label}
                        </p>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            isDark ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {fact.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <Reveal className="space-y-5 lg:self-end lg:pb-2">
                  <div
                    className={`pointer-events-none rounded-3xl border p-5 backdrop-blur-md ${
                      isDark
                        ? "border-cyan-300/20 bg-black/40"
                        : "border-slate-300/80 bg-white/78"
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        isDark ? "text-cyan-200/85" : "text-teal-700"
                      }`}
                    >
                      Social
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {socialLinks.map((social, index) => {
                        const Icon = socialIconMap[social.label] ?? ExternalLink;
                        return (
                          <motion.a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.35, delay: 0.06 + index * 0.04 }}
                            whileHover={{ y: -3, scale: 1.02 }}
                            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                              isDark
                                ? "border-cyan-300/30 bg-slate-900/75 text-cyan-50 hover:border-cyan-200/60 hover:bg-slate-900 hover:text-white"
                                : "border-slate-300/80 bg-white/85 text-slate-700 hover:border-teal-500/45 hover:bg-white hover:text-slate-900"
                            }`}
                          >
                            <Icon size={14} />
                            {social.label}
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16">
          <div className={`${containerClass} relative`}>
            <div className="space-y-9">
              <SectionTitle
                eyebrow="About"
                title="Engineering With Product Thinking"
                description="I optimize systems for speed, reliability, and measurable outcomes while keeping delivery practical for business teams."
              />

              <div
                className={`grid gap-6 rounded-[2rem] border p-3 shadow-soft backdrop-blur-xl sm:p-4 lg:grid-cols-[1.1fr_0.9fr] ${
                  isDark ? "border-cyan-300/18 bg-slate-950/30" : "border-white/80 bg-white/24"
                }`}
              >
                <div className="rounded-[2rem] p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Profile Snapshot
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {aboutHighlights.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.4, delay: index * 0.04 }}
                        className="flex items-start gap-3 text-slate-600"
                      >
                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-teal-600" />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    <p className="eyebrow">Tools and Technologies</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {toolsAndTechnologies.map((item) => (
                        <motion.span
                          key={item}
                          whileHover={{ y: -2, scale: 1.03 }}
                          className="chip"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] p-7 sm:p-8">
                  <p className="eyebrow">Profile Visual</p>
                  <div className="mt-4 overflow-hidden rounded-3xl">
                    {splineScene ? (
                      <SplineScene
                        scene={splineScene}
                        className="min-h-[320px] rounded-none border-0 shadow-none"
                      />
                    ) : (
                      <Image
                        src="/images/aryan.jpg"
                        alt="Aryan Kumar portrait"
                        width={720}
                        height={720}
                        className="h-auto w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    {quickFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3"
                      >
                        <p className="text-sm text-slate-500">{fact.label}</p>
                        <p className="text-right text-sm font-semibold text-slate-800">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-16">
          <div className={`${containerClass} relative`}>
            <div className="space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="Skills"
                  title="Stack Built for Delivery"
                  description="A practical toolkit for building backend systems, shipping full-stack products, and automating analytics workflows."
                />
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {skillGroups.map((group, index) => (
                  <Reveal key={group.title} delay={index * 0.05}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="surface-panel h-full p-6"
                    >
                      <h3 className="font-display text-xl font-semibold text-slate-900">
                        {group.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {group.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <motion.span
                            key={item}
                            whileHover={{ y: -2, scale: 1.03 }}
                            className="chip"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </motion.article>
                  </Reveal>
                ))}
              </div>

              <Reveal className="section-shell p-4 sm:p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:gap-7">
                  <div className="min-w-0">
                    <div className="space-y-3">
                      <p className="eyebrow">Freelance Services</p>
                      <h3 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                        Available for high-impact contract work
                      </h3>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {freelanceServices.map((service) => (
                        <motion.article
                          key={service.title}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="h-full rounded-3xl border border-slate-200 bg-white/80 p-5 sm:p-6"
                        >
                          <h4 className="break-words font-display text-lg font-semibold text-slate-900 sm:text-xl">
                            {service.title}
                          </h4>
                          <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                            {service.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {service.stack.map((item) => (
                              <span
                                key={item}
                                className="break-words rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4 rounded-3xl border border-white/60 bg-white/35 p-4 sm:p-5 lg:p-6">
                    <div className="space-y-2">
                      <p className="eyebrow">Stack Signal</p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        Graph and bars below are generated from the same `skillGroups` content
                        shown above.
                      </p>
                    </div>

                    <SectionGraphScene
                      data={skillDepthMetrics}
                      highlightedLabel={skillsFocus}
                      onHoverChange={setSkillsFocus}
                      className="h-[230px] sm:h-[280px] md:h-[320px]"
                    />

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {skillDepthMetrics.map((metric, index) => (
                        <button
                          key={metric.label}
                          type="button"
                          onMouseEnter={() => setSkillsFocus(metric.label)}
                          onMouseLeave={() => setSkillsFocus(null)}
                          onFocus={() => setSkillsFocus(metric.label)}
                          onBlur={() => setSkillsFocus(null)}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                            skillsFocus === metric.label
                              ? "border-slate-300 bg-white/75"
                              : "border-white/50 bg-white/35 hover:bg-white/60"
                          }`}
                        >
                          <div className="flex min-w-0 items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-slate-800">{metric.label}</p>
                            <p className="text-xs font-semibold text-slate-600">
                              {metric.value}
                              {metric.suffix ?? ""}
                            </p>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-slate-200/85">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: metricWidth(metric.value, skillMetricMax) }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{ duration: 0.5, delay: 0.04 + index * 0.03 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: metric.color }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="resume" className="py-16">
          <div className={`${containerClass} relative`}>
            <div className="space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="Resume"
                  title="Experience Timeline"
                  description="A quick view into production engineering work across software delivery, product modernization, and reporting systems."
                />
              </Reveal>

              <Reveal className="surface-panel p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-slate-900">
                      Resume Download
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Get the latest PDF with projects and work details.
                    </p>
                  </div>
                  <a
                    href={personalInfo.resumeFile}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary"
                  >
                    Download Resume
                    <Download size={16} />
                  </a>
                </div>
              </Reveal>

              <div className="grid gap-6 xl:grid-cols-2">
                <Reveal className="surface-panel p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Professional Experience
                  </h3>
                  <div className="mt-6 space-y-4">
                    {experienceItems.map((item) => (
                      <CollapsibleCard
                        key={`${item.title}-${item.duration}`}
                        title={item.title}
                        subtitle={item.subtitle}
                        duration={item.duration}
                        details={item.details}
                      />
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="surface-panel p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Education
                  </h3>
                  <div className="mt-6 space-y-6 border-l-2 border-teal-200 pl-5">
                    {educationItems.map((item) => (
                      <article key={item.title} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                          {item.duration}
                        </p>
                        <h4 className="font-display text-xl font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-sm font-semibold text-slate-500">{item.subtitle}</p>
                        <ul className="space-y-2 pt-1">
                          {item.details.map((detail) => (
                            <li key={detail} className="flex items-start gap-3 text-slate-600">
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                              <span className="leading-relaxed">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="internships" className="py-16">
          <div className={`${containerClass} relative`}>
            <div className="space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="Internships"
                  title="Hands-on Delivery Experience"
                  description="Internship projects where product execution, integrations, and ownership helped shape my engineering approach."
                />
              </Reveal>

              <Reveal className="surface-panel p-7 sm:p-8">
                <div className="space-y-4">
                  {internships.map((internship) => (
                    <CollapsibleCard
                      key={`${internship.company}-${internship.duration}`}
                      title={internship.company}
                      subtitle={internship.role}
                      duration={internship.duration}
                      details={internship.details}
                      accent="emerald"
                      link={{ label: "Visit Company", url: internship.website }}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="projects" className="py-16">
          <div className={`${containerClass} relative`}>
            {unicornProjectId ? (
              <div className="pointer-events-none absolute inset-x-0 top-20 h-[520px] overflow-hidden rounded-[2rem] opacity-[0.3]">
                <UnicornEmbed
                  projectId={unicornProjectId}
                  mode="background"
                  className="h-full min-h-0"
                  height={520}
                />
              </div>
            ) : null}
            <div className="space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="Projects"
                  title="Selected Projects"
                  description="Products and experiments focused on collaboration, AI assistance, automation, and practical utility."
                />
              </Reveal>

              <div className="grid gap-5 md:grid-cols-2">
                {projects.map((project, index) => (
                  <Reveal key={project.slug} delay={index * 0.05}>
                    <motion.article
                      whileHover={{ y: -7, scale: 1.01 }}
                      transition={{ duration: 0.22 }}
                      className="surface-panel flex h-full flex-col p-6"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {project.period} | {project.location}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-teal-700">
                        {project.subtitle}
                      </p>
                      <p className="mt-4 leading-relaxed text-slate-600">
                        {project.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <motion.span key={tech} whileHover={{ y: -2 }} className="chip">
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={`/projects/${project.slug}`} className="button-primary">
                          Details
                          <ArrowUpRight size={15} />
                        </Link>

                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button-ghost"
                          >
                            Live
                            <ExternalLink size={15} />
                          </a>
                        ) : null}

                        {project.repoUrl ? (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button-ghost"
                          >
                            GitHub
                            <Github size={15} />
                          </a>
                        ) : null}
                      </div>
                    </motion.article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className={`${containerClass} relative`}>
            <div className="space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="Contact"
                  title="Start Your Next Build"
                  description="Need help with full-stack delivery, backend APIs, e-commerce customization, or analytics automation? Let us connect."
                />
              </Reveal>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Reveal className="surface-panel p-7 sm:p-8">
                  <div className="space-y-6">
                    <motion.div whileHover={{ x: 2 }} className="flex items-start gap-3">
                      <MapPin className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                          Location
                        </p>
                        <p className="mt-1 leading-relaxed text-slate-700">{contactAddress}</p>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ x: 2 }} className="flex items-start gap-3">
                      <Mail className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                          Email
                        </p>
                        <a
                          href={`mailto:${personalInfo.email}`}
                          className="mt-1 inline-flex text-slate-700 underline-offset-4 transition hover:text-slate-900 hover:underline"
                        >
                          {personalInfo.email}
                        </a>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ x: 2 }} className="flex items-start gap-3">
                      <Phone className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                          Phone
                        </p>
                        <a
                          href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}
                          className="mt-1 inline-flex text-slate-700 underline-offset-4 transition hover:text-slate-900 hover:underline"
                        >
                          {personalInfo.phone}
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -2 }}
                      className="rounded-3xl border border-teal-200 bg-teal-50 p-4"
                    >
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                        <Sparkles size={16} />
                        Available for freelance and full-time opportunities
                      </p>
                    </motion.div>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="surface-panel p-7 sm:p-8">
                  <div className="space-y-2 pb-3">
                    <p className="font-display text-2xl font-semibold text-slate-900">
                      Send a project brief
                    </p>
                    <p className="text-sm text-slate-600">
                      Messages are delivered directly to {personalInfo.email}.
                    </p>
                  </div>
                  <ContactForm />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={`border-t border-white/70 py-8 transition-[padding] duration-300 ${
          isSidebarCollapsed ? "lg:pl-28" : "lg:pl-72"
        }`}
      >
        <div
          className={`${containerClass} flex flex-col items-start justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center`}
        >
          <p>
            (c) {new Date().getFullYear()} <span className="font-semibold">aryankr1508</span>
          </p>
          <p>
            Designed and developed by{" "}
            <span className="font-semibold text-slate-700">Aryan Kumar</span>
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
