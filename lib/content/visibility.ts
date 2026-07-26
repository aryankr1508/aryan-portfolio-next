import {
  getShowcaseProjects,
  type PortfolioSnapshot
} from "@/lib/portfolio-data";

type Activatable = {
  isActive?: boolean;
};

export function isPubliclyActive(item: Activatable) {
  return item.isActive !== false;
}

/**
 * Keeps visibility policy at the server content boundary. Admin reads use the
 * unfiltered document, while every public route receives this projection.
 */
export function getPublicPortfolioSnapshot(
  source: PortfolioSnapshot
): PortfolioSnapshot {
  const visibleSnapshot: PortfolioSnapshot = {
    ...source,
    experienceItems: source.experienceItems
      .filter(isPubliclyActive)
      .map((experience) => ({
        ...experience,
        companyProjects: experience.companyProjects?.filter(isPubliclyActive)
      })),
    educationItems: source.educationItems.filter(isPubliclyActive),
    projects: source.projects.filter(isPubliclyActive),
    internships: source.internships.filter(isPubliclyActive),
    freelanceShowcaseProjects:
      source.freelanceShowcaseProjects.filter(isPubliclyActive)
  };
  const visibleShowcaseIds = new Set(
    getShowcaseProjects(visibleSnapshot).map((project) => project.id)
  );

  return {
    ...visibleSnapshot,
    featuredProjectIds: source.featuredProjectIds.filter((id) =>
      visibleShowcaseIds.has(id)
    )
  };
}
