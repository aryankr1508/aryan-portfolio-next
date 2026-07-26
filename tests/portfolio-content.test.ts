import assert from "node:assert/strict";
import test from "node:test";
import {
  getShowcaseProjects,
  staticPortfolioSnapshot
} from "../lib/portfolio-data";
import { portfolioSnapshotSchema } from "../lib/content/schema";
import { getPublicPortfolioSnapshot } from "../lib/content/visibility";

test("the checked-in fallback is a valid publishable snapshot", () => {
  const result = portfolioSnapshotSchema.safeParse(staticPortfolioSnapshot);

  assert.equal(
    result.success,
    true,
    result.success ? undefined : JSON.stringify(result.error.issues, null, 2)
  );
});

test("showcase generation preserves company, freelance, and personal work", () => {
  const projects = getShowcaseProjects(staticPortfolioSnapshot);
  const categories = new Set(projects.map((project) => project.category));

  assert.equal(projects.length, 11);
  assert.deepEqual(
    [...categories].sort(),
    ["company", "freelance", "personal"]
  );
  assert.equal(
    projects.find((project) => project.id === "telemed")?.category,
    "freelance"
  );
  assert.equal(
    projects.some((project) => project.id === "placement-roadmap-chatbot"),
    false
  );
});

test("all featured project IDs resolve to generated showcase entries", () => {
  const showcaseIds = new Set(
    getShowcaseProjects(staticPortfolioSnapshot).map((project) => project.id)
  );

  for (const featuredId of staticPortfolioSnapshot.featuredProjectIds) {
    assert.equal(showcaseIds.has(featuredId), true, featuredId);
  }
});

test("duplicate slugs and unknown featured IDs are rejected", () => {
  const invalidSnapshot = structuredClone(staticPortfolioSnapshot);
  invalidSnapshot.projects[1].slug = invalidSnapshot.projects[0].slug;
  invalidSnapshot.featuredProjectIds.push("missing-project");

  const result = portfolioSnapshotSchema.safeParse(invalidSnapshot);
  assert.equal(result.success, false);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    assert.equal(
      messages.some((message) => message.includes("Duplicate project slug")),
      true
    );
    assert.equal(
      messages.some((message) => message.includes("Unknown featured project ID")),
      true
    );
  }
});

test("media fields accept local public paths and HTTPS Blob URLs", () => {
  const snapshot = structuredClone(staticPortfolioSnapshot);
  snapshot.personalInfo.profileImage =
    "https://example.public.blob.vercel-storage.com/profile/image.webp";
  snapshot.personalInfo.resumeFile =
    "https://example.public.blob.vercel-storage.com/resume/latest.pdf";

  assert.equal(portfolioSnapshotSchema.safeParse(snapshot).success, true);
});

test("visibility defaults existing records to active", () => {
  const snapshot = structuredClone(staticPortfolioSnapshot);
  delete snapshot.projects[0].isActive;
  delete snapshot.experienceItems[0].isActive;
  delete snapshot.experienceItems[0].companyProjects?.[0].isActive;

  const parsed = portfolioSnapshotSchema.parse(snapshot);

  assert.equal(parsed.projects[0].isActive, true);
  assert.equal(parsed.experienceItems[0].isActive, true);
  assert.equal(
    parsed.experienceItems[0].companyProjects?.[0].isActive,
    true
  );
});

test("inactive content stays in the master snapshot but is removed publicly", () => {
  const snapshot = structuredClone(staticPortfolioSnapshot);
  const syncDev = snapshot.projects.find(
    (project) => project.slug === "syncdev"
  );
  const techCompiler = snapshot.experienceItems.find((experience) =>
    experience.title.startsWith("TechCompiler")
  );

  assert.ok(syncDev);
  assert.ok(techCompiler);
  syncDev.isActive = false;
  techCompiler.isActive = false;

  const publicSnapshot = getPublicPortfolioSnapshot(snapshot);
  const publicShowcase = getShowcaseProjects(publicSnapshot);

  assert.equal(
    snapshot.projects.some(
      (project) => project.slug === "placement-roadmap-chatbot"
    ),
    true
  );
  assert.equal(
    publicSnapshot.projects.some(
      (project) => project.slug === "placement-roadmap-chatbot"
    ),
    false
  );
  assert.equal(
    publicSnapshot.projects.some((project) => project.slug === "syncdev"),
    false
  );
  assert.equal(
    publicSnapshot.featuredProjectIds.includes("syncdev"),
    false
  );
  assert.equal(
    publicSnapshot.experienceItems.some((experience) =>
      experience.title.startsWith("TechCompiler")
    ),
    false
  );
  assert.equal(
    publicShowcase.some(
      (project) => project.id === "multi-cloud-draas-platform-for-airtel"
    ),
    false
  );
});
