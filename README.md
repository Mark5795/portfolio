# MARK KEA // Portfolio

A dark, technical IT portfolio built with Nuxt. Project pages are driven by localized Markdown files and presented with a terminal-inspired interface.

## Features

- Responsive home, about, projects, and privacy pages
- English and Dutch localization
- Markdown-driven project cards and detail pages
- Project frontmatter for status, role, stack, publication date, and AI use
- Newest, oldest, and title sorting on the projects page
- Safe Markdown rendering without `v-html`
- Theme and language preferences stored in the browser

## Stack

- Nuxt 4
- Vue 3
- TypeScript
- CSS custom properties
- `@nuxtjs/i18n`
- `@nuxt/icon` with Lucide icons
- Vitest and Nuxt Test Utils

## Project Content

Project Markdown files live in `content/projects/` and can also be organized in nested directories. Localized files use the `.en.md` and `.nl.md` suffixes.

Example frontmatter:

```yaml
---
id: WEB-PORTFOLIO-V1
label: WEB_SYSTEM
title: Web Portfolio
summary: A website where I share my hobby projects.
status: ONLINE
role: Full-stack Developer
publishedOn: 2026-08-08
AiUse: Design and Development
stack: Nuxt, Vue, TypeScript, CSS, i18n, Markdown
---
```

Markdown body content supports headings, paragraphs, lists, and fenced code blocks. The parser keeps the content as Vue-rendered text rather than injecting raw HTML.

## Routes

- `/` — homepage and featured projects
- `/projects` — sortable project listing
- `/projects/:slug` — project detail page
- `/about` — profile and setup
- `/privacy` — privacy information

## Setup

Install dependencies with pnpm:

```bash
pnpm install
```

## Development Server

Start the development server at `http://localhost:3000`:

```bash
pnpm dev
```

## Testing

Run the Nuxt test suite:

```bash
pnpm test:nuxt --run
```

Run tests with coverage:

```bash
pnpm test:coverage
```

## Production Build

Build the application:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Docker on Raspberry Pi

The production image uses Node 22 and supports Raspberry Pi systems running a 64-bit ARM operating system. Build and run it from the project directory:

```bash
docker build -t mark-portfolio .
docker run -d \
	--name mark-portfolio \
	--restart unless-stopped \
	-p 3000:3000 \
	mark-portfolio
```

Or use Docker Compose:

```bash
docker compose up -d --build
```

Stop the service with:

```bash
docker compose down
```

When building on another architecture, target the Pi explicitly:

```bash
docker buildx build --platform linux/arm64 -t mark-portfolio:arm64 --load .
```

Open `http://<raspberry-pi-ip>:3000` from another device on the network. The container includes a health check and listens on all interfaces through `HOST=0.0.0.0`.

## License

This project is open source under the [MIT License](LICENSE).
