export interface HeroData {
  eyebrow: string;
  headline: string;
  highlightWord: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  org: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface AboutData {
  photoUrl: string;
  cvUrl: string;
  location: string;
  yearsExperience: string;
  bio: string[];
  certifications: Certification[];
  timeline: TimelineEntry[];
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  visible: boolean;
  featured: boolean;
  url: string;
  description: string;
  role: string;
  techStack: string[];
  highlights: string[];
  whatWasBuilt: string;
  stats: ProjectStat[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
}

export interface ServicesData {
  intro: string;
  personal: ServiceItem[];
  nexguild: ServiceItem[];
  ctaBand: {
    heading: string;
    body: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface ContactData {
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  telegram: string;
  upworkUrl: string;
  nexguildAdmin: string;
}

export interface RateTier {
  name: string;
  price: string;
  description: string;
}

export interface RatesData {
  note: string;
  tiers: RateTier[];
}

export interface SeoPageEntry {
  title: string;
  description: string;
}

export interface SeoData {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  twitterHandle: string;
  ga4Id: string;
  gscVerification: string;
  pages: Record<string, SeoPageEntry>;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  category: "AI Building" | "Online Earning" | "Remote Work & Freelancing" | "Web Development With AI";
  excerpt: string;
  tags: string[];
  coverImage: string;
  published?: boolean;
  youtubeId?: string;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}
