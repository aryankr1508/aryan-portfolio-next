export type NavItem = {
  id: string;
  label: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export type ResumeItem = {
  title: string;
  subtitle: string;
  duration: string;
  details: string[];
  companyProjects?: ExperienceProject[];
};

export type ExperienceProject = {
  name: string;
  shortTitle?: string;
  subtitle?: string;
  role?: string;
  summary: string;
  challenge?: string;
  outcome?: string;
  stack: string[];
  highlights: string[];
  confidentialityNote?: string;
  link?: {
    label: string;
    url: string;
  };
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  period: string;
  location: string;
  description: string;
  impact: string;
  resultMetric: string;
  thumbnail: string;
  story: {
    problem: string;
    solution: string;
    result: string;
  };
  highlights: string[];
  screenshots: string[];
  architectureDiagram: string;
  nextImprovements: string[];
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
};

export type Internship = {
  company: string;
  role: string;
  duration: string;
  details: string[];
  website: string;
};

export type FreelanceService = {
  title: string;
  description: string;
  stack: string[];
};

export type GraphMetric = {
  label: string;
  value: number;
  suffix?: string;
  description: string;
  color: string;
};

export const personalInfo = {
  name: "Aryan Kumar",
  role: "Software Engineer",
  summary:
    "I build scalable product systems across web, mobile, desktop, LMS, backend, data, and AI-agent workflows with a strong focus on API design, performance, and reliable delivery.",
  location: "Noida, India",
  email: "aryankumar15082002@gmail.com",
  phone: "+91 8210236605",
  calendlyUrl: "https://calendly.com/aryankumar15082002/30min",
  degree: "B.Tech, Computer Science Engineering",
  university: "Vellore Institute of Technology",
  resumeFile: "/resume/Aryan_Kumar_Resume.pdf"
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "internships", label: "Internships" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" }
];

export const socialLinks = [
  { label: "GitHub", url: "https://github.com/aryankr1508" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/aryankr1508/" },
  { label: "Instagram", url: "https://www.instagram.com/aryankr1508/" },
  { label: "Twitter", url: "https://twitter.com/aryankr1508" },
  { label: "Facebook", url: "https://www.facebook.com/aryankr1508" }
];

export const aboutHighlights = [
  "Lead backend-first product delivery across .NET, Java Spring Boot, Python, and Node.js services.",
  "Design and ship REST, GraphQL, SOAP, and integration-heavy APIs for production systems.",
  "Build full-stack web, mobile, desktop, LMS, and TV applications based on business and platform needs.",
  "Work on custom MCP connectors, agentic workflows, and OpenCLAW-style automation systems.",
  "Develop data engineering and BI workflows with SQL, Power BI, and automated reporting pipelines.",
  "Own delivery from architecture and implementation to CI/CD, cloud rollout, and production support."
];

export const toolsAndTechnologies = [
  "Backend-first with .NET and C#",
  "Java Spring Boot, Python, and Node.js",
  "REST, GraphQL, SOAP, and FIXML APIs",
  "SQL + NoSQL data platforms",
  "MCP Connectors and Agentic Workflows",
  "Cloud + CI/CD on Azure, AWS, and GCP",
  "Power BI, Data Engineering, and Analytics"
];

export const quickFacts: Fact[] = [
  { label: "Built Projects", value: "18+ delivered" },
  { label: "Experience", value: "3+ years" },
  { label: "Domains", value: "E-commerce, BI, AI, Collaboration" },
  { label: "Open To", value: "Freelance + Full-time" },
  { label: "Focus", value: "Product Systems, APIs, AI, and Data" },
  { label: "Core Stack", value: ".NET, Java, Python, Node.js, SQL" },
  { label: "Location", value: "Noida, India" }
];

export const skillGroups: SkillGroup[] = [
  /* ── Row 1: Core Identity ─────────────────────────────────────────────── */
  {
    title: "Backend Engineering",
    description: "Scalable, production-grade backend systems.",
    items: [
      ".NET / ASP.NET Core",
      "C#",
      "Java + Spring Boot",
      "Python",
      "Node.js",
      "Microservices and Service Design",
      "Performance Tuning"
    ]
  },
  {
    title: "Databases and Data Engineering",
    description: "Relational and NoSQL data systems with modeling and pipelines.",
    items: [
      "SQL Server",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Cosmos DB",
      "Data Modeling",
      "ETL Pipelines"
    ]
  },
  {
    title: "API and Integration",
    description: "End-to-end API design, integration workflows, and protocols.",
    items: [
      "REST APIs",
      "GraphQL",
      "SOAP",
      "FIXML",
      "Webhook Integrations",
      "Auth (JWT/OAuth)",
      "OpenAPI / Swagger"
    ]
  },
  /* ── Row 2: Differentiators ───────────────────────────────────────────── */
  {
    title: "Cloud, DevOps, and CI/CD",
    description: "Cloud deployments and release automation for reliable operations.",
    items: [
      "Azure",
      "AWS",
      "GCP",
      "Jenkins",
      "Azure DevOps",
      "CI/CD Pipelines",
      "Release Automation"
    ]
  },
  {
    title: "Data, BI, and Reporting",
    description: "Business intelligence from ingestion to dashboard automation.",
    items: [
      "Power BI",
      "Power Query (M)",
      "DAX",
      "Reporting Automation",
      "Business Data Integration",
      "KPI Dashboards"
    ]
  },
  {
    title: "Frontend and E-commerce",
    description: "Modern frontend systems and e-commerce at production scale.",
    items: [
      "React",
      "Next.js",
      "Angular",
      "Svelte",
      "Handlebars",
      "BigCommerce",
      "Shopify",
      "Vanilla JavaScript"
    ]
  },
  /* ── Row 3: Extras / Niche ────────────────────────────────────────────── */
  {
    title: "Mobile and Desktop Apps",
    description: "Cross-platform and native app development.",
    items: [
      "React Native",
      "Java (Android)",
      "Kotlin",
      "Flutter (Dart)",
      ".NET Desktop Apps",
      "WPF",
      "WinForms"
    ]
  },
  {
    title: "AI and ML",
    description: "Applied AI, ML, and agent-enabled product capabilities.",
    items: [
      "TensorFlow",
      "Keras",
      "NumPy",
      "Model Training and Evaluation",
      "Inference Integration",
      "AI-assisted Features",
      "Agentic Workflows",
      "Custom MCP Connectors",
      "OpenCLAW Automation"
    ]
  },
  {
    title: "TV App Frontend",
    description: "Smart TV platforms and remote-driven interfaces.",
    items: [
      "Roku (BrightScript)",
      "Lightning JS",
      "TV UI Architecture",
      "Remote-first Navigation",
      "Performance-focused Rendering"
    ]
  }
];

export const freelanceServices: FreelanceService[] = [
  {
    title: "Full Stack Product Development",
    description:
      "Build end-to-end product systems across web, mobile, desktop, LMS, and backend platforms with clean UX, scalable APIs, and production-ready deployment.",
    stack: ["React", "React Native", ".NET", "Node.js", "SQL Server"]
  },
  {
    title: "Backend and API Engineering",
    description:
      "Design robust APIs, optimize existing backend performance, and modernize legacy codebases for scale.",
    stack: [".NET Core", "C#", "REST APIs", "Cosmos DB"]
  },
  {
    title: "E-commerce Customization",
    description:
      "Deliver custom storefront and workflow enhancements on platforms like BigCommerce.",
    stack: ["BigCommerce", "Svelte", "Handlebars", "Node.js"]
  },
  {
    title: "Power BI Reporting Automation",
    description:
      "Connect business sources and automate dashboards, reports, and scorecards for decision-making.",
    stack: ["Power BI", "Power Query", "API Integrations", "Data Modeling"]
  },
  {
    title: "AI Agents and MCP Connectors",
    description:
      "Create custom MCP connectors, agentic workflows, and automation layers that connect tools, data, and business processes.",
    stack: ["MCP", "OpenCLAW", "Python", "Node.js", "API Integrations"]
  }
];

export const experienceItems: ResumeItem[] = [
  {
    title: "TechCompiler Data Systems (CMMi Level 3)",
    subtitle: "Software Engineer | Full-time | Noida, Uttar Pradesh, India (On-site)",
    duration: "May 2024 - Present",
    details: [
      "Migrated a product tool from Node.js to .NET, improving performance and optimizing SQL Server queries while leading client interactions.",
      "Developed and maintained projects for a US-based e-commerce client, enabling full customization in BigCommerce with Svelte, Handlebars, and Node.js.",
      "Implemented CI/CD pipelines for .NET and Node.js applications to streamline deployments.",
      "Built dynamic dashboards and scorecards in Power BI by integrating Windsor.ai APIs, Google Ads, Bing Ads, and Oracle NetSuite.",
      "Developed Power Query (M) scripts and Advanced Editor business logic for automated reporting and insights."
    ],
    companyProjects: [
      {
        name: "MIDAS - Nuclear Safety Plume Monitoring System",
        shortTitle: "MIDAS",
        subtitle: "Nuclear Safety Plume Monitoring System",
        role: ".NET / WPF Engineer",
        summary:
          "Safety-critical desktop platform for monitoring radiological release scenarios and supporting emergency response.",
        challenge:
          "Operators needed to combine live effluent and weather signals, calculate plume dispersion, and alert affected zones quickly within a safety-regulated workflow.",
        outcome:
          "Enabled continuous release monitoring, mapped impact projections, faster regional alerting, and repeatable operator training simulations in one desktop system.",
        stack: [".NET 9", "C#", "WPF", "SQL Server", "GIS Mapping"],
        highlights: [
          "Integrated live input streams from effluent monitors and meteorological towers for continuous monitoring.",
          "Implemented Gaussian plume calculations to project dispersal impact zones directly on operational maps.",
          "Built alert logic to notify affected regions during accidental release events for faster response.",
          "Added manual release simulation and operator training workflows for drill and readiness exercises.",
          "Implemented protocol validation checks aligned with plant operating and safety standards."
        ],
        confidentialityNote:
          "Delivered in a regulated enterprise environment; source code and internal visuals are confidential."
      },
      {
        name: "BigCommerce Customization Program (US Client)",
        shortTitle: "BigCommerce Customization Program",
        subtitle: "Custom storefront and operations delivery for a US client",
        role: "Full Stack Engineer",
        summary:
          "Customization-heavy e-commerce delivery focused on storefront flexibility and operational workflows.",
        challenge:
          "The storefront required recurring client-specific features and workflow changes without turning each request into brittle, one-off implementation logic.",
        outcome:
          "Created modular customization patterns that improved maintainability and shortened turnaround for recurring storefront requests.",
        stack: ["Node.js", "Svelte", "Handlebars", "BigCommerce APIs"],
        highlights: [
          "Developed and maintained modular storefront components and custom business workflows.",
          "Integrated backend services with platform APIs for product, order, and content operations.",
          "Improved maintainability and turnaround speed for recurring client customization requests."
        ],
        confidentialityNote:
          "Client-specific business logic and implementation artifacts are under NDA."
      },
      {
        name: "Marketing and Finance BI Automation",
        subtitle: "Unified campaign and finance reporting",
        role: "Data and BI Engineer",
        summary:
          "Centralized reporting platform combining ad and finance systems into decision-ready dashboards.",
        challenge:
          "Marketing and finance data lived across advertising platforms, APIs, and NetSuite, making recurring KPI reporting manual and inconsistent.",
        outcome:
          "Centralized campaign and finance KPIs, standardized transformation logic, and reduced recurring reporting work through scheduled refreshes.",
        stack: ["Power BI", "Power Query (M)", "Windsor.ai API", "NetSuite", "SQL"],
        highlights: [
          "Built reusable ingestion and transformation flows across multiple external data sources.",
          "Developed KPI dashboards and scorecards for campaign and finance performance visibility.",
          "Reduced manual reporting effort through scheduled refresh and standardized data models."
        ]
      }
    ]
  },
  {
    title: "PropVIVO",
    subtitle: "Full Stack Developer | Full-time | Surat, Gujarat, India (On-site)",
    duration: "September 2023 - May 2024",
    details: [
      "Led development and enhancement of the PropVivo Portal by integrating Accounting and Super Admin modules.",
      "Developed APIs and stored procedures for budgeting, chart of accounts, financial operations, legal entities, roles, and permissions.",
      "Implemented login and registration APIs for seamless user navigation.",
      "Integrated user functionality across MSSQL and Cosmos DB and deployed CRM workflows in Cosmos DB for scalability.",
      "Ensured data security and integrity while improving operational efficiency."
    ],
    companyProjects: [
      {
        name: "Accounting and Super Admin Platform",
        subtitle: "Financial workflows and tenant administration",
        role: "Backend and Full Stack Developer",
        summary:
          "Core enterprise modules for financial workflows, role controls, and tenant-level administration.",
        challenge:
          "Budgeting, chart-of-accounts, legal-entity, role, and permission workflows needed secure, centralized business logic across the administration platform.",
        outcome:
          "Consolidated financial and tenant administration behind validated APIs and stored procedures, improving workflow consistency and access control.",
        stack: [".NET", "C#", "MSSQL", "Stored Procedures", "React"],
        highlights: [
          "Implemented APIs and stored procedures for budgeting, chart of accounts, and legal entity workflows.",
          "Built role and permission flows to support secure access across admin surfaces.",
          "Improved operational consistency through centralized business logic and validation."
        ]
      },
      {
        name: "CRM Data Layer on Cosmos DB",
        subtitle: "Relational and NoSQL CRM integration",
        role: "Data and Integration Engineer",
        summary:
          "Scalable CRM data architecture integrating relational and NoSQL systems for product workflows.",
        challenge:
          "CRM workflows had to span relational MSSQL data and scalable Cosmos DB documents without compromising production reliability or data integrity.",
        outcome:
          "Delivered reliable cross-database workflows with a scalable Cosmos DB layer and consistent integration paths for CRM operations.",
        stack: ["Cosmos DB", "MSSQL", ".NET APIs"],
        highlights: [
          "Designed and integrated cross-database data flows between MSSQL and Cosmos DB.",
          "Delivered scalable document-based CRM workflows for high-volume operations.",
          "Focused on reliability, data integrity, and production issue resolution."
        ]
      }
    ]
  }
];

export const educationItems: ResumeItem[] = [
  {
    title: "Vellore Institute of Technology",
    subtitle: "B.Tech in Computer Science Engineering",
    duration: "2019 - 2023",
    details: [
      "Built a strong foundation in algorithms, software systems, and application development."
    ]
  }
];

export const projects: Project[] = [
  {
    slug: "syncdev",
    title: "SyncDev",
    subtitle: "Real-Time Collaborative Code Workspace",
    role: "Creator & Full Stack Developer",
    period: "2023 - Present",
    location: "India",
    description:
      "A browser-based coding workspace where developers create or join shareable rooms, edit code together, see participant presence, and run or preview code without configuring a local project.",
    impact:
      "Delivered a production-ready collaboration flow with automatic reconnects, 25 editor language modes, persisted editor preferences, sandboxed web previews, in-browser JavaScript execution, and ephemeral room cleanup.",
    resultMetric: "25 editor language modes",
    thumbnail: "/images/projects/syncdev-banner.svg",
    story: {
      problem: "Pair-programming sessions often require repository access, matching local environments, and a separate tool just to share code and confirm who is present.",
      solution: "Built UUID-based rooms with live code and presence sync, a CodeMirror editing experience, automatic language detection, execution output, and sandboxed previews. Socket.IO powers local or Node deployments, while Vercel Functions and Supabase provide production polling, heartbeats, debounced writes, and room-state persistence.",
      result: "A shareable browser workspace that supports 25 language modes, remembers each user’s editor setup, reconnects automatically, and removes stale participants and abandoned room code."
    },
    highlights: [
      "Built UUID-based rooms with synchronized code, participant presence, and automatic reconnect handling.",
      "Designed a transport layer that uses Socket.IO for Node deployments and a Vercel Functions API backed by Supabase in production.",
      "Added automatic detection and syntax tooling across 25 editor language modes with persisted preferences.",
      "Implemented sandboxed web previews, in-browser JavaScript execution, validation, and an extensible remote execution proxy."
    ],
    screenshots: [
      "/images/projects/syncdev-screen-1.svg",
      "/images/projects/syncdev-screen-2.svg"
    ],
    architectureDiagram: "/images/projects/syncdev-architecture.svg",
    nextImprovements: [
      "Add CRDT conflict handling for offline edits and reconnect flows.",
      "Connect the validated execution proxy to an isolated compiler provider for more server-side runtimes.",
      "Add optional authenticated, persistent projects with room roles and access controls."
    ],
    technologies: [
      "React",
      "CodeMirror",
      "Tailwind CSS",
      "Socket.IO",
      "Express",
      "Vercel Functions",
      "Supabase"
    ],
    liveUrl: "https://syncdev-editor.vercel.app/",
    repoUrl: "https://github.com/aryankr1508/SyncDev.git"
  },
  {
    slug: "placement-roadmap-chatbot",
    title: "Placement Roadmap Chatbot",
    subtitle: "AI Assistant for Placement Queries",
    role: "AI Developer · Team of 3",
    period: "Team Project",
    location: "India",
    description:
      "A one-stop assistant for placement-related guidance where I contributed as an AI developer in a team of three.",
    impact:
      "Streamlined frequently asked placement questions into a single conversational assistant.",
    resultMetric: "Handled 300+ common query flows",
    thumbnail: "/images/projects/placement-banner.svg",
    story: {
      problem: "Students needed quick answers but were relying on scattered documents and informal chats.",
      solution: "Created an AI-backed chatbot that maps placement questions to structured guidance.",
      result: "Users got immediate, consistent answers without waiting for mentor availability."
    },
    highlights: [
      "Mapped recurring placement questions into structured conversational guidance.",
      "Implemented the AI-backed response flow and intent handling as part of a three-person team.",
      "Created a single self-service interface for common placement roadmap queries."
    ],
    screenshots: [
      "/images/projects/placement-screen-1.svg",
      "/images/projects/placement-screen-2.svg"
    ],
    architectureDiagram: "/images/projects/placement-architecture.svg",
    nextImprovements: [
      "Add retrieval-augmented generation from verified placement policy docs.",
      "Build multilingual response support for wider accessibility.",
      "Track unresolved question intents to continuously improve answer quality."
    ],
    technologies: ["JavaScript", "AI Integration", "Web Development"],
    liveUrl: "https://chabot.netlify.app/",
    repoUrl: "https://github.com/aryankr1508/Placement-Roadmap-Chatbot.git"
  },
  {
    slug: "telemed",
    title: "TeleMed",
    subtitle: "Medicine Delivery Application",
    role: "Full Stack Developer",
    period: "Product Build",
    location: "India",
    description:
      "A medicine delivery app with product data from a PHP backend and delivery-location support through Google Maps APIs.",
    impact:
      "Connected medicine inventory, user ordering, and map-based delivery in one workflow.",
    resultMetric: "Reduced order confirmation lag by 35%",
    thumbnail: "/images/projects/telemed-banner.svg",
    story: {
      problem: "Users had no simple workflow to discover medicines and verify delivery feasibility.",
      solution: "Built a location-aware ordering app integrating inventory data with Maps APIs.",
      result: "Customers could place map-validated medicine orders through a single flow."
    },
    highlights: [
      "Connected medicine inventory from a PHP backend to the customer ordering experience.",
      "Integrated Google Maps APIs for delivery-location validation.",
      "Combined product discovery, ordering, and delivery feasibility in one workflow."
    ],
    screenshots: ["/images/projects/telemed-screen-1.svg", "/images/projects/telemed-screen-2.svg"],
    architectureDiagram: "/images/projects/telemed-architecture.svg",
    nextImprovements: [
      "Add real-time pharmacy stock sync to prevent out-of-stock checkout failures.",
      "Introduce delivery ETA prediction based on historical route data.",
      "Implement prescription upload OCR with verification checks."
    ],
    technologies: ["PHP", "Google Maps API", "Web Development"],
    demoUrl: "https://drive.google.com/file/d/1yT6RG22T6hTi1WiUrIO1LScryOxvs2Ry/view",
    repoUrl: "https://github.com/aryankr1508/TeleMed.git"
  },
  {
    slug: "alexa-skills",
    title: "Alexa Skills",
    subtitle: "Voice-Driven Automation Skills",
    role: "Creator & Developer",
    period: "Voice Platform Builds",
    location: "Amazon.in",
    description:
      "Created seven Alexa skills, with four published, powered by Python, Node.js, and JSON-based intent handling.",
    impact:
      "Converted functional workflows into voice-command experiences on a production platform.",
    resultMetric: "4 skills published on Amazon Alexa",
    thumbnail: "/images/projects/alexa-banner.svg",
    story: {
      problem: "Routine digital actions were still dependent on manual taps and repetitive navigation.",
      solution: "Developed and published voice-triggered Alexa skills with robust intent mapping.",
      result: "Core user actions were automated through natural voice commands."
    },
    highlights: [
      "Designed JSON intent models and voice interaction flows for seven Alexa skills.",
      "Implemented skill logic with Python and Node.js.",
      "Published four skills to the Amazon Alexa platform."
    ],
    screenshots: ["/images/projects/alexa-screen-1.svg", "/images/projects/alexa-screen-2.svg"],
    architectureDiagram: "/images/projects/alexa-architecture.svg",
    nextImprovements: [
      "Expand skill analytics to monitor drop-offs across intent journeys.",
      "Add account linking and secure personalization for contextual responses.",
      "Improve fallback prompts with adaptive disambiguation logic."
    ],
    technologies: ["Python", "Node.js", "JSON", "Alexa Skill Kit"],
    repoUrl: "https://github.com/aryankr1508/Alexa-Skill"
  }
];

export const internships: Internship[] = [
  {
    company: "CUREYA",
    role: "Full Stack Web Developer Intern",
    duration: "April 2022 - June 2022",
    details: [
      "Led a team of 8 developers and coordinated delivery milestones.",
      "Converted Figma designs into responsive production-ready frontend screens.",
      "Integrated PHP + Google Maps APIs and managed deployment on Hostinger."
    ],
    website: "https://www.cureya.in/"
  },
  {
    company: "PropVIVO",
    role: "Full Stack Developer Intern",
    duration: "March 2023 - August 2023",
    details: [
      "Built .NET APIs and stored procedures for accounting and admin workflows.",
      "Integrated MSSQL and Cosmos DB flows while fixing production issues.",
      "Shipped React LMS modules and improved release stability."
    ],
    website: "https://propvivo.com/"
  }
];

export const contactAddress =
  "G-632, 1st Avenue, Gaur City 1, Greater Noida West, India";

/* ── Enterprise project helpers ──────────────────────────────────────────── */

export type EnterpriseProjectCard = ExperienceProject & {
  id: string;
  company: string;
  companyDuration: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getEnterpriseProjects(): EnterpriseProjectCard[] {
  const result: EnterpriseProjectCard[] = [];
  for (const exp of experienceItems) {
    if (!exp.companyProjects?.length) continue;
    for (const project of exp.companyProjects) {
      result.push({
        ...project,
        id: slugify(project.name),
        company: exp.title,
        companyDuration: exp.duration,
      });
    }
  }
  return result;
}

/* ── Showcase projects (unified master-detail data) ────────────────────── */

export type ShowcaseProject = {
  id: string;
  title: string;
  subtitle: string;
  category: "company" | "freelance" | "personal";
  year: string;
  company?: string;
  role: string;
  engagement: string;
  status: string;
  overview: string;
  challenge: string;
  contributions: string[];
  outcome: string;
  techStack: string[];
  confidential: boolean;
  caseStudyUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  liveLabel?: string;
};

const freelanceShowcaseProjects: ShowcaseProject[] = [
  {
    id: "zenought-renewables",
    title: "Zenought Renewables",
    subtitle: "Renewable-energy EPC marketing and enquiry platform",
    category: "freelance",
    year: "2026",
    company: "Zenought Renewables Pvt. Ltd.",
    role: "Freelance Full Stack Developer",
    engagement: "Freelance client project",
    status: "Production-ready",
    overview:
      "A responsive marketing and enquiry platform for a renewable-energy EPC business, presenting solar, infrastructure, O&M, fabrication, CBG, and organic-fertilizer services.",
    challenge:
      "The client needed a credible digital presence that could make a broad, technical EPC offering easy to understand for commercial and industrial audiences while providing a clear path to start an enquiry.",
    contributions: [
      "Built a responsive, multi-page Next.js marketing site with reusable content and components for services, industries, projects, leadership, news, and contact.",
      "Implemented the contact and enquiry flow with a NestJS API, validated request DTOs, and PostgreSQL persistence through TypeORM.",
      "Structured the monorepo for dependable development and release workflows with Turborepo, pnpm workspaces, Docker Compose, Vercel deployments, and GitHub Actions CI/CD."
    ],
    outcome:
      "Delivered a maintainable web and API foundation that supports the company’s marketing presence and routes prospective customer enquiries into a structured backend workflow.",
    techStack: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "NestJS",
      "TypeORM",
      "PostgreSQL",
      "Turborepo",
      "Docker",
      "Vercel",
      "GitHub Actions"
    ],
    confidential: false,
    githubUrl: "https://github.com/aryankr1508/Zenought",
    liveUrl: "https://zenought.com",
    liveLabel: "Visit production site"
  }
];

const freelanceProjectSlugs = new Set(["telemed"]);

export function getShowcaseProjects(): ShowcaseProject[] {
  const showcase: ShowcaseProject[] = [];

  // Company projects from full-time experience
  for (const exp of experienceItems) {
    if (!exp.companyProjects?.length) continue;
    const yearMatch = exp.duration.match(/\d{4}/);
    const company = exp.title.replace(/\s*\([^)]*\)\s*$/, "");
    for (const p of exp.companyProjects) {
      showcase.push({
        id: slugify(p.name),
        title: p.shortTitle ?? p.name,
        subtitle: p.subtitle ?? p.summary,
        category: "company",
        year: yearMatch?.[0] ?? "",
        company,
        role: p.role ?? "Software Engineer",
        engagement: "Full-time company",
        status: p.confidentialityNote ? "Confidential" : "Delivered",
        overview: p.summary,
        challenge: p.challenge ?? p.summary,
        contributions: p.highlights,
        outcome: p.outcome ?? p.highlights.at(-1) ?? p.summary,
        techStack: p.stack,
        confidential: !!p.confidentialityNote,
      });
    }
  }

  // Personal / independent projects
  for (const p of projects) {
    const yearMatch = p.period.match(/\d{4}/);
    const isFreelance = freelanceProjectSlugs.has(p.slug);
    showcase.push({
      id: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: isFreelance ? "freelance" : "personal",
      year: yearMatch?.[0] ?? p.period,
      role: p.role,
      engagement: isFreelance
        ? "Freelance client project"
        : p.period.toLowerCase().includes("team")
          ? "Team project"
          : "Independent build",
      status: p.period.toLowerCase().includes("present")
        ? "Active"
        : p.liveUrl
          ? "Live"
          : p.demoUrl
            ? "Demo available"
            : "Open source",
      overview: p.description,
      challenge: p.story.problem,
      contributions: p.highlights,
      outcome: p.impact,
      techStack: p.technologies,
      confidential: false,
      caseStudyUrl: `/projects/${p.slug}`,
      githubUrl: p.repoUrl,
      liveUrl: p.liveUrl ?? p.demoUrl,
      liveLabel: p.liveUrl ? "Live Demo" : p.demoUrl ? "Demo Video" : undefined,
    });
  }

  showcase.push(...freelanceShowcaseProjects);

  return showcase;
}
