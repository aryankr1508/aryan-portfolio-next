"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { SkillGroup } from "@/lib/portfolio-data";

/* ── Skill ecosystem mapping ─────────────────────────────────────────────── */
const ecosystems: Record<string, string[]> = {
  microsoft: [
    ".NET / ASP.NET Core", "C#", "Azure", "SQL Server", "Azure DevOps",
    ".NET Desktop Apps", "WPF", "WinForms", "Power BI", "Power Query (M)",
    "DAX", "Cosmos DB"
  ],
  javascript: [
    "Node.js", "React", "Next.js", "Angular", "Svelte",
    "React Native", "Vanilla JavaScript", "Lightning JS"
  ],
  data: [
    "SQL Server", "MySQL", "PostgreSQL", "MongoDB", "Cosmos DB",
    "Data Modeling", "ETL Pipelines", "Power BI", "Power Query (M)", "DAX",
    "KPI Dashboards", "Business Data Integration", "Reporting Automation"
  ],
  cloud: [
    "Azure", "AWS", "GCP", "CI/CD Pipelines", "Jenkins",
    "Azure DevOps", "Release Automation"
  ],
  python: [
    "Python", "TensorFlow", "Keras", "NumPy",
    "Model Training and Evaluation", "Inference Integration"
  ],
  mobile: [
    "React Native", "Java (Android)", "Kotlin", "Flutter (Dart)",
    ".NET Desktop Apps", "WPF", "WinForms"
  ],
  ecommerce: [
    "BigCommerce", "Shopify", "Svelte", "Handlebars", "Node.js"
  ],
};

function buildRelatedMap(ecosys: Record<string, string[]>): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const members of Object.values(ecosys)) {
    for (const skill of members) {
      if (!map.has(skill)) map.set(skill, new Set<string>());
      for (const sibling of members) {
        if (sibling !== skill) map.get(skill)!.add(sibling);
      }
    }
  }
  return map;
}

const relatedMap = buildRelatedMap(ecosystems);

/* ── Stagger animation variants ──────────────────────────────────────────── */
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Component ────────────────────────────────────────────────────────────── */

interface SkillsGridProps {
  skillGroups: SkillGroup[];
}

export default function SkillsGrid({ skillGroups }: SkillsGridProps) {
  const [highlightedSkills, setHighlightedSkills] = useState<Set<string>>(
    new Set()
  );
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const handleSkillHover = useCallback((skill: string) => {
    setHoveredSkill(skill);
    const related = relatedMap.get(skill);
    if (related) {
      const s = new Set(related);
      s.add(skill);
      setHighlightedSkills(s);
    } else {
      setHighlightedSkills(new Set([skill]));
    }
  }, []);

  const handleSkillLeave = useCallback(() => {
    setHoveredSkill(null);
    setHighlightedSkills(new Set());
  }, []);

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="skills-grid relative grid gap-3 md:grid-cols-2 xl:grid-cols-3"
    >
      {skillGroups.map((group) => (
        <SkillCard
          key={group.title}
          group={group}
          highlightedSkills={highlightedSkills}
          hoveredSkill={hoveredSkill}
          handleSkillHover={handleSkillHover}
          handleSkillLeave={handleSkillLeave}
        />
      ))}
    </motion.div>
  );
}

/* ── Individual Skill Card ────────────────────────────────────────────────── */

interface SkillCardProps {
  group: SkillGroup;
  highlightedSkills: Set<string>;
  hoveredSkill: string | null;
  handleSkillHover: (skill: string) => void;
  handleSkillLeave: () => void;
}

function SkillCard({
  group,
  highlightedSkills,
  hoveredSkill,
  handleSkillHover,
  handleSkillLeave,
}: SkillCardProps) {
  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--skill-spot-x",
      `${event.clientX - bounds.left}px`
    );
    event.currentTarget.style.setProperty(
      "--skill-spot-y",
      `${event.clientY - bounds.top}px`
    );
  };

  return (
    <motion.article
      variants={gridItemVariants}
      onMouseMove={handlePointerMove}
      onMouseLeave={handleSkillLeave}
      className="glass-card skill-card surface-panel showcase-card card-skill relative h-full cursor-default px-5 py-4"
    >
      <div className="skill-card-spotlight pointer-events-none absolute inset-0 z-[2] rounded-[inherit]" />

      <h3 className="relative z-[3] font-display text-base font-semibold text-slate-900">
        {group.title}
      </h3>
      <p className="relative z-[3] mt-1 text-xs leading-relaxed text-slate-600">
        {group.description}
      </p>

      <div className="relative z-[3] mt-3 flex flex-wrap gap-1.5">
        {group.items.map((item) => {
          const isHighlighted = highlightedSkills.has(item);
          const isDimmedPill = hoveredSkill !== null && !isHighlighted;

          return (
            <span
              key={item}
              onMouseEnter={() => handleSkillHover(item)}
              onMouseLeave={handleSkillLeave}
              className={`chip chip-compact cursor-pointer ${
                isHighlighted && hoveredSkill !== null
                  ? "skill-chip-highlighted"
                  : ""
              } ${isDimmedPill ? "opacity-40" : "opacity-100"}`}
            >
              {item}
            </span>
          );
        })}
      </div>
    </motion.article>
  );
}
