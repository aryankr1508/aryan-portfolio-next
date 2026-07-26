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
      title="Experience and projects"
      description="Manage companies, nested client projects, detailed case studies, freelance work, and the Featured Work order from one place."
    />
  );
}
