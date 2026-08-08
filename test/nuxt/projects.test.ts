import { mountSuspended } from '@nuxt/test-utils/runtime'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseProjectMarkdown } from '../../app/utils/project-content'
import HomePage from '../../app/pages/index.vue'
import ProjectsPage from '../../app/pages/projects/index.vue'

const contentDirectory = join(process.cwd(), 'content/projects')
const markdownFiles = []

function collectMarkdownFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) collectMarkdownFiles(path)
    else if (entry.name.endsWith('.md')) markdownFiles.push(path)
  }
}

collectMarkdownFiles(contentDirectory)

describe('Markdown-driven projects', () => {
  it('renders project cards on the projects page', async () => {
    const page = await mountSuspended(ProjectsPage)
    const cards = page.findAll('.project-card')

    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('href')).toBe('/projects/portfolio')
    expect(page.text()).toContain('Web Portfolio')
    expect(page.text()).toContain('Published Aug 8, 2026')
    expect(page.find('a[href="/projects/portfolio"]').exists()).toBe(true)
  })

  it('does not show archived projects', async () => {
    const page = await mountSuspended(ProjectsPage)

    expect(page.text()).not.toContain('K8s Auto-Scaler')
    expect(page.find('a[href="/projects/k8s-auto-scaler"]').exists()).toBe(false)
  })

  it('renders Markdown projects on the homepage', async () => {
    const page = await mountSuspended(HomePage)
    const cards = page.findAll('.project-card')

    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('href')).toBe('/projects/portfolio')
    expect(page.text()).toContain('Published Aug 8, 2026')
    expect(page.find('a[href="/projects/portfolio"]').exists()).toBe(true)
  })

  it('links each generated card to its Markdown detail route', async () => {
    const page = await mountSuspended(ProjectsPage)

    expect(page.find('a[href="/projects/portfolio"]').attributes('href')).toBe('/projects/portfolio')
  })

  it('parses the AI use metadata from project Markdown', () => {
    const source = readFileSync(join(contentDirectory, 'portfolio.nl.md'), 'utf8')

    expect(parseProjectMarkdown(source).AiUse).toBe('Design en Development')
  })

  it('preserves the visible body text from every Markdown file', () => {
    expect(markdownFiles.length).toBeGreaterThan(0)

    for (const filePath of markdownFiles) {
      const source = readFileSync(filePath, 'utf8')
      const parsed = parseProjectMarkdown(source)
      const renderedText = parsed.contentBlocks
        .map((block) => block.type === 'list' ? block.items.join('\n') : block.content)
        .join('\n')
        .replace(/\s+/g, ' ')

      const body = source.replace(/^---\n[\s\S]*?\n---\n?/, '')
      for (const line of body.split('\n').map((line) => line.trim()).filter(Boolean)) {
        const visibleLine = line
          .replace(/^#{1,3}\s+/, '')
          .replace(/^-\s+/, '')
          .replace(/^```(?:\w+)?$/, '')
          .replace(/\s+/g, ' ')
        if (!visibleLine) continue
        expect(renderedText, filePath).toContain(visibleLine)
      }
    }
  })
})
