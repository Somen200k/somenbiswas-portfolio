# somenbiswas.me

Personal portfolio for Somen Biswas — solo AI builder shipping NexGuild, xtoolkit.live, and StarScoopDaily.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP · MDX (blog) · Web3Forms (contact)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in ADMIN_PASSWORD, GitHub creds, Web3Forms key
npm run dev
```

## Content

All site copy lives in `data/*.json` (hero, about, projects, services, stats, contact, SEO) and blog posts live as MDX files in `content/blog/`. Both are editable through the admin panel.

## Admin panel

`/admin` — password-gated (see `ADMIN_PASSWORD` in `.env.local`). Edits publish straight to GitHub via the Contents API (same pattern as StarScoopDaily), which triggers a Vercel rebuild. Configure the GitHub connection either via env vars (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`) or from the admin panel's "GitHub Connection" panel (stored in the browser).

## Deployment

Deployed on Vercel, connected to this repo's `main` branch.
