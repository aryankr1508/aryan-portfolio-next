"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Twitter,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CollapsibleCard from "@/components/collapsible-card";
import ContactForm from "@/components/contact-form";
import HeroThreeScene from "@/components/hero-three-scene";
import Reveal from "@/components/reveal";
import SectionAmbient from "@/components/section-ambient";
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

const containerClass = "mx-auto w-[min(1180px,calc(100%-2rem))]";
const graphPalette = ["#0f766e", "#0ea5e9", "#f97316", "#14b8a6", "#0369a1", "#334155"];

const metricWidth = (value: number, max: number) =>
  `${Math.max(8, Math.min(100, (value / max) * 100))}%`;

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [skillsFocus, setSkillsFocus] = useState<string | null>(null);
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
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.56],
        rootMargin: "-18% 0px -55% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-1 origin-left bg-gradient-to-r from-teal-700 via-cyan-500 to-orange-500"
        style={{ scaleX: progressScale }}
      />

      <div aria-hidden className="grid-fog" />
      <div aria-hidden className="grain-overlay" />

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="drift-blob drift-blob-a" />
        <div className="drift-blob drift-blob-b" />
        <div className="drift-blob drift-blob-c" />
      </div>

      <header className="fixed inset-x-0 top-4 z-50">
        <div className={`${containerClass} relative`}>
          <div className="surface-panel flex items-center justify-between px-5 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="font-display text-base font-semibold text-slate-900 transition hover:text-teal-700"
            >
              Aryan Kumar
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-teal-700 text-white"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {isMobileMenuOpen ? (
            <div className="surface-panel mt-3 p-3 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                      activeSection === item.id
                        ? "bg-teal-700 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="pb-20 pt-28">
        <section id="home" className="py-14 sm:py-20">
          <div className={containerClass}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 px-5 py-6 shadow-soft sm:px-8 sm:py-10 lg:px-10">
              <div className="pointer-events-none absolute inset-0">
                <HeroThreeScene mode="background" className="opacity-[0.62]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8f7f1]/96 via-[#f8f7f1]/82 to-[#f8f7f1]/66 lg:from-[#f8f7f1]/95 lg:via-[#f8f7f1]/84 lg:to-[#f8f7f1]/44" />
              </div>

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <motion.div style={{ y: heroY }} className="space-y-7">
                  <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    <BriefcaseBusiness size={14} />
                    Building modern product systems
                  </p>

                  <div className="space-y-4">
                    <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-[4.25rem] lg:leading-[1]">
                      {personalInfo.name}
                    </h1>
                    <p className="max-w-2xl text-xl text-slate-700">{personalInfo.role}</p>
                    <p className="max-w-2xl leading-relaxed text-slate-600">
                      {personalInfo.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("projects")}
                      className="button-primary"
                    >
                      Explore Projects
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("contact")}
                      className="button-accent"
                    >
                      Let us work together
                      <ArrowUpRight size={16} />
                    </button>
                    <a
                      href={personalInfo.resumeFile}
                      target="_blank"
                      rel="noreferrer"
                      className="button-ghost"
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
                        className="surface-panel px-4 py-3"
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          {fact.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{fact.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <Reveal className="space-y-5 lg:self-end lg:pb-2">
                  <div className="rounded-3xl border border-white/60 bg-white/30 p-5 backdrop-blur-md">
                    <p className="eyebrow">Social</p>
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
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-white/90 hover:text-slate-900"
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
            <SectionAmbient tone="teal" />
            <div className="relative z-10 space-y-9">
              <Reveal>
                <SectionTitle
                  eyebrow="About"
                  title="Engineering With Product Thinking"
                  description="I optimize systems for speed, reliability, and measurable outcomes while keeping delivery practical for business teams."
                />
              </Reveal>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Reveal className="surface-panel p-7 sm:p-8">
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
                </Reveal>

                <Reveal delay={0.08} className="surface-panel p-7 sm:p-8">
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
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-16">
          <div className={`${containerClass} relative`}>
            <SectionAmbient tone="sky" />
            <div className="relative z-10 space-y-9">
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

              <Reveal className="section-shell p-6 sm:p-8">
                <div className="grid gap-7 xl:grid-cols-[1.08fr_0.92fr]">
                  <div>
                    <div className="space-y-3">
                      <p className="eyebrow">Freelance Services</p>
                      <h3 className="font-display text-3xl font-semibold leading-tight text-slate-900">
                        Available for high-impact contract work
                      </h3>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {freelanceServices.map((service) => (
                        <motion.article
                          key={service.title}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-3xl border border-slate-200 bg-white/80 p-5"
                        >
                          <h4 className="font-display text-xl font-semibold text-slate-900">
                            {service.title}
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            {service.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {service.stack.map((item) => (
                              <span
                                key={item}
                                className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-white/60 bg-white/35 p-4 sm:p-5">
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
                      className="h-[290px] sm:h-[320px]"
                    />

                    <div className="space-y-2">
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
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800">{metric.label}</p>
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
            <SectionAmbient tone="teal" />
            <div className="relative z-10 space-y-9">
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
            <SectionAmbient tone="orange" />
            <div className="relative z-10 space-y-9">
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
            <SectionAmbient tone="sky" />
            {unicornProjectId ? (
              <div className="pointer-events-none absolute inset-x-0 top-20 h-[520px] overflow-hidden rounded-[2rem] opacity-[0.3]">
                <UnicornEmbed
                  projectId={unicornProjectId}
                  mode="background"
                  className="h-full min-h-0"
                  height={520}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f1]/70 via-[#f8f7f1]/90 to-[#f8f7f1]" />
              </div>
            ) : null}
            <div className="relative z-10 space-y-9">
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
            <SectionAmbient tone="orange" />
            <div className="relative z-10 space-y-9">
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

      <footer className="border-t border-white/70 py-8">
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
    </>
  );
}
