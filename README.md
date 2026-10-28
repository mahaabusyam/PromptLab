# PromptLab

[

![CI](https://github.com/mahaabusyam/PromptLab/actions/workflows/ci.yml/badge.svg)

](https://github.com/mahaabusyam/PromptLab/actions/workflows/ci.yml)

**A workspace for writing, organizing, versioning and comparing prompts for AI tools.**

PromptLab is a local-first web app: you write prompts with dynamic `{{variables}}`, keep them in folders, save every meaningful change as a version, compare any two versions side by side, and restore old ones, all without an account or a backend. Your data lives in your browser and can be exported and restored as JSON at any time.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Tests](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-English_%2B_Arabic_(RTL)
-0EA5E9)

> **Live demo:** [prompt-lab-ivory.vercel.app](https://prompt-lab-ivory.vercel.app)

> **Status:** all features are complete, including the optional **AI tools** (Improve, Variations, Run with AI). The app works fully offline without them, see [AI setup](#ai-setup).

---

## Screenshots

|                  Dashboard                   |                 Prompt Library                  |
| :------------------------------------------: | :---------------------------------------------: |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Prompt Library](docs/screenshots/library.png) |

|                 Prompt Editor                 |                 Compare Versions                  |
| :-------------------------------------------: | :-----------------------------------------------: |
| ![Prompt Editor](docs/screenshots/editor.png) | ![Compare Versions](docs/screenshots/compare.png) |

|                  Templates                   |              Settings (light theme)              |
| :------------------------------------------: | :----------------------------------------------: |
| ![Templates](docs/screenshots/templates.png) | ![Settings](docs/screenshots/settings-light.png) |

---
### Arabic (RTL)

| Dashboard | Compare |
|---|---|
| 

![Dashboard in Arabic](docs/screenshots/dashboard-ar.png)

 | 

![Compare in Arabic](docs/screenshots/compare-ar.png)

 |

## Features

### Write and run

- **Prompt editor** built on CodeMirror, with `{{variable}}` highlighting and a side panel for variables, model and settings.
- **Dynamic variables**: values are filled in a panel and the final text is previewed before use. An **Auto-Fill** button fills the empty ones with sample values.
- **Autosave** for existing prompts. New prompts stay drafts until you click **Create Prompt**, and leaving an unsaved draft asks for confirmation.
- **Simulated run**: the console resolves the prompt with your variable values and shows estimated tokens and cost. It is free, instant and works offline.

### AI assistance

- **Improve with AI**: pick a task, tone and length, then compare your prompt with the suggestion side by side and apply it with one click.
- **Generate Variations**: get three alternative versions with different approaches, copy one or use it in the editor.
- **Run with AI**: send the final prompt (with your variable values) to a real model and see the answer, latency and token usage.
- It always uses the model configured on the server (`GEMINI_MODEL`). The model and temperature shown in the editor's Model panel apply to the simulated run only; Max Tokens is sent with real runs.
- **Variable safety**: if a suggestion removes or adds a `{{variable}}`, you get a warning before applying it.
- Clear **loading, error and rate-limit** states. If the AI service is unavailable, everything else keeps working.

### Organize

- **Prompt Library** in grid or compact list view, with instant search (title, description, content, tags), filters (category, model provider, tag), sorting and pagination.
- **Nested folders**, tags, categories, favorites and an archive.
- **Command palette** (`Ctrl/⌘ + K`) to jump to any prompt, template or page.

### Version and compare

- **Versions** with semantic labels (`v1.4` → `v1.5` minor, `v2.0` major) and a note describing each change.
- **History**: a timeline or table of every version across all prompts, with filters, stats and an inline diff.
- **Compare**: pick any two versions of a prompt and see the differences in split or unified view, with a minimap, word-level highlighting and a shareable URL. Export the result as a unified diff.
- **Restore** creates a _new_ version with the old content, so history is never rewritten. Restoring and deleting ask for confirmation.

### Templates and favorites

- **12 built-in templates** across marketing, coding, education, writing and data analysis, with preview and a one-click **Use template** that creates a prompt.
- **Import your own templates** from JSON (validated with Zod).
- **Favorites** collects starred prompts and templates, with filters, folder and variable shortcuts, undo, and **Export Starred (JSON)**.

### Your data

- **Local-first**: everything is stored in `localStorage`, no account and no backend.
- **Full backup and restore** from Settings: one JSON file with prompts, versions, folders, imported templates, favorites and settings. It includes a **SHA-256 checksum**, is validated with Zod on import, and can be **merged** into or **replace** your current data.
- **Storage meter** showing how much browser storage PromptLab uses.

### Experience

- **Dark, light and system themes**, four accent colors and a higher-contrast mode.
- **Responsive** layout for phones, tablets and desktops.
- **Accessible by design**: semantic HTML, native `<dialog>` modals with focus handling, ARIA roles for tabs, switches and comboboxes, visible focus states and full keyboard navigation. Animations respect `prefers-reduced-motion`.
- Loading, error and empty states throughout, plus a custom 404 page and route error screen.
- **English and Arabic (RTL)**: the whole interface is translated and mirrors correctly for right-to-left reading. The language is detected from your browser and can be switched in **Settings → Appearance**.

### Keyboard shortcuts

| Shortcut         | Where                    | Action                |
| ---------------- | ------------------------ | --------------------- |
| `Ctrl/⌘ + K`     | Anywhere                 | Open search           |
| `Ctrl/⌘ + Enter` | Editor                   | Run the prompt        |
| `H`              | Favorites (card focused) | Remove from favorites |
| `Esc`            | Dialogs                  | Close                 |

---

## Tech stack

| Area                 | Tools                                                     |
| -------------------- | --------------------------------------------------------- |
| Framework            | React 19, TypeScript (strict), Vite                       |
| Routing              | React Router 7 (data router, lazy-loaded pages)           |
| Styling              | Tailwind CSS v4, shadcn/ui-style components, Lucide icons |
| State                | Zustand with `persist` (localStorage)                     |
| Forms and validation | React Hook Form + Zod                                     |
| Editor               | CodeMirror (`@uiw/react-codemirror`)                      |
| Motion               | GSAP + ScrollTrigger, Lenis smooth scrolling              |
| Dates                | date-fns   
| Internationalization | i18next + react-i18next (typed keys, RTL support)         |
| Testing              | Vitest, React Testing Library, jsdom                      |
| AI integration       | TanStack Query, Axios, Vercel Functions, Gemini API       |

The visual design was created in **Google Stitch** (the "Obsidian Kinetic" design system) and implemented with design tokens that support both dark and light themes.

---

## Getting started

**Requirements:** Node.js 20.19+ (or 22.12+) and npm.

```bash
# 1. Clone
git clone https://github.com/mahaabusyam/PromptLab
cd promptlab

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`). The app starts with a few demo prompts; use **Settings → Reset demo data** to restore them at any time.

## AI setup

The AI tools are optional. Without any setup the app still works, and the AI buttons show a friendly "not available" message.

AI requests go through small serverless functions in `api/`, so **the secret key never reaches the browser**.

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. Add it to your Vercel project (**Settings → Environment Variables**), then redeploy:

   | Variable         | Required | Description                                    |
   | ---------------- | -------- | ---------------------------------------------- |
   | `GEMINI_API_KEY` | yes      | Server-side key. Never prefix it with `VITE_`. |
   | `GEMINI_MODEL`   | no       | Model id (default: `gemini-3.5-flash-lite`).   |

3. For local development, `npm run dev` does not run `api/`. Either proxy `/api` to a deployed copy in `vite.config.ts`:

   ```ts
   server: {
     proxy: { '/api': { target: 'https://your-app.vercel.app', changeOrigin: true } },
   },
   ```

   or run `npx vercel dev` (needs the Vercel CLI and the same environment variables).

The functions validate input with Zod, cap prompt length at 8,000 characters and apply a basic per-IP rate limit.

### Scripts

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Start the development server                                         |
| `npm run build`   | Type-check (`tsc -b`) and build for production                       |
| `npm run preview` | Preview the production build locally                                 |
| `npm run lint`    | Run ESLint                                                           |
| `npm test`        | Run the test suite in watch mode (`npx vitest run` for a single run) |

Before deploying, run `npm run lint && npm run build && npx vitest run`.

---

## Project structure

The code is organized **by feature**. Business logic (filters, diffing, validation, import/export) lives in small pure functions that are unit-tested, separate from the UI.

```text
api/                # Vercel Functions: secure proxy to the AI provider
├── improve.ts
├── variations.ts
└── run.ts
src/
├── app/            # router, providers, route error handling
├── i18n/           # i18next setup and English / Arabic locale files
├── components/
│   ├── ui/         # base UI components
│   ├── layout/     # sidebar, header, app layout
│   └── common/     # shared pieces (dialogs, pagination, status screens...)
├── features/
│   ├── dashboard/  ├── library/    ├── editor/     ├── prompts/
│   ├── versions/   ├── history/    ├── compare/    ├── templates/
│   ├── favorites/  ├── settings/   └── search/     ├── ai/
├── pages/          # one file per route
├── stores/         # Zustand stores (prompts, templates, settings, theme...)
├── hooks/          # shared hooks
├── utils/          # pure helpers (variables, tokens, diff helpers, download...)
├── data/           # seed prompts and built-in templates
└── test/           # test helpers
```

### Routes

| Path                           | Page                           |
| ------------------------------ | ------------------------------ |
| `/`                            | Dashboard                      |
| `/library`                     | Prompt Library                 |
| `/editor`, `/editor/:promptId` | Prompt Editor (new / existing) |
| `/templates`                   | Templates                      |
| `/history`                     | History                        |
| `/compare`                     | Compare Versions               |
| `/favorites`                   | Favorites                      |
| `/settings`                    | Settings                       |
| `*`                            | Not Found                      |

---

## Data and privacy

Your prompts and versions are stored in your browser. PromptLab uses these `localStorage` keys:

| Key                                             | Contents                                        |
| ----------------------------------------------- | ----------------------------------------------- |
| `promptlab-prompts`                             | Prompts, versions and folders                   |
| `promptlab-templates`                           | Imported templates and starred templates        |
| `promptlab-settings`                            | Workspace name, default model, accent, contrast |
| `promptlab-theme`                               | Theme choice                                    |
| `promptlab-library`, `promptlab-favorites-view` | View preferences                                |

Clearing your browser data removes your prompts, so **export a backup** from Settings regularly. Every imported file is validated with Zod before it can touch the app's state.
**AI features and privacy:** only when you click an AI button (Improve, Variations or Run with AI) the prompt text, plus your chosen options, is sent through the app's server function to the Gemini API. Nothing is sent otherwise, and the app does not store AI requests or answers on a server.

---

## Testing

The suite covers the logic the app depends on most:

- prompt **CRUD**, version saving, restoring and deleting (`promptStore`)
- **variable** extraction, substitution and truncation
- **version labels** and the **diff** algorithm
- **search** and **filters**, pagination
- **import / export** parsing, validation and backup checksums
- templates and favorites logic
- a React Testing Library component test (variables panel)
- the **AI layer**: API failures (rate limits, timeouts, unavailable service, malformed responses) and the AI dialogs' loading, error and apply flows
- **locale parity**: a test makes sure the English and Arabic files have the same keys and the same `{{placeholders}}`

```bash
npx vitest run
```

---

## Roadmap

Done:

- [x] **Improve Prompt**, **Generate Variations** and **Run with AI**
- [x] **Task, tone and length** controls
- [x] Loading, error and rate-limit states, with tests for API failures
- [x] A **secure proxy** between the app and the AI provider
- [x] Deployment on **Vercel**

Ideas:

- [ ] A stronger rate limit (shared daily quota)
- [ ] Streaming answers
- [ ] Saving AI answers next to each version

> **Security note:** the AI provider's secret key is never placed in the React app or in `VITE_*` variables, because those are bundled into the browser. Requests go through a server-side proxy that keeps the key private.

---

## Author

Built by **[mahaabusyam](https://github.com/mahaabusyam)**.

## License

Released under the [MIT License](LICENSE).
