export type PrepQuestion = {
  question: string;
  answer: string;
};

export type PrepSection = {
  label: string;
  questions: PrepQuestion[];
};

export type PrepCategory = {
  name: string;
  color: string;
  bg: string;
  icon: string;
  description: string;
  sections: PrepSection[];
};

type AnswerOptions = {
  quick?: string;
  idea: string;
  example?: string;
  details?: string;
  code?: string;
  language?: string;
  interview: string;
  trap?: string;
};

export function humanAnswer({
  quick,
  idea,
  example,
  details,
  code,
  language = "java",
  interview,
  trap,
}: AnswerOptions): string {
  const parts = [
    quick ? `### Quick answer\n\n${quick}` : "",
    `### Understand it\n\n${idea}`,
    example ? `### Picture it\n\n${example}` : "",
    details ? `### Go one level deeper\n\n${details}` : "",
    code ? `\`\`\`${language}\n${code.trim()}\n\`\`\`` : "",
    `### Say it in the interview\n\n> ${interview}`,
    trap ? `### Easy mistake to avoid\n\n${trap}` : "",
  ];

  return parts.filter(Boolean).join("\n\n");
}

export function q(
  question: string,
  idea: string,
  interview: string,
  options: Omit<AnswerOptions, "idea" | "interview"> = {},
): PrepQuestion {
  return {
    question,
    answer: humanAnswer({ idea, interview, ...options }),
  };
}
