import fs from "node:fs";
import path from "node:path";
import type {
  AboutData,
  ContactData,
  HeroData,
  Project,
  RatesData,
  SeoData,
  ServicesData,
  StatItem,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJson<T>(file: string): T {
  const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
  return JSON.parse(raw) as T;
}

export function getHero(): HeroData {
  return readJson<HeroData>("hero.json");
}

export function getAbout(): AboutData {
  return readJson<AboutData>("about.json");
}

export function getProjects(): Project[] {
  return readJson<Project[]>("projects.json");
}

export function getVisibleProjects(): Project[] {
  return getProjects().filter((p) => p.visible);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getServices(): ServicesData {
  return readJson<ServicesData>("services.json");
}

export function getStats(): StatItem[] {
  return readJson<StatItem[]>("stats.json");
}

export function getContact(): ContactData {
  return readJson<ContactData>("contact.json");
}

export function getRates(): RatesData {
  return readJson<RatesData>("rates.json");
}

export function getSeo(): SeoData {
  return readJson<SeoData>("seo.json");
}
