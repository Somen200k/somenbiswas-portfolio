export function splitContentInHalf(content: string): [string, string] {
  const paragraphs = content.split(/\n\n+/);
  if (paragraphs.length < 4) return [content, ""];

  const mid = Math.ceil(paragraphs.length / 2);
  return [paragraphs.slice(0, mid).join("\n\n"), paragraphs.slice(mid).join("\n\n")];
}
