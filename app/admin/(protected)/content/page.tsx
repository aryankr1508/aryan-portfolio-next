import ContentMasterEditor from "@/components/admin/content-master-editor";
import { getPortfolioAdminDocument } from "@/lib/content/repository";
import type { PortfolioSnapshot } from "@/lib/portfolio-data";

const visibleKeys: (keyof PortfolioSnapshot)[] = [
  "personalInfo",
  "siteCopy",
  "navItems",
  "socialLinks",
  "aboutHighlights",
  "toolsAndTechnologies",
  "quickFacts",
  "skillGroups",
  "educationItems",
  "internships",
  "contactAddress"
];

export default async function ContentMastersPage() {
  const document = await getPortfolioAdminDocument();

  return (
    <ContentMasterEditor
      initialContent={document.draftContent}
      visibleKeys={visibleKeys}
      title="Site content masters"
      description="Manage profile details, navigation, social links, highlights, skills, education, internships, and contact information. Changes remain private until published."
    />
  );
}
