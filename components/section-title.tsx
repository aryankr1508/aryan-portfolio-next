type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="font-display text-xs uppercase tracking-[0.25em] text-sky-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
