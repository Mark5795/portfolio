import { getRequestURL, setHeader } from 'h3'
import {
  isArchivedProjectPath,
  parseProjectMarkdown,
  projectLocaleFromPath,
  projectSlugFromPath,
} from '../../app/utils/project-content'

const projectFiles = import.meta.glob('../../content/projects/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const urls = new Map<string, string>()

  for (const path of ['/', '/projects', '/about', '/privacy']) {
    urls.set(path, '')
  }

  for (const [path, source] of Object.entries(projectFiles)) {
    if (isArchivedProjectPath(path)) continue

    const slug = projectSlugFromPath(path)
    const locale = projectLocaleFromPath(path)
    if (!slug || (locale && locale !== 'en')) continue

    const project = parseProjectMarkdown(String(source))
    urls.set(`/projects/${slug}`, project.publishedOn)
  }

  const entries = [...urls.entries()]
    .map(([path, publishedOn]) => {
      const lastmod = publishedOn ? `\n    <lastmod>${escapeXml(publishedOn)}</lastmod>` : ''
      return `  <url>\n    <loc>${escapeXml(`${origin}${path}`)}</loc>${lastmod}\n  </url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=UTF-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
})
