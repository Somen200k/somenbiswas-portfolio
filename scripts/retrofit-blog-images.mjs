// One-time script: adds 2 relevant inline Pexels images to each existing blog post
// that doesn't already have any. Run with: node scripts/retrofit-blog-images.mjs
// Requires PEXELS_API_KEY in .env.local.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const blogDir = path.join(repoRoot, "content", "blog");

function loadEnvLocal() {
  const envPath = path.join(repoRoot, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const CATEGORY_IMAGE_HINTS = {
  "AI Building": ["software developer coding screen", "computer programming technology"],
  "Online Earning": ["online survey laptop money", "person working laptop earning"],
  "Remote Work & Freelancing": ["freelancer working laptop home", "remote work video call"],
  "Web Development With AI": ["web design coding screen", "website development workspace"],
};
const DEFAULT_HINTS = ["technology workspace", "computer screen desk"];

function getImageQueries(category, topic) {
  const [specific, fallback] = CATEGORY_IMAGE_HINTS[category] || DEFAULT_HINTS;
  return [`${topic} ${specific}`.slice(0, 90), fallback];
}

async function searchPexelsPhoto(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) return null;
  return { url: photo.src.large, alt: photo.alt || query };
}

function insertImagesIntoContent(content, images) {
  if (images.length === 0) return content;
  const lines = content.split("\n");
  const h2Indices = [];
  lines.forEach((line, i) => {
    if (/^##\s+/.test(line)) h2Indices.push(i);
  });
  if (h2Indices.length < 2) return content;

  const points =
    images.length === 1
      ? [h2Indices[Math.floor(h2Indices.length / 2)]]
      : [
          h2Indices[Math.floor(h2Indices.length / 3)],
          h2Indices[Math.floor((h2Indices.length * 2) / 3)],
        ];

  const inserts = points
    .map((idx, i) => ({ idx, markdown: `\n![${images[i].alt}](${images[i].url})\n` }))
    .sort((a, b) => b.idx - a.idx);

  for (const { idx, markdown } of inserts) {
    let insertAt = idx + 1;
    if (lines[insertAt] === "") insertAt += 1;
    lines.splice(insertAt, 0, markdown);
  }
  return lines.join("\n");
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const [, frontmatter, body] = match;
  const titleMatch = frontmatter.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
  const categoryMatch = frontmatter.match(/category:\s*"((?:[^"\\]|\\.)*)"/);
  return {
    frontmatter,
    body,
    title: titleMatch ? titleMatch[1] : "",
    category: categoryMatch ? categoryMatch[1] : "",
  };
}

async function main() {
  if (!process.env.PEXELS_API_KEY) {
    console.error("PEXELS_API_KEY is not set in .env.local — aborting.");
    process.exit(1);
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      console.log(`skip (no frontmatter): ${file}`);
      skipped++;
      continue;
    }

    if (/!\[.*\]\(https?:\/\/images\.pexels\.com/.test(parsed.body)) {
      console.log(`skip (already has images): ${file}`);
      skipped++;
      continue;
    }

    const [q1, q2] = getImageQueries(parsed.category, parsed.title);
    const [p1, p2] = await Promise.all([searchPexelsPhoto(q1), searchPexelsPhoto(q2)]);
    const photos = [p1, p2].filter(Boolean);

    if (photos.length === 0) {
      console.log(`skip (no images found): ${file}`);
      skipped++;
      continue;
    }

    const newBody = insertImagesIntoContent(parsed.body, photos);
    if (newBody === parsed.body) {
      console.log(`skip (not enough headings to insert): ${file}`);
      skipped++;
      continue;
    }

    fs.writeFileSync(filePath, `---\n${parsed.frontmatter}\n---\n${newBody}`, "utf-8");
    console.log(`updated (${photos.length} images): ${file}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
}

main();
