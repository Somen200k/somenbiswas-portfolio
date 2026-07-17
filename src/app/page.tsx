import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { CtaBand } from "@/components/sections/CtaBand";
import { getHero, getProjects, getSeo, getStats } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.home;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: seo.siteUrl },
    openGraph: { title: page.title, description: page.description, url: seo.siteUrl },
  };
}

export default function Home() {
  const hero = getHero();
  const stats = getStats();
  const projects = getProjects();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero data={hero} />
      <StatsBand stats={stats} />
      <FeaturedProjects projects={projects} />
      <SkillsSection />
      <LatestPosts posts={posts} />
      <CtaBand />
    </>
  );
}
