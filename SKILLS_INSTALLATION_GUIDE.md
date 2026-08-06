# SKILLS installation guide

This guide tells you which skills to install for your website, app, or project, so you install only what is relevant. Every project installs the same **Mandatory Core Kit** (the loop engineering and UX design backbone), then a **project-type pack** matched to your work.

Two ways to use this guide:

- **Auto method (Part A)** — paste one master prompt into your AI agent. It detects your project type and installs the right skills itself.
- **Manual method (Part B)** — pick your project type from a table and copy the install commands yourself.

All install commands use the `skills` CLI:

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/<category>        # whole category
npx skills add https://github.com/Emmraan/agent-skills --skill <skill-name>              # one skill
```

---

## Part A: Auto Method (Master Prompt)

### The Master Prompt

Copy-paste the block below into your AI agent (opencode, Claude Code, Cursor, etc.). It works for a **blank repo** and an **existing project**; the agent detects which one it is and behaves accordingly.

```text
Install the right agent skills for this project from my skills collection:
https://github.com/Emmraan/agent-skills

STEP 1 — DETECT the repo state by inspecting the project directory:
- If there are no source files (no package.json, no requirements.txt,
  no pubspec.yaml, no go.mod, no Gemfile, no composer.json, no *.csproj,
  no pom.xml, no Cargo.toml, no Dockerfile, no src/ or lib/ directory,
  and no meaningful code) → treat it as a BLANK repo.
- Otherwise → treat it as an EXISTING project.

STEP 2 — CLASSIFY the project type:
- BLANK repo: ask me a short intake — MAX 4 questions total. Ask only
  what you cannot guess: (1) what am I building — website, web app,
  mobile app, backend/API, e-commerce store, or AI/ML app? (2) tech
  stack / frameworks I plan to use, if any; (3) will I deploy to
  production and how? Then classify.
- EXISTING project: do NOT ask me anything. Analyze the codebase
  yourself using the Detection Reference table below and classify.

STEP 3 — INSTALL, in this order:
1. ALWAYS install the Mandatory Core Kit (see table below) — every
   project needs it. Do not skip any of these.
2. Install ONLY the project-type pack that matches the classification.
   Do not install skills irrelevant to this project.
3. If the project spans multiple types (e.g. frontend + backend), install
   the packs for each. If it needs only part of a pack, install the
   specific skills you need instead of the whole category.

STEP 4 — REPORT: list what you installed, grouped into Core Kit vs
Project-Type pack, and one line on why each pack matched. If you skipped
a category, say why.

DETECTION REFERENCE (project signal → project type → pack):
- package.json + react/next/vue/svelte/angular → Web app — frontend
- package.json + gsap/motion/three/pixi/lottie → Animation / 3D
- package.json + shopify/theme.liquid → E-commerce (Shopify)
- composer.json + woocommerce/wp-content → E-commerce (WordPress)
- requirements.txt/pyproject.toml + fastapi/django → Backend / API
- requirements.txt + mlflow/torch/tensorflow → AI / ML
- pubspec.yaml → Mobile app (Flutter)
- go.mod → Backend / API
- Gemfile + rails → Backend / API
- pom.xml + spring → Backend / API
- *.csproj → Backend / API
- Cargo.toml → Backend / API
- No code, static marketing page / landing page → Marketing website
- Existing site that underperforms → Existing site improvement
- Multiple services + Dockerfile + CI → Enterprise / industry-scale
```

### Core Kit (installed by the master prompt)

| Skill | Why it's mandatory |
|---|---|
| `loop-orchestrator` | Runs the DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP lifecycle as engineered loops. The entry point of the whole model. |
| `using-agent-skills` | Meta-skill that discovers and invokes the right skill for each task. |
| `planning-and-task-breakdown` | Breaks a spec into small, verifiable, ordered tasks (PLAN phase). |
| `incremental-implementation` | Builds in thin slices with test-verify-commit discipline (BUILD phase). |
| `testing` | End-to-end test engineering strategy (VERIFY phase). |
| `test-master` | Test file generation, mocking, coverage analysis (VERIFY phase). |
| `code-reviewer` | Five-axis review before merge (REVIEW phase). Enforces the human-code bar — flags AI-tell patterns and *what*-comments. |
| `code-simplification` | Reduces unnecessary complexity while preserving behavior (REVIEW phase). Removes redundant comments and AI-tell noise. |
| `version-control` | Branching, atomic commits, release versioning (SHIP phase). |
| `sdlc-workflow` | The industry-standard feature pipeline: issue → branch → develop → test → commit → PR → review → CI → merge → staging → QA → production → monitor. Makes the agent build features the way a real company does. |
| `forward-deployed-engineer` | The embedded-customer operating model: orient in an unfamiliar codebase before coding, extract real requirements conversationally, build in-place matching the repo's conventions, respect the customer's SDLC gates, and hand over maintainable code. |
| `technical-writer` | Writes professional docs for repos and docs websites: READMEs, tutorials, quickstarts, API references, release notes, and structured Docusaurus/VitePress/MkDocs content with frontmatter and navigation. |

---

## Part B: Manual Method

### B.1 Mandatory Core Kit — install these first

```bash
npx skills add https://github.com/Emmraan/agent-skills --skill loop-orchestrator
npx skills add https://github.com/Emmraan/agent-skills --skill using-agent-skills
npx skills add https://github.com/Emmraan/agent-skills --skill planning-and-task-breakdown
npx skills add https://github.com/Emmraan/agent-skills --skill incremental-implementation
npx skills add https://github.com/Emmraan/agent-skills --skill testing
npx skills add https://github.com/Emmraan/agent-skills --skill test-master
npx skills add https://github.com/Emmraan/agent-skills --skill code-reviewer
npx skills add https://github.com/Emmraan/agent-skills --skill code-simplification
npx skills add https://github.com/Emmraan/agent-skills --skill version-control
npx skills add https://github.com/Emmraan/agent-skills --skill sdlc-workflow
npx skills add https://github.com/Emmraan/agent-skills --skill forward-deployed-engineer
npx skills add https://github.com/Emmraan/agent-skills --skill technical-writer
```

### B.2 Project-Type Packs

Pick the pack that matches your project and install only that.

#### 1. Marketing website / landing page

Static or content-first site designed to convert visitors.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/design-ux
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/marketing-growth
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

Key skills: `create-website`, `storybrand-messaging`, `one-page-marketing`, `made-to-stick`, `cro-methodology`, `top-design`, `frontend-core`, `frontend-craft`, `seo`.
Skip: backend, databases, testing-heavy packs (unless you add a store or app).

#### 2. Web app — frontend only

A client-rendered app with a UI and a third-party/existing API.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/animation-webgl
```

Key skills: `frontend-core`, `frontend-craft`, your framework (`react`, `nextjs`, `vue`, `svelte`, `angular`), `typescript`, `tailwind-css`, `vite`, `motion`, `microinteractions`.
Skip: backend-apis, databases-data, devops-cloud (unless you also own the API).

#### 3. Web app — full stack

A project where you own the UI and the backend.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/backend-apis
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/databases-data
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/devops-cloud
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/testing-quality
```

Key skills: `frontend-core`, `frontend-craft`, `backend-core`, `backend-craft`, `api-design`, `authentication`, `database-architecture`, `security`, `browser-testing-with-devtools`, `playwright-expert`.

#### 4. Backend / API only

APIs, services, or backend systems with no UI.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/backend-apis
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/databases-data
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/devops-cloud
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/testing-quality
```

Key skills: `backend-core`, `backend-craft`, `api-design`, `authentication`, `caching`, `messaging`, `database-architecture`, `database-performance`, `security`, `testing`, `test-master`. Add your language skill from `languages/` (`node`, `python-pro`, `golang-pro`, `java-architect`, etc.).

#### 5. Mobile app (Flutter)

Cross-platform mobile app.

```bash
npx skills add https://github.com/Emmraan/agent-skills --skill flutter-expert
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

Add `backend-apis` + `databases-data` if the app talks to your own backend.

#### 6. E-commerce

Online store on Shopify or WordPress/WooCommerce.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/marketing-growth
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

Shopify: `shopify-expert`. WordPress/WooCommerce: `wordpress-pro`. Add `seo` and `cro-methodology` for growth, `create-website` for the storefront design.

#### 7. AI / ML application

ML pipelines, fine-tuning, or AI-backed apps.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/ai-ml
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/databases-data
```

Key skills: `ml-pipeline`, `fine-tuning-expert`, `rag`, `fastapi-expert`, `django-expert`, `pandas-pro`. Add `backend-apis` for the serving API.

#### 8. Animation / 3D-heavy site

Sites that lean on WebGL, GSAP, or motion design.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/animation-webgl
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

Key skills: `gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `motion`, `threejs-webgl`, `react-three-fiber`, `pixijs-2d`, `lottie-animations`, `barba-js`, `frontend-craft`, `top-design`.

#### 9. Existing site improvement

A live site that underperforms — fix conversion, UX, speed, or SEO.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/marketing-growth
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/design-ux
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/testing-quality
```

Key skills: `improve-website`, `grow-website`, `cro-methodology`, `seo`, `refactoring-ui`, `ux-heuristics`, `frontend-performance`, `high-perf-browser`, `browser-testing-with-devtools`. Use `create-website` only if rebuilding from scratch.

#### 10. Enterprise / industry-scale system

Multiple services, real deployments, SLOs, and production rigor.

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/agent-meta
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/backend-apis
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/databases-data
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/devops-cloud
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/testing-quality
```

Add: `architecture-designer`, `doubt-driven-development`, `fullstack-guardian`, `feature-forge`, `microservices-architect`, `security`, `devops`, `cloud`, `monitoring`, `sre-engineer`, `terraform-engineer`, `kubernetes-specialist`, `scalability`.

---

## Part C: Install Commands Reference

```bash
# Install a whole category (all skills under it)
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui

# Install one specific skill
npx skills add https://github.com/Emmraan/agent-skills --skill loop-orchestrator

# Browse skills before installing
npx skills add https://github.com/Emmraan/agent-skills --list

# Install the entire collection
npx skills add https://github.com/Emmraan/agent-skills

# View all CLI options
npx skills --help
```

Available categories (full command list in [SKILLS_CATEGORIES.md](SKILLS_CATEGORIES.md)):
`frontend-ui`, `animation-webgl`, `backend-apis`, `languages`, `databases-data`, `ai-ml`, `devops-cloud`, `testing-quality`, `design-ux`, `marketing-growth`, `agent-meta`.

### Verify it works

After installing, confirm the skills are live in your agent:

1. Open a new session in your project so the agent picks up the installed skills.
2. Ask your agent to list the skills it has available.
3. Trigger one: give a simple task prompt and confirm the agent loads the matching skill (e.g. ask it to plan a small feature and check that `planning-and-task-breakdown` activates).
4. For the loop model, ask a task that passes through phases and confirm the agent references `loop-orchestrator`'s DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP flow and creates a `docs/LOOP.md` tracker.

Not seeing the skill? Confirm the install path matches your agent's skill directory (`.opencode/skill/`, `.claude/skills/`, etc.), or run the install again with the agent watching.
