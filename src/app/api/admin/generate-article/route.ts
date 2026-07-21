import { NextRequest, NextResponse } from "next/server";
import { getPrimaryPlatform, getSecondaryPlatforms, type Platform } from "@/lib/platforms";

const CATEGORY_BRIEFS: Record<string, string> = {
  "AI Building":
    "Practical, technical posts about building software with AI-assisted development — workflow, judgment, what breaks, what to review.",
  "Online Earning":
    "Honest, globally-applicable posts about remote earning methods — microtasks, offerwalls, task platforms, content monetization. Not India-specific.",
  "Remote Work & Freelancing":
    "Posts about the practical realities of remote/freelance work — pricing, communication, portfolios, platform work, career paths.",
  "Web Development With AI":
    "Technical explainer posts about web development concepts and decisions — frameworks, databases, security, SEO, architecture tradeoffs.",
};

const SYSTEM_PROMPT = `You are a ghostwriter for a professional tech blog. Follow these rules exactly:

VOICE:
- Write in a general, topic-focused voice. Address the subject directly.
- Do NOT write as first-person personal narrative ("I did X, here's what I learned"). Avoid a personal-coach or memoir tone. Minimal first-person is fine only for a single grounding detail, never as the organizing structure of the piece.
- No filler, no repeating the title back as the opening line, no generic AI-blog-post throat-clearing ("In today's fast-paced world...").

WHAT NOT TO NAME:
- Do not center the article around, or repeatedly name, any specific AI assistant brand (e.g. do not make "Claude" or "Claude Code" a named subject of the piece). Refer to "AI-assisted development" or "AI coding tools" generically instead.
- Do not invent or reveal specific proprietary business internals (exact revenue splits, internal security architectures, internal schema/config of any real company or product).
- Common industry framework/language/tool names (Next.js, Supabase, TypeScript, Postgres, Tailwind, etc.) are fine to use accurately for genuine technical/educational content.

STRUCTURE:
- 1200+ words in the "content" field.
- Markdown body only (no frontmatter). Use "## " for 6-9 section headings.
- Substantive, concrete, specific advice per section — no padding.

SEO (when a target keyword is given):
- Use the exact target keyword phrase naturally in the title.
- Use it naturally in the excerpt.
- Use it naturally within the first 150 words of the content.
- Use it a total of 3-6 times across the full article, and in at least one "## " heading — naturally, never forced or stuffed. Prioritize natural readability over hitting the count.

CROSS-LINKING SIBLING PROPERTIES (when a "Relevant sibling properties" list is given):
- At most ONE sibling property may get a natural inline markdown link within the body, and only if it genuinely fits the sentence it appears in — never a forced, bolted-on plug.
- Never link more than one sibling property in a single article. Never link in the title, excerpt, or an H2 heading.
- If nothing in the article naturally connects to any listed property, don't mention any of them. Silence is better than a forced plug.

Return ONLY a JSON object with this exact shape:
{
  "title": string (55-75 characters, no clickbait),
  "excerpt": string (140-200 characters, a real summary not a teaser),
  "tags": string[] (3-5 short tags),
  "content": string (the full markdown body, 1200+ words, starting with an intro paragraph before the first heading)
}`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, category, angle, keyword } = body as {
    topic?: string;
    category?: string;
    angle?: string;
    keyword?: string;
  };

  if (!topic || !category) {
    return NextResponse.json(
      { success: false, error: "Topic and category are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const categoryBrief = CATEGORY_BRIEFS[category] || "";
  const siblings = [getPrimaryPlatform(category), ...getSecondaryPlatforms(category)].filter(
    (p): p is Platform => Boolean(p)
  );
  const siblingsList = siblings
    .map((p) => `- ${p.name} (${p.url || p.youtube || p.telegram}) — ${p.description}`)
    .join("\n");

  const userPrompt = [
    `Category: ${category}`,
    categoryBrief ? `Category focus: ${categoryBrief}` : "",
    `Topic: ${topic}`,
    keyword ? `Target keyword to rank for: "${keyword}"` : "",
    angle ? `Specific angle to take: ${angle}` : "",
    siblingsList ? `Relevant sibling properties:\n${siblingsList}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { success: false, error: `Groq API error: ${errText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { success: false, error: "Groq returned an empty response." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(raw) as {
      title: string;
      excerpt: string;
      tags: string[];
      content: string;
    };

    return NextResponse.json({ success: true, article: parsed });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Generation failed." },
      { status: 502 }
    );
  }
}
