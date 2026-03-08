import type { ReactNode } from "react";

type StageSectionTone = "mint" | "sky" | "amber" | "indigo" | "coral";

type StageSectionProps = {
  id: string;
  tone: StageSectionTone;
  containerClass: string;
  children: ReactNode;
  sectionClassName?: string;
  stageClassName?: string;
};

const toneClassMap: Record<StageSectionTone, string> = {
  mint: "section-tone-mint",
  sky: "section-tone-sky",
  amber: "section-tone-amber",
  indigo: "section-tone-indigo",
  coral: "section-tone-coral"
};

export default function StageSection({
  id,
  tone,
  containerClass,
  children,
  sectionClassName = "py-16",
  stageClassName = "space-y-9"
}: StageSectionProps) {
  return (
    <section id={id} className={sectionClassName}>
      <div className={`${containerClass} relative`}>
        <div className={`section-stage ${toneClassMap[tone]} ${stageClassName}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
