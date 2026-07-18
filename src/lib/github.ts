interface GithubCreds {
  owner: string;
  repo: string;
  token: string;
}

interface PublishResult {
  success: boolean;
  method: "github" | "filesystem";
  error?: string;
  commitUrl?: string;
}

export function resolveGithubCreds(clientCreds?: Partial<GithubCreds>): GithubCreds | null {
  const owner = process.env.GITHUB_OWNER || clientCreds?.owner;
  const repo = process.env.GITHUB_REPO || clientCreds?.repo;
  const token = process.env.GITHUB_TOKEN || clientCreds?.token;

  if (!owner || !repo || !token) return null;
  return { owner, repo, token };
}

export async function publishViaGithub(
  creds: GithubCreds,
  path: string,
  content: string,
  message: string,
  encoding: "utf-8" | "base64" = "utf-8"
): Promise<PublishResult> {
  const apiUrl = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${creds.token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  let sha: string | undefined;
  const existing = await fetch(apiUrl, { headers });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  // Binary uploads (e.g. a PDF) arrive already base64-encoded from the
  // client — re-encoding them as UTF-8 first would corrupt the bytes.
  const encodedContent =
    encoding === "base64" ? content : Buffer.from(content, "utf-8").toString("base64");

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    return { success: false, method: "github", error: errBody };
  }

  const data = await res.json();
  return { success: true, method: "github", commitUrl: data.commit?.html_url };
}

export async function deleteViaGithub(
  creds: GithubCreds,
  path: string,
  message: string
): Promise<PublishResult> {
  const apiUrl = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${creds.token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  const existing = await fetch(apiUrl, { headers });
  if (!existing.ok) {
    return { success: false, method: "github", error: "File not found on GitHub." };
  }
  const data = await existing.json();

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ message, sha: data.sha }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    return { success: false, method: "github", error: errBody };
  }

  return { success: true, method: "github" };
}
