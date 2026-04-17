# WebSite Builder AI

AI Website Builder SaaS built with Next.js App Router, Clerk auth, MongoDB persistence, OpenRouter streaming, Monaco editor, live preview, and ZIP export.

## Setup

1. Copy env template:

```bash
cp .env.local.example .env.local
```

2. Fill environment variables.
3. Install and run:

```bash
npm install
npm run dev
```

## Included

- Landing page with animated premium SaaS styling.
- `/builder` authenticated AI website builder workspace:
  - Project sidebar
  - Monaco code editor with file tabs
  - Live iframe preview
  - Streaming AI chat panel
  - Save + export
- API routes:
  - `POST /api/ai` streaming OpenRouter SSE passthrough
  - `GET/POST /api/project`
  - `GET/PUT/DELETE /api/project/[id]`
  - `POST /api/stripe/checkout`
