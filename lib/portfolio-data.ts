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
  role?: string;
  summary: string;
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
    "I build scalable web applications and backend systems with a strong focus on API design, performance, and reliable product delivery.",
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
  "Build full-stack web, mobile, desktop, and TV applications based on business and platform needs.",
  "Develop data engineering and BI workflows with SQL, Power BI, and automated reporting pipelines.",
  "Own delivery from architecture and implementation to CI/CD, cloud rollout, and production support."
];

export const toolsAndTechnologies = [
  "Backend-first with .NET and C#",
  "Java Spring Boot, Python, and Node.js",
  "REST, GraphQL, SOAP, and FIXML APIs",
  "SQL + NoSQL data platforms",
  "Cloud + CI/CD on Azure, AWS, and GCP",
  "Power BI, Data Engineering, and Analytics"
];

export const quickFacts: Fact[] = [
  { label: "Built Projects", value: "18+ delivered" },
  { label: "Experience", value: "3+ years" },
  { label: "Domains", value: "E-commerce, BI, AI, Collaboration" },
  { label: "Open To", value: "Freelance + Full-time" },
  { label: "Focus", value: "Backend, Cloud, and Data Products" },
  { label: "Core Stack", value: ".NET, Java, Python, Node.js, SQL" },
  { label: "Location", value: "Noida, India" }
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend Engineering",
    description: "Primary strength in building scalable, production-grade backend systems.",
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
    title: "API and Integration",
    description: "End-to-end API design, integration workflows, and protocol interoperability.",
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
  {
    title: "Databases and Data Engineering",
    description: "Relational and NoSQL data systems with modeling and pipeline execution.",
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
    title: "Cloud, DevOps, and CI/CD",
    description: "Cloud deployments and release automation for reliable product operations.",
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
    title: "Frontend and E-commerce",
    description: "Modern frontend systems and e-commerce customization at production scale.",
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
  {
    title: "Mobile and Desktop Apps",
    description: "Cross-platform and native app development for mobile and desktop.",
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
    title: "TV App Frontend",
    description: "Frontend engineering for smart TV platforms and remote-driven interfaces.",
    items: [
      "Roku (BrightScript)",
      "Lightning JS",
      "TV UI Architecture",
      "Remote-first Navigation",
      "Performance-focused Rendering"
    ]
  },
  {
    title: "Data, BI, and Reporting",
    description: "Business intelligence delivery from ingestion to dashboard automation.",
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
    title: "AI and ML",
    description: "Applied machine learning workflows and AI-enabled product capabilities.",
    items: [
      "TensorFlow",
      "Keras",
      "NumPy",
      "Model Training and Evaluation",
      "Inference Integration",
      "AI-assisted Features"
    ]
  }
];

export const freelanceServices: FreelanceService[] = [
  {
    title: "Full Stack Product Development",
    description:
      "Build end-to-end web applications with clean UX, scalable backend APIs, and production-ready deployment.",
    stack: ["React", "Node.js", ".NET", "SQL Server"]
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
        role: ".NET / WPF Engineer",
        summary:
          "Safety-critical desktop platform for monitoring radiological release scenarios and supporting emergency response.",
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
        role: "Full Stack Engineer",
        summary:
          "Customization-heavy e-commerce delivery focused on storefront flexibility and operational workflows.",
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
        role: "Data and BI Engineer",
        summary:
          "Centralized reporting platform combining ad and finance systems into decision-ready dashboards.",
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
        role: "Backend and Full Stack Developer",
        summary:
          "Core enterprise modules for financial workflows, role controls, and tenant-level administration.",
        stack: [".NET", "C#", "MSSQL", "Stored Procedures", "React"],
        highlights: [
          "Implemented APIs and stored procedures for budgeting, chart of accounts, and legal entity workflows.",
          "Built role and permission flows to support secure access across admin surfaces.",
          "Improved operational consistency through centralized business logic and validation."
        ]
      },
      {
        name: "CRM Data Layer on Cosmos DB",
        role: "Data and Integration Engineer",
        summary:
          "Scalable CRM data architecture integrating relational and NoSQL systems for product workflows.",
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
    subtitle: "Realtime Collaboration Editor",
    period: "2019 - Present",
    location: "India",
    description:
      "An online collaborative code editor running on remote infrastructure so teams can write and ship code together in real time.",
    impact:
      "Improved collaborative development flow for distributed users through shared editing and instant updates.",
    resultMetric: "Cut pairing setup time by 40%",
    thumbnail: "/images/projects/syncdev-banner.svg",
    story: {
      problem: "Distributed developers lost time setting up synchronized coding sessions.",
      solution: "Built a browser-based collaborative editor with Socket.IO rooms and live state sync.",
      result: "Teams could jump into shared coding instantly without local environment friction."
    },
    screenshots: [
      "/images/projects/syncdev-screen-1.svg",
      "/images/projects/syncdev-screen-2.svg"
    ],
    architectureDiagram: "/images/projects/syncdev-architecture.svg",
    nextImprovements: [
      "Add CRDT conflict handling for offline edits and reconnect flows.",
      "Ship persistent room analytics to track activity and collaboration health.",
      "Introduce role-based access for enterprise coding sessions."
    ],
    technologies: ["React", "Node.js", "Socket.IO", "JavaScript"],
    liveUrl: "https://syncdev.netlify.app/",
    repoUrl: "https://github.com/aryankr1508/SyncDev.git"
  },
  {
    slug: "placement-roadmap-chatbot",
    title: "Placement Roadmap Chatbot",
    subtitle: "AI Assistant for Placement Queries",
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
