const CATEGORY_IMAGE_HINTS: Record<string, [string, string]> = {
  "AI Building": ["software developer coding screen", "computer programming technology"],
  "Online Earning": ["online survey laptop money", "person working laptop earning"],
  "Remote Work & Freelancing": ["freelancer working laptop home", "remote work video call"],
  "Web Development With AI": ["web design coding screen", "website development workspace"],
};

const DEFAULT_HINTS: [string, string] = ["technology workspace", "computer screen desk"];

/** Two search queries for a post: one tied to its specific topic, one a category-level fallback. */
export function getImageQueries(category: string, topic: string): [string, string] {
  const [specific, fallback] = CATEGORY_IMAGE_HINTS[category] || DEFAULT_HINTS;
  return [`${topic} ${specific}`.slice(0, 90), fallback];
}

interface Photo {
  url: string;
  alt: string;
  /** Markdown attribution line (required by Unsplash's API guidelines), rendered as a small caption. */
  credit?: string;
}

/** Inserts markdown images after two "## " headings spaced roughly a third and two-thirds through the post. */
export function insertImagesIntoContent(content: string, images: Photo[]): string {
  if (images.length === 0) return content;

  const lines = content.split("\n");
  const h2Indices: number[] = [];
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
    .map((idx, i) => {
      const image = images[i];
      const caption = image.credit ? `\n*${image.credit}*\n` : "";
      return { idx, markdown: `\n![${image.alt}](${image.url})\n${caption}` };
    })
    .sort((a, b) => b.idx - a.idx);

  for (const { idx, markdown } of inserts) {
    let insertAt = idx + 1;
    if (lines[insertAt] === "") insertAt += 1;
    lines.splice(insertAt, 0, markdown);
  }

  return lines.join("\n");
}
