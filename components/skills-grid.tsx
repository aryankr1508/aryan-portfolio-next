"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
const DEFAULT_VISIBLE = 4;

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

/* ── Per-card spotlight hook ──────────────────────────────────────────────── */
function useCardSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isInside, setIsInside] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const onEnter = useCallback(() => setIsInside(true), []);
  const onLeave = useCallback(() => {
    setIsInside(false);
    setPos({ x: -1000, y: -1000 });
  }, []);

  return { ref, pos, isInside, onMove, onEnter, onLeave };
}

/* ── Component ────────────────────────────────────────────────────────────── */

interface SkillsGridProps {
  skillGroups: SkillGroup[];
}

export default function SkillsGrid({ skillGroups }: SkillsGridProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [highlightedSkills, setHighlightedSkills] = useState<Set<string>>(
    new Set()
  );
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });

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

  const gridHovered = hoveredCard !== null;

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="skills-grid relative grid gap-3 md:grid-cols-2 xl:grid-cols-3"
    >
      {skillGroups.map((group, index) => (
        <SkillCard
          key={group.title}
          group={group}
          index={index}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          gridHovered={gridHovered}
          highlightedSkills={highlightedSkills}
          hoveredSkill={hoveredSkill}
          handleSkillHover={handleSkillHover}
          handleSkillLeave={handleSkillLeave}
          isTouchDevice={isTouchDevice}
        />
      ))}
    </motion.div>
  );
}

/* ── Individual Skill Card ────────────────────────────────────────────────── */

interface SkillCardProps {
  group: SkillGroup;
  index: number;
  hoveredCard: number | null;
  setHoveredCard: (idx: number | null) => void;
  gridHovered: boolean;
  highlightedSkills: Set<string>;
  hoveredSkill: string | null;
  handleSkillHover: (skill: string) => void;
  handleSkillLeave: () => void;
  isTouchDevice: boolean;
}

function SkillCard({
  group,
  index,
  hoveredCard,
  setHoveredCard,
  gridHovered,
  highlightedSkills,
  hoveredSkill,
  handleSkillHover,
  handleSkillLeave,
  isTouchDevice,
}: SkillCardProps) {
  const spotlight = useCardSpotlight();
  const isExpanded = hoveredCard === index || isTouchDevice;
  const visibleItems = isExpanded
    ? group.items
    : group.items.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = group.items.length - DEFAULT_VISIBLE;
  const hasMore = hiddenCount > 0;
  const isDimmedCard = gridHovered && hoveredCard !== index;

  return (
    <motion.article
      ref={spotlight.ref}
      variants={gridItemVariants}
      onMouseEnter={() => {
        setHoveredCard(index);
        spotlight.onEnter();
      }}
      onMouseLeave={() => {
        setHoveredCard(null);
        spotlight.onLeave();
      }}
      onMouseMove={spotlight.onMove}
      animate={{
        scale: hoveredCard === index ? 1.03 : 1,
        opacity: isDimmedCard ? 0.5 : 1,
      }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="glass-card skill-card surface-panel showcase-card card-skill relative h-full cursor-default px-5 py-4"
    >
      {/* Per-card radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: spotlight.isInside ? 1 : 0,
          background: `radial-gradient(280px circle at ${spotlight.pos.x}px ${spotlight.pos.y}px, rgba(20,184,166,0.12), transparent 40%)`,
        }}
      />

      <h3 className="relative z-[3] font-display text-base font-semibold text-slate-900">
        {group.title}
      </h3>
      <p className="relative z-[3] mt-1 text-xs leading-relaxed text-slate-600">
        {group.description}
      </p>

      <div className="relative z-[3] mt-3 flex flex-wrap gap-1.5">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => {
            const isHighlighted = highlightedSkills.has(item);
            const isDimmedPill =
              hoveredSkill !== null && !isHighlighted;

            return (
              <motion.span
                key={item}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: isDimmedPill ? 0.35 : 1,
                  scale:
                    isHighlighted && hoveredSkill !== null ? 1.06 : 1,
                }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.18,
                  layout: { duration: 0.22 },
                }}
                onMouseEnter={() => handleSkillHover(item)}
                onMouseLeave={handleSkillLeave}
                className={`chip chip-compact cursor-pointer ${
                  isHighlighted && hoveredSkill !== null
                    ? "skill-chip-highlighted"
                    : ""
                }`}
              >
                {item}
              </motion.span>
            );
          })}
        </AnimatePresence>

        {hasMore && !isExpanded && (
          <motion.span
            key="more-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="inline-flex items-center rounded-full border border-dashed border-slate-400 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-500"
          >
            +{hiddenCount} more
          </motion.span>
        )}
      </div>
    </motion.article>
  );
}
