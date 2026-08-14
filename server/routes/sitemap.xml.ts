import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getRequestURL, setHeader } from 'h3'
import {
  isArchivedProjectPath,
  parseProjectMarkdown,
  projectLocaleFromPath,
  projectSlugFromPath,
} from '../../app/utils/project-content'

const projectDirectory = join(process.cwd(), 'content', 'projects')

const readProjectFiles = (directory: string): Array<[string, string]> => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const filePath = join(directory, entry.name)
    if (entry.isDirectory()) return readProjectFiles(filePath)
    if (!entry.isFile() || !entry.name.endsWith('.md')) return []
    return [[filePath, readFileSync(filePath, 'utf8')]]
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

  for (const [filePath, source] of readProjectFiles(projectDirectory)) {
    const relativePath = filePath.slice(projectDirectory.length + 1)
    if (isArchivedProjectPath(relativePath) || isDraftProjectPath(relativePath)) continue

    const slug = projectSlugFromPath(relativePath)
    const locale = projectLocaleFromPath(relativePath)
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
