import platformsData from "../../data/platforms.json";

export interface Platform {
  name: string;
  url?: string;
  youtube?: string;
  telegram?: string;
  tagline: string;
  description: string;
  categories: string[];
}

export const PLATFORMS = platformsData as Record<string, Platform>;

/** The single most relevant sibling platform for a blog category, used for the end-of-post CTA. */
export function getPrimaryPlatform(category: string): Platform | undefined {
  return Object.values(PLATFORMS).find((p) => p.categories.includes(category));
}

/** Secondary platforms worth a natural in-body mention for a category, beyond the primary CTA. */
export function getSecondaryPlatforms(category: string): Platform[] {
  if (category === "AI Building") {
    return [PLATFORMS.portrayalOfTime, PLATFORMS.starscoopdaily].filter(Boolean);
  }
  if (category === "Online Earning") {
    return [PLATFORMS.careerGrowthRemotely].filter(Boolean);
  }
  return [];
}
