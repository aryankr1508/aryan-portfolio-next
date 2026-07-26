import PortfolioPageClient from "@/components/portfolio-page-client";
import { getPublishedPortfolio } from "@/lib/content/repository";

export async function generateMetadata() {
  const { siteCopy } = await getPublishedPortfolio();

  return siteCopy.metadata;
}

export default async function HomePage() {
  const portfolio = await getPublishedPortfolio();

  return <PortfolioPageClient portfolio={portfolio} />;
}
