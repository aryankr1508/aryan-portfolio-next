"use client";

import {
  ArrowDown,
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
import Reveal from "@/components/reveal";
import SectionTitle from "@/components/section-title";
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

const containerClass = "mx-auto w-[min(1120px,calc(100%-2rem))]";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    mass: 0.3
  });
  const heroY = useTransform(scrollY, [0, 600], [0, 90]);

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
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-20% 0px -55% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400"
        style={{ scaleX: progressScale }}
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="fluid-blob fluid-blob-a" />
        <div className="fluid-blob fluid-blob-b" />
        <div className="fluid-blob fluid-blob-c" />
      </div>

      <header className="fixed inset-x-0 top-4 z-50">
        <div className={`${containerClass} relative`}>
          <div className="flex items-center justify-between rounded-full border border-white/80 bg-white/80 px-5 py-3 shadow-soft backdrop-blur-xl sm:px-6">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="font-display text-base font-semibold text-slate-900 transition hover:text-sky-600"
            >
              Aryan Kumar
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeSection === item.id
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {isMobileMenuOpen ? (
            <div className="mt-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-soft backdrop-blur-xl lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      activeSection === item.id
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
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
        <section id="home" className="py-16 sm:py-20">
          <div
            className={`${containerClass} grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center`}
          >
            <motion.div style={{ y: heroY }} className="space-y-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <BriefcaseBusiness size={14} />
                Available for freelance projects
              </p>

              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  {personalInfo.name}
                </h1>
                <p className="max-w-xl text-lg text-slate-600 sm:text-xl">
                  {personalInfo.role}
                </p>
                <p className="max-w-2xl leading-relaxed text-slate-600">
                  {personalInfo.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  View Projects
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Hire Me (Freelance)
                  <ArrowUpRight size={16} />
                </button>
                <a
                  href={personalInfo.resumeFile}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                >
                  Download Resume
                  <Download size={16} />
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.label] ?? ExternalLink;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      <Icon size={15} />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <Reveal className="mx-auto w-full max-w-md">
              <div className="glass-panel p-5 sm:p-7">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/images/aryan2.jpg"
                    alt="Aryan Kumar portrait"
                    width={720}
                    height={720}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {quickFacts.slice(0, 4).map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border border-slate-100 bg-white p-3"
                    >
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                        {fact.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="about" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="About"
                title="Practical Engineering With Product Focus"
                description="I build systems that improve performance, delivery speed, and decision-making for product teams."
              />
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Reveal className="glass-panel p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  Profile Snapshot
                </h3>
                <ul className="mt-5 space-y-4">
                  {aboutHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-sky-400" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Tools and Technologies
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {toolsAndTechnologies.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="glass-panel p-7 sm:p-8">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/images/aryan.jpg"
                    alt="Aryan Kumar"
                    width={700}
                    height={860}
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {quickFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"
                    >
                      <p className="text-sm text-slate-500">{fact.label}</p>
                      <p className="text-right text-sm font-medium text-slate-700">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="skills" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Skills"
                title="Technical Stack"
                description="A delivery-focused stack for backend systems, integrations, and scalable web products."
              />
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((group, index) => (
                <Reveal key={group.title} delay={index * 0.05} className="h-full">
                  <article className="glass-panel h-full p-6">
                    <h3 className="font-display text-xl font-semibold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {group.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Freelance Services"
                title="How I Can Help Your Business"
                description="If you need a reliable engineer for contract or freelance work, I can deliver quickly with clear communication."
              />
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              {freelanceServices.map((service, index) => (
                <Reveal key={service.title} delay={index * 0.06}>
                  <article className="glass-panel h-full p-6">
                    <h3 className="font-display text-2xl font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Experience"
                title="Work Timeline"
                description="Each role is expandable so visitors can quickly explore your complete work history."
              />
            </Reveal>

            <Reveal className="glass-panel p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-slate-900">
                    Resume Download
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Download the latest PDF resume directly.
                  </p>
                </div>
                <a
                  href={personalInfo.resumeFile}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Download Resume
                  <Download size={16} />
                </a>
              </div>
            </Reveal>

            <div className="grid gap-6 xl:grid-cols-2">
              <Reveal className="glass-panel p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  Professional Experience
                </h3>
                <div className="mt-6 space-y-4">
                  {experienceItems.map((item, index) => (
                    <CollapsibleCard
                      key={`${item.title}-${item.duration}`}
                      title={item.title}
                      subtitle={item.subtitle}
                      duration={item.duration}
                      details={item.details}
                      defaultOpen={index === 0}
                    />
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.07} className="glass-panel p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  Education
                </h3>
                <div className="mt-6 space-y-6 border-l-2 border-emerald-100 pl-5">
                  {educationItems.map((item) => (
                    <article key={item.title} className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.16em] text-emerald-600">
                        {item.duration}
                      </p>
                      <h4 className="font-display text-xl font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-sm font-medium text-slate-500">{item.subtitle}</p>
                      <ul className="space-y-2 pt-1">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-3 text-slate-600">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
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
        </section>

        <section id="internships" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Internships"
                title="Hands-On Internship Experience"
                description="Internship entries are also collapsible. CUREYA is shown first, followed by PropVIVO."
              />
            </Reveal>

            <Reveal className="glass-panel p-7 sm:p-8">
              <div className="space-y-4">
                {internships.map((internship, index) => (
                  <CollapsibleCard
                    key={`${internship.company}-${internship.duration}`}
                    title={internship.company}
                    subtitle={internship.role}
                    duration={internship.duration}
                    details={internship.details}
                    defaultOpen={index === 0}
                    accent="emerald"
                    link={{ label: "Visit Company", url: internship.website }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="projects" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Projects"
                title="Selected Work"
                description="Products and experiments focused on collaboration, AI assistance, automation, and practical utility."
              />
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.05} className="h-full">
                  <motion.article
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="glass-panel flex h-full flex-col p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      {project.period} | {project.location}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-sky-600">
                      {project.subtitle}
                    </p>
                    <p className="mt-4 leading-relaxed text-slate-600">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Details
                        <ArrowUpRight size={15} />
                      </Link>

                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
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
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
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
        </section>

        <section id="contact" className="py-16">
          <div className={`${containerClass} space-y-9`}>
            <Reveal>
              <SectionTitle
                eyebrow="Contact"
                title="Let us build your next project"
                description="Need a freelancer for backend, full-stack, e-commerce customization, or reporting automation? Send a message."
              />
            </Reveal>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Reveal className="glass-panel p-7 sm:p-8">
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-sky-600" size={19} />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Location
                      </p>
                      <p className="mt-1 leading-relaxed text-slate-700">
                        {contactAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 text-sky-600" size={19} />
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
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 text-sky-600" size={19} />
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
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="glass-panel p-6 sm:p-8">
                <div className="space-y-2 pb-3">
                  <p className="font-display text-2xl font-semibold text-slate-900">
                    Contact Me
                  </p>
                  <p className="text-sm text-slate-600">
                    Your message will be delivered to {personalInfo.email}.
                  </p>
                </div>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 py-8">
        <div
          className={`${containerClass} flex flex-col items-start justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center`}
        >
          <p>
            © {new Date().getFullYear()} <span className="font-semibold">aryankr1508</span>
          </p>
          <p>
            Developed by <span className="font-semibold text-slate-700">Aryan Kumar</span>
          </p>
        </div>
      </footer>
    </>
  );
}
