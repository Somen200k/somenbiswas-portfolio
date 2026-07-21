export interface PexelsPhoto {
  url: string;
  alt: string;
}

export async function searchPexelsPhoto(query: string): Promise<PexelsPhoto | null> {
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
