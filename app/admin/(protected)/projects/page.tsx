import ContentMasterEditor from "@/components/admin/content-master-editor";
import { getPortfolioAdminDocument } from "@/lib/content/repository";
import type { PortfolioSnapshot } from "@/lib/portfolio-data";

const visibleKeys: (keyof PortfolioSnapshot)[] = [
  "experienceItems",
  "projects",
  "freelanceShowcaseProjects",
  "featuredProjectIds"
];

export default async function ProjectMastersPage() {
  const document = await getPortfolioAdminDocument();

  return (
    <ContentMasterEditor
      initialContent={document.draftContent}
      visibleKeys={visibleKeys}
      title="Companies and project masters"
      description="Add or reorder companies, nested company projects, personal case studies, and freelance engagements while preserving the current public project experience."
    />
  );
}
