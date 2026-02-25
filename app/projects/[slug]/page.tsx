import { ArrowLeft, ExternalLink, Github } from "lucide-react";
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
    <main className="min-h-screen pb-16 pt-24">
      <div className="mx-auto w-[min(960px,calc(100%-2rem))] space-y-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>

        <section className="glass-panel p-7 sm:p-8">
          <SectionTitle
            eyebrow="Project"
            title={project.title}
            description={project.subtitle}
          />

          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {project.period}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {project.location}
            </span>
          </div>

          <div className="mt-8 space-y-6">
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

            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
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
