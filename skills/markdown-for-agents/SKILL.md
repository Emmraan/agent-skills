---
name: markdown-for-agents
description: 'Make every website page AI-agent-friendly by shipping a Markdown version of each page so agents consume content at a fraction of the tokens. Provider-neutral core: per-page meta tags + JSON-LD + a static .md mirror per page + sitemap submission. Includes the Cloudflare "Markdown for Agents" edge-conversion option for sites on Cloudflare Pro+. Use whenever building/launching a website, landing page, or docs site.'
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Markdown for Agents

## What it is

AI agents parse Markdown far more reliably than HTML: explicit structure means better results and less token waste. On real sites, the HTML-to-Markdown difference is an order of magnitude — Cloudflare's own example shows ~725 tokens for the Markdown version of a page whose HTML carried ~12,345 tokens. This skill makes every page you build ship a clean Markdown version agents can read cheaply and correctly.

**Core principle: structure is the feature.** A Markdown version saves tokens only if it is *clean* — real heading hierarchy, prose stripped of nav/footer/scripts, frontmatter metadata, and preserved JSON-LD. A dump of raw HTML wrapped in backticks saves nothing.

## When to use

Activate this skill when any of the following is true:

- You are building, launching, or redesigning a website, landing page, or docs site.
- The site may be consumed by AI agents, LLM crawlers, or AI search tools.
- The user wants to reduce token costs for AI systems reading their content.
- The user mentions "Markdown for Agents", "llms.txt", "AI crawlers", "AI-ready site", or "let agents read my site efficiently".
- A page already exists but has no meta tags, no JSON-LD, or no Markdown-accessible version.

Do NOT activate this skill for general SEO keyword work, visual design, or pure frontend build tasks with no public content.

## Instructions

Run these phases in order. Skip Phase 4 (Cloudflare) unless the site is hosted on Cloudflare with a Pro or Business plan.

### Phase 1 — Meta foundation

Every page gets all three meta tags. They become the YAML frontmatter of the converted Markdown, and without them the frontmatter block is omitted entirely.

```html
<meta name="title" content="Markdown for Agents · Cloudflare Docs">
<meta name="description" content="A short, accurate summary of this page.">
<meta property="og:image" content="https://example.com/cover.png">
```

- `title` and `description`: prefer the standard `<meta name="...">` form; Open Graph (`og:`) values are only fallbacks.
- Write the title and description as real copy an agent can trust — no clickbait, no keyword stuffing.
- `image` is optional; include it when the page has a meaningful cover.

### Phase 2 — JSON-LD structured data

Add one or more `<script type="application/ld+json">` blocks per page with the schema types that fit: `Organization`, `WebSite`, `WebPage`, `Article`, `Product`, `FAQPage`, `BreadcrumbList`, etc. JSON-LD is the only script content preserved in Markdown conversion — it is appended verbatim at the end of the output inside a single fenced `json` block.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "A short, accurate summary.",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2026-01-15",
  "image": "https://example.com/cover.png"
}
</script>
```

- Multiple JSON-LD scripts are concatenated into the one code block, each on its own line.
- Validate with Google's Rich Results Test or Schema.org validator.

### Phase 3 — Serve the Markdown (provider-neutral, default)

For every page, generate a static Markdown mirror an agent can fetch directly. This works on any host — no Cloudflare required.

**Naming:** expose each page as `/{page}.md` (or `/page.md` at the root of a single-page site). Keep the URL identical to the HTML version minus the extension so agents can find it predictably.

**What the Markdown must contain:**
- YAML frontmatter with `title` and `description` (from Phase 1).
- The page content as clean Markdown: proper `#`/`##`/`###` heading hierarchy matching the visible page, prose as paragraphs, lists as real bullets.
- The JSON-LD from Phase 2 appended at the end in a fenced `json` block.
- **Nothing else.** Strip header, footer, navigation, scripts, styles, widgets, and cookie banners — same stripping an edge converter performs.

**Delivery:**
- Serve with `Content-Type: text/markdown; charset=utf-8`.
- Cache the Markdown mirror aggressively: `Cache-Control: max-age=31536000, immutable` if content is immutable; otherwise a short TTL with revalidation, same as the HTML page.
- Where practical, also honor content negotiation: if a client sends `Accept: text/markdown`, respond with the Markdown version instead of HTML.

**If content is generated dynamically:** render the Markdown server-side from the same content model that produces the HTML (SSR or build step), never as an afterthought that can drift from the live page.

### Phase 4 — Cloudflare Markdown for Agents (optional)

If the site is on Cloudflare with a Pro, Business, or Enterprise plan, you can let Cloudflare convert HTML to Markdown at the edge instead of maintaining static mirrors.

**Enable via dashboard:**
1. Cloudflare dashboard → select the zone → **AI Crawl Control** section.
2. Enable **Markdown for Agents**.

**Enable for specific subdomains/paths:** Rules → Configuration Rules → match expression (e.g. `http.host eq "docs.example.com"` or `starts_with(http.request.uri.path, "/blog/")`) → setting **Markdown for Agents** → On.

**Enable via API:**
```bash
curl -X PATCH 'https://api.cloudflare.com/client/v4/zones/{zone_tag}/settings/content_converter' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer {api_token}" --data-raw '{"value": "on"}'
```

**Verify** the conversion works (see Phase 5) before treating this as done. Note the 2 MB origin-response limit and that only HTML is converted.

### Phase 5 — Verify

For each representative page, confirm the Markdown output is clean and token-efficient.

```bash
curl https://example.com/some-page \
  -H "Accept: text/markdown"
```

Check the response:
- `Content-Type` is `text/markdown; charset=utf-8`.
- YAML frontmatter with `title` and `description` is present at the top.
- The body reads as clean Markdown with real heading hierarchy — no stray `<div>`, `class=`, or inline styles.
- JSON-LD appears at the end inside a fenced `json` block.
- Token savings are real: compare `x-markdown-tokens` against `x-original-tokens` (present on Cloudflare-converted responses) — the Markdown should be a fraction of the HTML token count.
- The `content-signal` header allows use: default is `ai-train=yes, search=yes, ai-input=yes`; preserve any origin-set value as authoritative.

If any check fails, fix the page (usually a missing meta tag, heavy markup in the body, or no JSON-LD) and re-verify.

### Phase 6 — Sitemap and discoverability

- Add each Markdown mirror's URL to the XML sitemap (alongside its HTML twin), or serve an `llms.txt` listing the Markdown pages.
- Submit the sitemap to Google Search Console so AI crawlers and search engines index the agent-friendly versions.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Missing `<meta name="title">`/`description` | Frontmatter block is omitted entirely — no metadata for agents. Add Phase 1 tags. |
| Wrapping raw HTML in a Markdown file | Saves no tokens; agents still parse HTML. Convert to real Markdown structure. |
| Including nav, footer, scripts, cookie banners in the Markdown | Wasted tokens and noise. Strip everything non-content (Phase 3). |
| Heading hierarchy that drifts from the visible page | Agents trust the Markdown structure — keep it identical to the rendered page. |
| No JSON-LD | Structured data is lost on conversion. Add per-page schema (Phase 2). |
| Static mirrors that go stale | Render from the same content model as the HTML; never maintain by hand. |
| Forgetting cache headers | Every agent fetch re-renders/hits origin. Cache the Markdown mirror. |
| Assuming Cloudflare is required | The provider-neutral core (Phases 1–3, 5–6) works on any host. |

## Exit Checklist

- [ ] Every page has `title`, `description`, and (where relevant) `og:image` meta tags
- [ ] Every page carries valid JSON-LD structured data
- [ ] Each page is reachable as clean Markdown (`/{page}.md` or `Accept: text/markdown` on Cloudflare)
- [ ] Markdown contains only frontmatter, content, and JSON-LD — no boilerplate
- [ ] Token savings verified: `x-markdown-tokens` is a small fraction of `x-original-tokens`
- [ ] Markdown URLs are in the sitemap and submitted to Search Console
