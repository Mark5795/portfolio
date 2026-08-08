export const projectFilePattern = /^(.*?)(?:\.(en|nl))?\.md$/

const paragraphBlock = (lines) => lines.length ? [{ type: 'paragraph', content: lines.join('\n') }] : []

export const parseProjectMarkdown = (source = '') => {
  const normalizedSource = source.replaceAll('\r\n', '\n')
  const frontmatterMatch = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const metadata = {
    id: '',
    label: 'PROJECT',
    title: 'Untitled project',
    summary: '',
    status: '',
    role: '',
    publishedOn: '',
    AiUse: '',
    stack: ''
  }
  const body = frontmatterMatch?.[2] ?? normalizedSource

  for (const line of frontmatterMatch?.[1]?.split('\n') ?? []) {
    const separator = line.indexOf(':')
    if (separator > 0) {
      Object.assign(metadata, {
        [line.slice(0, separator).trim()]: line.slice(separator + 1).trim()
      })
    }
  }

  const contentBlocks = body
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n')
      if (lines.every((line) => line.startsWith('- '))) {
        return { type: 'list', items: lines.map((line) => line.slice(2)) }
      }
      if (lines[0]?.startsWith('### ')) return [{ type: 'heading', content: lines[0].slice(4) }, ...paragraphBlock(lines.slice(1))]
      if (lines[0]?.startsWith('## ')) return [{ type: 'heading', content: lines[0].slice(3) }, ...paragraphBlock(lines.slice(1))]
      if (lines[0]?.startsWith('# ')) return [{ type: 'heading', content: lines[0].slice(2) }, ...paragraphBlock(lines.slice(1))]
      if (lines[0]?.startsWith('```')) return { type: 'code', content: lines.slice(1, -1).join('\n') }
      return { type: 'paragraph', content: lines.join('\n') }
    })
    .flat()

  return {
    ...metadata,
    contentBlocks,
    stack: metadata.stack.split(',').map((item) => item.trim()).filter(Boolean)
  }
}

export const projectSlugFromPath = (filePath) => {
  const fileName = filePath.split('/').pop() ?? ''
  return fileName.match(projectFilePattern)?.[1] ?? ''
}

export const projectLocaleFromPath = (filePath) => filePath.match(projectFilePattern)?.[2] ?? ''

export const isArchivedProjectPath = (filePath) => filePath.split('/').includes('archive')

export const projectMatchesLocale = (filePath, locale) => {
  const normalizedLocale = String(locale).split('-')[0]
  return projectLocaleFromPath(filePath) === normalizedLocale
}

export const compareProjectsByPublishedDate = (left, right) => {
  const leftDate = Date.parse(`${left.publishedOn}T00:00:00`) || 0
  const rightDate = Date.parse(`${right.publishedOn}T00:00:00`) || 0

  return rightDate - leftDate || left.slug.localeCompare(right.slug)
}
