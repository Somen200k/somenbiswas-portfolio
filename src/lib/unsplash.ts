const APP_NAME = "somenbiswas.com";

export interface UnsplashPhoto {
  url: string;
  alt: string;
  /** Markdown attribution line, required by Unsplash API guidelines. */
  credit: string;
}

export async function searchUnsplashPhoto(query: string): Promise<UnsplashPhoto | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;

  // Unsplash API guidelines require pinging the download endpoint when a photo is actually used.
  if (photo.links?.download_location) {
    fetch(`${photo.links.download_location}&client_id=${accessKey}`).catch(() => {});
  }

  const photographerUrl = `${photo.user.links.html}?utm_source=${APP_NAME}&utm_medium=referral`;
  const unsplashUrl = `https://unsplash.com/?utm_source=${APP_NAME}&utm_medium=referral`;

  return {
    url: photo.urls.regular,
    alt: photo.alt_description || query,
    credit: `Photo by [${photo.user.name}](${photographerUrl}) on [Unsplash](${unsplashUrl})`,
  };
}
