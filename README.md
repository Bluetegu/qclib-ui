# qclib-ui

Web UI for the **Quantum Computing Expert Library**, a research knowledge base maintained by [openclaw](https://github.com/openclaw). Browse papers, explore the taxonomy, and track Rumination proposals — all served from a local Next.js app exposed securely via Cloudflare Tunnel.

---

## Prerequisites

| Requirement   | Version                                              |
| ------------- | ---------------------------------------------------- |
| Node.js       | ≥ 22 LTS (use `nvm use` in this directory)           |
| pnpm          | ≥ 11.3.0 (`npm i -g pnpm` or Corepack)               |
| openclaw data | Accessible at a local path set via `QCLIB_DATA_ROOT` |

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install   # reads .nvmrc → installs Node 22
nvm use
```

---

## Local Development

**1. Clone and install**

```bash
git clone <repo-url> qclib-ui
cd qclib-ui
pnpm install
```

**2. Configure environment**

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Absolute path to the openclaw wiki root on this machine
QCLIB_DATA_ROOT=/home/satoshi/.openclaw/wiki/main

# Your email address — used to gate the /ruminations owner-only route
OWNER_EMAIL=you@example.com
```

**3. Run the dev server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The Cloudflare headers (`Cf-Access-Jwt-Assertion`, `Cf-Access-Authenticated-User-Email`) are not present in local dev. The middleware skips all auth and owner checks when `NODE_ENV=development`, so the full app — including `/ruminations` — is accessible without a tunnel.

---

## Environment Variables

| Variable          | Required | Description                                                                             |
| ----------------- | -------- | --------------------------------------------------------------------------------------- |
| `QCLIB_DATA_ROOT` | Yes      | Absolute path to `~/.openclaw/wiki/main/`                                               |
| `OWNER_EMAIL`     | Yes      | Owner email matched against `Cf-Access-Authenticated-User-Email` to gate `/ruminations` |

---

## Project Structure

```
app/
  page.tsx                  # Dashboard (stats + recent papers)
  library/
    page.tsx                # Library Browser (taxonomy sidebar + card grid)
    [slug]/page.tsx         # Markdown Viewer (KaTeX math support)
  ruminations/
    page.tsx                # Rumination Tracker (owner-only)
  api/
    library/route.ts        # GET /api/library — full parsed JSON index (ISR 60s)
    search/route.ts         # GET /api/search?q= — Fuse.js ranked results
    ruminations/route.ts    # GET /api/ruminations — parsed rumination files
components/
  PaperCard.tsx             # Paper card with title, authors, tags, subdomain, type badge
  RuminationCard.tsx        # Rumination card with status badge, hypothesis, open questions
  SearchBar.tsx             # URL-param-driven search input (client component)
  TaxonomySidebar.tsx       # Subdomain filter sidebar (desktop) / pill strip (mobile)
  TypeFilterTabs.tsx        # All / Papers / Meetings / Discussions filter tabs
  MarkdownRenderer.tsx      # react-markdown + KaTeX renderer
lib/
  libraryReader.ts          # FS scanner, gray-matter parser, stats aggregator
  libraryReader.test.ts     # Vitest unit tests for the data layer
proxy.ts                    # Cf-Access-Jwt-Assertion check + /ruminations owner gate
vitest.config.ts            # Vitest configuration
```

**Data directories indexed** (relative to `QCLIB_DATA_ROOT`):

| Path                           | Used for                              |
| ------------------------------ | ------------------------------------- |
| `sources/QC/`                  | Library Browser — papers by subdomain |
| `syntheses/QC/rumination-*.md` | Rumination Tracker                    |

**Directories excluded from scanning:** `concepts/`, `entities/`, `reports/`, `.openclaw-wiki/`, `_attachments/`, `_views/`

---

## Testing

Unit tests cover the data layer (`lib/libraryReader.ts`) — parsing, field normalisation, directory exclusions, and stats aggregation. Tests run against a temporary fixture directory and require no external data.

```bash
pnpm test          # run once
pnpm test:watch    # watch mode during development
```

All 10 tests should pass before any commit.

---

## Component Preview

A dev preview page renders all card variants against fixture data — no real `QCLIB_DATA_ROOT` needed:

```
http://localhost:3000/dev/cards
```

Covers: all three entry types (Paper / Meeting / Discussion), title length stress tests, author variants, all subdomain badges, missing-field edge cases, tag truncation, and all four rumination statuses (active / draft / resolved / archived).

The page is not linked from anywhere in the app UI and is marked with a visible amber banner.

---

## Building for Production

```bash
pnpm build
pnpm start        # starts on localhost:3000
```

Or with PM2 (for persistent hosting on the NUC):

```bash
pm2 start pnpm --name "qclib-ui" -- start
pm2 save
```

---

## Deploying to the NUC

```bash
# On the NUC, from the repo directory:
git pull && pnpm install && pnpm build && pm2 restart qclib-ui
```

The app is not intended to be exposed directly. It runs on `localhost:3000` and is reached via a **Cloudflare Tunnel** (`cloudflared`) with **Cloudflare Zero Trust / Access** as the auth layer.

---

## Taxonomy

Papers are grouped by the `subdomain` frontmatter field:

`algorithms` · `hardware` · `error-correction` · `cryptography` · `simulation` · `complexity` · `switching` · `games` · `general`

---

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Components
- [Tailwind CSS 4](https://tailwindcss.com)
- [react-markdown](https://github.com/remarkjs/react-markdown) + [rehype-katex](https://github.com/remarkjs/remark-math) — markdown rendering with KaTeX math
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — frontmatter parsing
- [Fuse.js](https://www.fusejs.io) — client-side fuzzy search
