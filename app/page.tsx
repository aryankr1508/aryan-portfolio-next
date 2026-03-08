"use client";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sparkles,
  Sun,
  Twitter,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import CollapsibleCard from "@/components/collapsible-card";
import ContactForm from "@/components/contact-form";
import HeroCursorCubesScene from "@/components/hero-cursor-cubes-scene";
import HeroThreeScene from "@/components/hero-three-scene";
import ProjectsShowcase from "@/components/projects-showcase";
import Reveal from "@/components/reveal";
import SectionTitle from "@/components/section-title";
import SkillsGrid from "@/components/skills-grid";
import StageSection from "@/components/stage-section";
import SplineScene from "@/components/spline-scene";
import AuroraBackground from "@/components/aurora-background";
import { trackEvent } from "@/lib/analytics";
import {
  aboutHighlights,
  contactAddress,
  educationItems,
  experienceItems,
  getShowcaseProjects,
  internships,
  navItems,
  personalInfo,
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

const containerClass = "mx-auto w-[min(1180px,calc(100%-2rem))]";
const primarySocialLabels = new Set(["GitHub", "LinkedIn"]);

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [useLiteVisuals, setUseLiteVisuals] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  });
  const showcaseProjects = useMemo(() => getShowcaseProjects(), []);

  const handleViewProject = useCallback(
    (projectId: string) => {
      trackEvent("experience_project_jump", { project: projectId, section: "projects" });
      // Smooth-scroll to projects section
      const section = document.getElementById("projects");
      if (!section) return;

      const sectionOffset = -96;
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
    },
    []
  );

  const heroSplineScene =
    process.env.NEXT_PUBLIC_HERO_SPLINE_SCENE_URL ?? process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ?? "";
  const heroInteractiveSplineScene =
    process.env.NEXT_PUBLIC_HERO_INTERACTIVE_SPLINE_SCENE_URL ??
    process.env.NEXT_PUBLIC_HERO_SPLINE_SCENE_URL ??
    "";
  const heroSceneInBanner = heroInteractiveSplineScene || heroSplineScene;
  const splineScene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;
  const isDark = theme === "dark";
  const primarySocialLinks = socialLinks.filter((social) => primarySocialLabels.has(social.label));
  const additionalSocialLinks = socialLinks.filter(
    (social) => !primarySocialLabels.has(social.label)
  );
  const heroFacts = quickFacts.slice(0, 4);

  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 145,
    damping: 28,
    mass: 0.32
  });
  const heroY = useTransform(scrollY, [0, 560], [0, 44]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 1024px), (prefers-reduced-motion: reduce)"
    );

    const updateVisualMode = () => {
      setUseLiteVisuals(mediaQuery.matches);
    };

    updateVisualMode();
    mediaQuery.addEventListener("change", updateVisualMode);

    return () => {
      mediaQuery.removeEventListener("change", updateVisualMode);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    let frameId = 0;

    const updateActiveSection = () => {
      const probeLine = Math.max(120, window.innerHeight * 0.32);
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

    const sectionOffset = -96;
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

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"
        style={{ scaleX: progressScale }}
      />

      {!useLiteVisuals ? (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
          <HeroThreeScene
            mode="background"
            className={isDark ? "opacity-[0.56]" : "opacity-[0.48]"}
          />
        </div>
      ) : null}

      {isDark && !useLiteVisuals ? <AuroraBackground /> : null}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 -z-30 ${
          isDark
            ? "bg-[radial-gradient(circle_at_16%_8%,rgba(20,184,166,0.1),transparent_46%),radial-gradient(circle_at_82%_12%,rgba(251,146,60,0.08),transparent_50%),linear-gradient(to_bottom,rgba(2,3,6,0.98),rgba(7,10,16,0.99))]"
            : "bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.16),transparent_46%),radial-gradient(circle_at_80%_14%,rgba(20,184,166,0.16),transparent_50%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(241,245,249,0.98))]"
        }`}
      />
      {!useLiteVisuals ? <div aria-hidden className="grid-fog" /> : null}
      {!useLiteVisuals ? <div aria-hidden className="grain-overlay" /> : null}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`${containerClass} pt-4`}>
          <div
            className={`glass-top-nav flex items-center justify-between rounded-full border px-3 py-2 shadow-[0_14px_36px_rgba(2,6,23,0.22)] backdrop-blur-xl sm:px-4 ${
              isDark
                ? "border-slate-600/55 bg-slate-950/82"
                : "border-slate-200/85 bg-white/78"
            }`}
          >
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1.5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-teal-300 to-amber-300 text-xs font-bold text-slate-950">
                AK
              </span>
              <span className={`hidden text-sm font-semibold sm:inline ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                Aryan Kumar
              </span>
            </button>

            <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-slate-100"
                          : "bg-teal-100 text-teal-700"
                        : isDark
                          ? "text-slate-300 hover:bg-white/10 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  isDark
                    ? "border-slate-600/55 bg-slate-900/82 text-slate-100 hover:border-slate-400/65 hover:text-white"
                    : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-500/45 hover:text-slate-900"
                }`}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden ${
                  isDark
                    ? "border-slate-600/55 bg-slate-900/82 text-slate-100 hover:border-slate-400/65 hover:text-white"
                    : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-500/45 hover:text-slate-900"
                }`}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/55"
            />

            <motion.aside
              id="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-l p-5 backdrop-blur-xl ${
                isDark ? "border-slate-600/45 bg-slate-950/94" : "border-slate-200/80 bg-white/94"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`font-display text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Navigation
                </p>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    isDark
                      ? "border-slate-600/55 bg-slate-900/82 text-slate-100 hover:border-slate-400/65 hover:text-white"
                      : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-500/45 hover:text-slate-900"
                  }`}
                  aria-label="Close navigation menu"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`inline-flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        isActive
                          ? isDark
                            ? "border-teal-300/45 bg-white/10 text-white"
                            : "border-teal-300/65 bg-teal-50 text-teal-700"
                          : isDark
                            ? "border-slate-700/80 bg-slate-900/70 text-slate-200 hover:border-teal-300/40 hover:text-white"
                            : "border-slate-300/85 bg-white/90 text-slate-700 hover:border-teal-500/45 hover:text-slate-900"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={15} />
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main id="main-content" aria-label="Portfolio content" className="pb-20 pt-28">
        <section id="home" className="flex min-h-[calc(82svh-6rem)] items-center py-8">
          <div className={`${containerClass} relative`}>
            <div
              className={`hero-interactive-shell relative isolate overflow-hidden rounded-[2rem] border px-5 py-6 sm:px-8 sm:py-10 lg:px-10 ${
                isDark
                  ? "border-slate-600/45 bg-slate-950/68"
                  : "border-slate-200/80 bg-white/68"
              }`}
            >
              <HeroCursorCubesScene
                theme={theme}
                splineScene={!useLiteVisuals ? heroSceneInBanner : undefined}
                useLiteVisuals={useLiteVisuals}
                variant="background"
                className="z-[1]"
              />
              {!useLiteVisuals ? (
                <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] hero-interactive-grid opacity-40" />
              ) : null}
              <div
                className={`pointer-events-none absolute inset-0 z-[2] ${
                  isDark
                    ? "bg-gradient-to-r from-slate-950/70 via-slate-950/58 to-slate-950/42 lg:from-slate-950/64 lg:via-slate-950/50 lg:to-slate-950/36"
                    : "bg-gradient-to-r from-white/82 via-white/66 to-white/46 lg:from-white/74 lg:via-white/58 lg:to-white/38"
                }`}
              />
              <div className="pointer-events-none relative z-10 grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <motion.div style={{ y: useLiteVisuals ? 0 : heroY }} className="space-y-7">
                  <p
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      isDark
                        ? "border-teal-300/35 bg-teal-500/12 text-teal-100"
                        : "border-teal-300/55 bg-teal-500/10 text-teal-700"
                    }`}
                  >
                    <Sparkles size={14} />
                    Open to freelance and full-time roles
                  </p>

                  <h1
                    className={`font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04] ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Hi, I&apos;m Aryan.
                    <span
                      className={`block ${
                        isDark
                          ? "bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent"
                          : "bg-gradient-to-r from-teal-700 via-emerald-700 to-amber-700 bg-clip-text text-transparent"
                      }`}
                    >
                      A Full Stack Developer building scalable web applications.
                    </span>
                  </h1>

                  <p className={`max-w-2xl text-base leading-relaxed sm:text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {personalInfo.summary}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("cta_click", { cta: "hero_view_work", section: "home" });
                        scrollToSection("projects");
                      }}
                      className="button-primary pointer-events-auto"
                    >
                      View Work
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("cta_click", { cta: "hero_contact", section: "home" });
                        scrollToSection("contact");
                      }}
                      className="button-ghost pointer-events-auto"
                    >
                      Contact Me
                      <ArrowUpRight size={16} />
                    </button>
                    <a
                      href={personalInfo.resumeFile}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent("cta_click", { cta: "hero_resume_download", section: "home" })}
                      className="button-accent pointer-events-auto"
                    >
                      Resume
                      <Download size={16} />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {heroFacts.map((fact) => (
                      <span key={fact.label} className="chip">
                        {fact.value}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <article className="surface-panel showcase-card card-hero overflow-hidden p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Profile Visual
                    </p>
                    <div
                      className={`mt-3 overflow-hidden rounded-2xl border border-white/60 p-3 ${
                        isDark ? "bg-slate-950/48" : "bg-slate-100/70"
                      }`}
                    >
                      {splineScene && !useLiteVisuals ? (
                        <SplineScene
                          scene={splineScene}
                          className="min-h-[250px] rounded-none border-0 shadow-none"
                        />
                      ) : (
                        <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-2xl border border-white/70">
                          <Image
                            src="/images/aryan.jpg"
                            alt="Aryan Kumar portrait"
                            width={652}
                            height={652}
                            className="h-auto w-full object-cover object-top"
                          />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={15} />
                      {personalInfo.location}
                    </p>
                  </article>

                  <article className="surface-panel showcase-card card-hero p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Primary Profiles
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {primarySocialLinks.map((social) => {
                        const Icon = socialIconMap[social.label] ?? ExternalLink;
                        return (
                          <a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-500/45 hover:text-slate-900"
                        >
                            <Icon size={14} />
                            {social.label}
                          </a>
                        );
                      })}
                    </div>
                  </article>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <StageSection id="about" tone="mint" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="About"
                  title="Focused On Impact, Not Resume Clutter"
                  description="I build practical product systems that improve speed, reliability, and developer flow across API-heavy and data-heavy workloads."
                />
              </Reveal>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Reveal className="surface-panel showcase-card card-about p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">What I bring</h3>
                  <ul className="mt-5 space-y-3">
                    {aboutHighlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-600">
                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-teal-600" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={0.08} className="surface-panel showcase-card card-about p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">Core Stack</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {toolsAndTechnologies.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-slate-600">
                    B.Tech in Computer Science Engineering (2019-2023), Vellore Institute of Technology.
                  </p>
                </Reveal>
              </div>
        </StageSection>

        <StageSection id="skills" tone="sky" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="Skills"
                  title="Backend-First, Full-Spectrum Skill Set"
                  description="A practical overview of my core backend strengths plus frontend, mobile, desktop, cloud, DevOps, data engineering, BI, and AI capabilities."
                />
              </Reveal>

              <SkillsGrid skillGroups={skillGroups} />
        </StageSection>

        <StageSection id="resume" tone="amber" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="Resume"
                  title="Recent Professional Experience"
                  description="A concise timeline of delivery work, product ownership, and engineering impact. Expand each role to view deep dives for company projects."
                />
              </Reveal>

              <Reveal className="surface-panel showcase-card card-resume card-resume-panel p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-slate-900">Download Resume</p>
                    <p className="mt-1 text-sm text-slate-600">Latest PDF with project and role details.</p>
                  </div>
                  <a
                    href={personalInfo.resumeFile}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary"
                  >
                    Download
                    <Download size={16} />
                  </a>
                </div>
              </Reveal>

              <div className="grid gap-6 xl:grid-cols-2">
                <Reveal className="surface-panel showcase-card card-resume card-resume-panel p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">Professional Experience</h3>
                  <div className="mt-6 space-y-4">
                    {experienceItems.map((item) => (
                      <CollapsibleCard
                        key={`${item.title}-${item.duration}`}
                        title={item.title}
                        subtitle={item.subtitle}
                        duration={item.duration}
                        details={item.details}
                        projects={item.companyProjects}
                        onViewProject={handleViewProject}
                      />
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="surface-panel showcase-card card-resume card-resume-panel p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">Education</h3>
                  <div className="mt-6 space-y-5 border-l-2 border-teal-200 pl-5">
                    {educationItems.map((item) => (
                      <article key={item.title} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                          {item.duration}
                        </p>
                        <h4 className="font-display text-xl font-semibold text-slate-900">{item.title}</h4>
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
        </StageSection>

        <StageSection id="internships" tone="indigo" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="Internships"
                  title="Early Ownership, Real Deliverables"
                  description="Internship projects where I shipped production features, handled integrations, and worked directly on outcomes."
                />
              </Reveal>

              <motion.div
                className="grid gap-5 md:grid-cols-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {internships.map((internship) => (
                  <motion.div
                    key={`${internship.company}-${internship.duration}`}
                    variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                  >
                    <article className="surface-panel showcase-card card-internship h-full p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        {internship.duration}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                        {internship.company}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{internship.role}</p>

                      <ul className="mt-4 space-y-2">
                        {internship.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={internship.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-600"
                      >
                        Visit Company
                        <ExternalLink size={15} />
                      </a>
                    </article>
                  </motion.div>
                ))}
              </motion.div>
        </StageSection>

        <StageSection id="projects" tone="sky" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="Projects"
                  title="Selected Work"
                  description="Enterprise delivery and independent builds - select a project to explore the details."
                />
              </Reveal>

              <ProjectsShowcase
                projects={showcaseProjects}
                isDark={isDark}
              />
        </StageSection>

        <StageSection id="contact" tone="coral" containerClass={containerClass}>
              <Reveal>
                <SectionTitle
                  eyebrow="Contact"
                  title="Let&apos;s Build Something Useful"
                  description="If you need a full-stack developer for product delivery, API integrations, or reporting automation, send me your brief."
                />
              </Reveal>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Reveal className="surface-panel showcase-card card-contact p-7 sm:p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Location</p>
                        <p className="mt-1 leading-relaxed text-slate-700">{contactAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Email</p>
                        <a
                          href={`mailto:${personalInfo.email}`}
                          className="mt-1 inline-flex text-slate-700 underline-offset-4 transition hover:text-slate-900 hover:underline"
                        >
                          {personalInfo.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-1 text-teal-700" size={19} />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Phone</p>
                        <a
                          href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}
                          className="mt-1 inline-flex text-slate-700 underline-offset-4 transition hover:text-slate-900 hover:underline"
                        >
                          {personalInfo.phone}
                        </a>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-teal-200 bg-teal-50 p-4">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                        <Sparkles size={16} />
                        Available for freelance and full-time opportunities
                      </p>
                    </div>

                    {additionalSocialLinks.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          More profiles
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {additionalSocialLinks.map((social) => {
                            const Icon = socialIconMap[social.label] ?? ExternalLink;
                            return (
                              <a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-500/45 hover:text-slate-900"
                              >
                                <Icon size={13} />
                                {social.label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="surface-panel showcase-card card-contact p-7 sm:p-8">
                  <div className="space-y-3 pb-3">
                    <p className="font-display text-2xl font-semibold text-slate-900">Send a project brief</p>
                    <p className="text-sm text-slate-600">Messages are delivered directly to {personalInfo.email}.</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={personalInfo.calendlyUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackEvent("cta_click", { cta: "contact_book_call", section: "contact" })}
                        className="button-ghost"
                      >
                        Book a Call
                        <CalendarClock size={15} />
                      </a>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                        Replies within 24h
                      </p>
                    </div>
                  </div>
                  <ContactForm />
                </Reveal>
              </div>
        </StageSection>
      </main>

      <footer className="border-t border-white/70 py-8">
        <div
          className={`${containerClass} flex flex-col items-start justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center`}
        >
          <p>
            (c) {new Date().getFullYear()} <span className="font-semibold">aryankr1508</span>
          </p>
          <p>
            Designed and developed by <span className="font-semibold text-slate-700">Aryan Kumar</span>
          </p>
        </div>
      </footer>
    </>
  );
}
