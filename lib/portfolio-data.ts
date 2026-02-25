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
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  location: string;
  description: string;
  impact: string;
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

export const personalInfo = {
  name: "Aryan Kumar",
  role: "Software Engineer | Full Stack and Cloud Developer",
  summary:
    "I deliver backend-heavy, data-driven products across .NET, Node.js, SQL, and cloud-ready workflows with a focus on measurable business outcomes.",
  location: "Noida, India",
  email: "aryankumar15082002@gmail.com",
  phone: "+91 8210236605",
  birthday: "15 August 2002",
  degree: "B.Tech, Computer Science Engineering",
  university: "Vellore Institute of Technology",
  resumeFile: "/resume/resume-aryan-kumar.pdf"
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
  "Software Engineer at TechCompiler Data Systems, driving backend modernization and client-facing delivery.",
  "Migrated production workflows from Node.js to .NET and optimized SQL Server queries for high throughput.",
  "Built custom e-commerce solutions for US clients with BigCommerce, Svelte, Handlebars, and Node.js.",
  "Developed Power BI dashboards integrating Windsor.ai APIs, Google Ads, Bing Ads, and Oracle NetSuite.",
  "Available for freelance engineering work in full-stack development, API systems, and reporting automation."
];

export const toolsAndTechnologies = [
  ".NET and C#",
  "Node.js and JavaScript",
  "SQL Server and Cosmos DB",
  "Power BI and Power Query",
  "CI/CD Pipelines",
  "Git and GitHub"
];

export const quickFacts: Fact[] = [
  { label: "Location", value: "Noida, India" },
  { label: "Open To", value: "Freelance + Full-time" },
  { label: "Experience", value: "3+ years" },
  { label: "Focus", value: "Backend and Data Products" },
  { label: "Email", value: "aryankumar15082002@gmail.com" },
  { label: "Phone", value: "+91 8210236605" }
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    description: "Responsive UI development and customization-heavy web experiences.",
    items: ["HTML5", "CSS3", "JavaScript", "React", "Svelte", "Handlebars", "Bootstrap"]
  },
  {
    title: "Backend",
    description: "APIs, server logic, integrations, and performance-first architecture.",
    items: [".NET Core", "C#", "Node.js", "SQL Server", "Cosmos DB", "REST APIs"]
  },
  {
    title: "Data and BI",
    description: "Analytics systems and cross-platform reporting automation.",
    items: ["Power BI", "Power Query (M)", "Windsor.ai APIs", "Google Ads APIs", "Oracle NetSuite"]
  },
  {
    title: "Programming Languages",
    description: "Primary languages used in product engineering and automation.",
    items: ["C#", "JavaScript", "T-SQL", "Java", "Python", "C/C++"]
  },
  {
    title: "Tools and Delivery",
    description: "Release workflows, IDEs, and collaboration tooling.",
    items: ["Git", "GitHub", "Azure DevOps", "VS Code", "Visual Studio", "Power BI Desktop", "PyCharm"]
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
  },
  {
    title: "SurendraNath Centenary School",
    subtitle: "Intermediate",
    duration: "2019",
    details: ["Completed higher secondary education with a technical focus."]
  },
  {
    title: "Delhi Public School",
    subtitle: "Matric",
    duration: "2017",
    details: ["Completed secondary school education."]
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
    technologies: ["JavaScript", "AI Integration", "Web Development"],
    liveUrl: "https://chabot.netlify.app/",
    repoUrl: "https://github.com/aryankr1508/Placement-Roadmap-Chatbot.git"
  },
  {
    slug: "food-scanner",
    title: "Food Scanner",
    subtitle: "Nutrition Analyzer from Image Input",
    period: "Product Build",
    location: "India",
    description:
      "A web app that scans uploaded food images and returns a detailed nutrient profile for each item.",
    impact:
      "Made nutrition insights more accessible with simple image-based interaction.",
    technologies: ["JavaScript", "Image Processing", "Web APIs"],
    liveUrl: "https://foodscanner.netlify.app/",
    repoUrl: "https://github.com/aryankr1508/Food-Scanner/tree/master/Food-Scanner-main"
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
    technologies: ["PHP", "Google Maps API", "Web Development"],
    demoUrl: "https://drive.google.com/file/d/1yT6RG22T6hTi1WiUrIO1LScryOxvs2Ry/view",
    repoUrl: "https://github.com/aryankr1508/TeleMed.git"
  },
  {
    slug: "soyoc-website",
    title: "SOYOC Website",
    subtitle: "Startup Website Development",
    period: "Product Build",
    location: "India",
    description:
      "Built and improved a startup website in collaboration with a teammate using HTML, CSS, JavaScript, and PHP.",
    impact:
      "Delivered a usable online presence for the startup with ongoing UX improvements.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP"],
    liveUrl: "https://soyoc.netlify.app/",
    repoUrl: "https://github.com/aryankr1508/SOYOC"
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
      "Developed the full responsive frontend and converted Figma UI to production-ready code.",
      "Integrated location functionality using PHP and Google APIs, and handled hosting on Hostinger.",
      "Led a team of 8 members during delivery."
    ],
    website: "https://www.cureya.in/"
  },
  {
    company: "PropVIVO",
    role: "Full Stack Developer Intern",
    duration: "March 2023 - August 2023",
    details: [
      "Built .NET APIs and stored procedures for accounting workflows.",
      "Optimized performance, fixed production bugs, and worked with SQL and Cosmos DB.",
      "Developed React.js screens for the Learning Management System."
    ],
    website: "https://propvivo.com/"
  }
];

export const contactAddress =
  "G-632, 1st Avenue, Gaur City 1, Greater Noida West, India";
