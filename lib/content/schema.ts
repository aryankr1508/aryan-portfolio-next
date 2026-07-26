import { z } from "zod";

const requiredText = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const httpUrl = z.url({ protocol: /^https?$/ });
const optionalHttpUrl = z.preprocess(
  (value) => value === "" ? undefined : value,
  httpUrl.optional()
);
const assetUrl = z.string().trim().min(1).refine(
  (value) => value.startsWith("/") || /^https?:\/\//.test(value),
  "Expected a public path or an HTTP(S) URL"
);
const optionalAssetUrl = z.preprocess(
  (value) => value === "" ? undefined : value,
  assetUrl.optional()
);
const isActive = z.boolean().default(true);

export const navItemSchema = z.object({
  id: requiredText,
  label: requiredText
});

export const factSchema = z.object({
  label: requiredText,
  value: requiredText
});

export const skillGroupSchema = z.object({
  title: requiredText,
  description: requiredText,
  items: z.array(requiredText)
});

export const experienceProjectSchema = z.object({
  isActive,
  name: requiredText,
  shortTitle: optionalText,
  subtitle: optionalText,
  role: optionalText,
  engagement: optionalText,
  status: optionalText,
  summary: requiredText,
  challenge: optionalText,
  outcome: optionalText,
  stack: z.array(requiredText),
  highlights: z.array(requiredText),
  confidentialityNote: optionalText,
  link: z.object({
    label: requiredText,
    url: httpUrl
  }).optional()
});

export const resumeItemSchema = z.object({
  isActive,
  title: requiredText,
  subtitle: requiredText,
  duration: requiredText,
  details: z.array(requiredText),
  companyProjects: z.array(experienceProjectSchema).optional()
});

export const projectSchema = z.object({
  isActive,
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["personal", "freelance"]),
  title: requiredText,
  subtitle: requiredText,
  role: requiredText,
  period: requiredText,
  location: requiredText,
  description: requiredText,
  impact: requiredText,
  resultMetric: requiredText,
  thumbnail: assetUrl,
  story: z.object({
    problem: requiredText,
    solution: requiredText,
    result: requiredText
  }),
  highlights: z.array(requiredText),
  screenshots: z.array(assetUrl),
  architectureDiagram: assetUrl,
  nextImprovements: z.array(requiredText),
  technologies: z.array(requiredText),
  liveUrl: optionalHttpUrl,
  repoUrl: optionalHttpUrl,
  demoUrl: optionalHttpUrl
});

export const internshipSchema = z.object({
  isActive,
  company: requiredText,
  role: requiredText,
  duration: requiredText,
  details: z.array(requiredText),
  website: httpUrl
});

export const showcaseProjectSchema = z.object({
  isActive,
  id: requiredText,
  title: requiredText,
  subtitle: requiredText,
  category: z.enum(["company", "freelance", "personal"]),
  year: requiredText,
  company: optionalText,
  role: requiredText,
  engagement: requiredText,
  status: requiredText,
  overview: requiredText,
  challenge: requiredText,
  contributions: z.array(requiredText),
  outcome: requiredText,
  techStack: z.array(requiredText),
  confidential: z.boolean(),
  caseStudyUrl: optionalAssetUrl,
  githubUrl: optionalHttpUrl,
  liveUrl: optionalHttpUrl,
  liveLabel: optionalText
});

export const portfolioSnapshotSchema = z.object({
  personalInfo: z.object({
    name: requiredText,
    role: requiredText,
    profileImage: assetUrl,
    summary: requiredText,
    location: requiredText,
    email: z.email(),
    phone: requiredText,
    calendlyUrl: httpUrl,
    degree: requiredText,
    university: requiredText,
    resumeFile: assetUrl
  }),
  siteCopy: z.object({
    metadata: z.object({
      title: requiredText,
      description: requiredText
    }),
    hero: z.object({
      availability: requiredText,
      greeting: requiredText,
      headline: requiredText,
      viewWorkLabel: requiredText,
      contactLabel: requiredText,
      resumeLabel: requiredText
    }),
    about: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText,
      highlightsTitle: requiredText,
      stackTitle: requiredText,
      educationSummary: requiredText
    }),
    skills: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText
    }),
    resume: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText,
      downloadTitle: requiredText,
      downloadDescription: requiredText,
      experienceTitle: requiredText,
      educationTitle: requiredText
    }),
    internships: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText
    }),
    projects: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText
    }),
    contact: z.object({
      eyebrow: requiredText,
      title: requiredText,
      description: requiredText,
      availability: requiredText,
      briefTitle: requiredText,
      responseTime: requiredText
    })
  }),
  navItems: z.array(navItemSchema),
  socialLinks: z.array(z.object({
    label: requiredText,
    url: httpUrl,
    primary: z.boolean()
  })),
  aboutHighlights: z.array(requiredText),
  toolsAndTechnologies: z.array(requiredText),
  quickFacts: z.array(factSchema),
  skillGroups: z.array(skillGroupSchema),
  experienceItems: z.array(resumeItemSchema),
  educationItems: z.array(resumeItemSchema),
  projects: z.array(projectSchema),
  internships: z.array(internshipSchema),
  contactAddress: requiredText,
  freelanceShowcaseProjects: z.array(showcaseProjectSchema),
  featuredProjectIds: z.array(requiredText)
}).superRefine((snapshot, context) => {
  const navIds = new Set<string>();
  for (const [index, item] of snapshot.navItems.entries()) {
    if (navIds.has(item.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate navigation ID: ${item.id}`,
        path: ["navItems", index, "id"]
      });
    }
    navIds.add(item.id);
  }

  const projectSlugs = new Set<string>();
  for (const [index, project] of snapshot.projects.entries()) {
    if (projectSlugs.has(project.slug)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate project slug: ${project.slug}`,
        path: ["projects", index, "slug"]
      });
    }
    projectSlugs.add(project.slug);
  }

  const freelanceIds = new Set<string>();
  for (const [index, project] of snapshot.freelanceShowcaseProjects.entries()) {
    if (freelanceIds.has(project.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate freelance project ID: ${project.id}`,
        path: ["freelanceShowcaseProjects", index, "id"]
      });
    }
    freelanceIds.add(project.id);
  }

  const showcaseIds = new Set([
    ...snapshot.projects.map((project) => project.slug),
    ...snapshot.freelanceShowcaseProjects.map((project) => project.id),
    ...snapshot.experienceItems.flatMap((item) =>
      (item.companyProjects ?? []).map((project) =>
        project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      )
    )
  ]);
  const featuredIds = new Set<string>();
  for (const [index, featuredId] of snapshot.featuredProjectIds.entries()) {
    if (featuredIds.has(featuredId)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate featured project ID: ${featuredId}`,
        path: ["featuredProjectIds", index]
      });
    } else if (!showcaseIds.has(featuredId)) {
      context.addIssue({
        code: "custom",
        message: `Unknown featured project ID: ${featuredId}`,
        path: ["featuredProjectIds", index]
      });
    }
    featuredIds.add(featuredId);
  }
});

export type ValidatedPortfolioSnapshot = z.infer<typeof portfolioSnapshotSchema>;
