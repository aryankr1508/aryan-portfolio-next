import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionTitle from "@/components/section-title";
import { projects } from "@/lib/portfolio-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main id="main-content" aria-label="Project details" className="min-h-screen pb-16 pt-24">
      <div className="mx-auto w-[min(1080px,calc(100%-2rem))] space-y-8">
        <Link
          href="/#projects"
          className="button-ghost"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>

        <section className="surface-panel p-7 sm:p-8">
          <SectionTitle
            eyebrow="Project"
            title={project.title}
            description={project.subtitle}
          />

          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-slate-500">
            <span className="rounded-full bg-teal-100 px-3 py-1.5 text-teal-700">
              {project.period}
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1.5 text-orange-700">
              {project.location}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700">
              {project.resultMetric}
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/70">
            <Image
              src={project.thumbnail}
              alt={`${project.title} project banner`}
              width={1280}
              height={720}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Overview
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                {project.description}
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Outcome
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                {project.impact}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Problem
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{project.story.problem}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Solution
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{project.story.solution}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Result
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{project.story.result}</p>
              </article>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Screenshots
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {project.screenshots.map((shot) => (
                  <div key={shot} className="overflow-hidden rounded-2xl border border-white/70">
                    <Image
                      src={shot}
                      alt={`${project.title} screenshot`}
                      width={1280}
                      height={720}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Architecture
              </h3>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
                <Image
                  src={project.architectureDiagram}
                  alt={`${project.title} architecture diagram`}
                  width={1280}
                  height={720}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="chip"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                What I&rsquo;d Improve Next
              </h3>
              <ul className="mt-3 space-y-2">
                {project.nextImprovements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary"
                >
                  Live Project
                  <ExternalLink size={15} />
                </a>
              ) : null}

              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-accent"
                >
                  Demo
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
                  Source Code
                  <Github size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
