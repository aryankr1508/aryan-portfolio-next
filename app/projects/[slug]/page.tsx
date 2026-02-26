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
                    className="chip"
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
