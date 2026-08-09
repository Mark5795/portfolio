<template>
  <div class="project-detail-page">
    <NuxtLink class="back-link" to="/projects">
      <Icon name="lucide:arrow-left" aria-hidden="true" />
      {{ t('projects') }}
    </NuxtLink>

    <article class="detail-card">
      <header class="detail-header">
        <div>
          <p class="project-label">{{ project.label }}</p>
          <h1>{{ project.title }}</h1>
          <p class="detail-summary">{{ project.summary }}</p>
        </div>
        <span class="status"><span class="status-pip" /> {{ project.status }}</span>
      </header>

      <div class="detail-grid">
        <section aria-labelledby="overview-title">
          <p class="section-kicker">&gt; PROJECT_CONTENT</p>
          <h2 id="overview-title">{{ project.title }}</h2>
          <div class="markdown-content">
            <template v-for="(block, index) in project.contentBlocks" :key="index">
              <h3 v-if="block.type === 'heading'">{{ block.content }}</h3>
              <p v-else-if="block.type === 'paragraph'">
                <template v-for="(part, partIndex) in parseInlineMarkdown(block.content)" :key="partIndex">
                  <a v-if="part.type === 'link'" :href="part.href" target="_blank" rel="noreferrer">{{ part.content }}</a>
                  <template v-else>{{ part.content }}</template>
                </template>
              </p>
              <ul v-else-if="block.type === 'list'">
                <li v-for="item in block.items || []" :key="item">{{ item }}</li>
              </ul>
              <pre v-else><code>{{ block.content }}</code></pre>
            </template>
          </div>
        </section>

        <aside class="metadata-panel" aria-label="Project metadata">
          <div>
            <span>PROJECT_ID</span>
            <strong>{{ project.id }}</strong>
          </div>
          <div>
            <span>ROLE</span>
            <strong>{{ project.role }}</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong>{{ project.status }}</strong>
          </div>
          <div v-if="project.AiUse">
            <span>AI USE</span>
            <strong>{{ project.AiUse }}</strong>
          </div>
          <div>
            <span>PUBLISHED ON</span>
            <strong>{{ formatPublishedDate(project.publishedOn) }}</strong>
          </div>
        </aside>
      </div>

      <section class="stack-section" aria-labelledby="stack-title">
        <p class="section-kicker">&gt; TECHNOLOGY_STACK</p>
        <h2 id="stack-title">Built with</h2>
        <div class="stack-list">
          <span v-for="technology in project.stack" :key="technology">{{ technology }}</span>
        </div>
      </section>

      <footer class="detail-footer">
        <span>root@sys_portfolio:~# cat /projects/{{ route.params.slug }}</span>
        <NuxtLink class="technical-button technical-button-secondary" to="/projects">{{ t('projects') }}</NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isArchivedProjectPath, parseInlineMarkdown, parseProjectMarkdown, projectMatchesLocale, projectSlugFromPath } from '~/utils/project-content'

const route = useRoute()
const { locale, t } = useI18n()
const projectFiles = import.meta.glob('../../../content/projects/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const slug = String(route.params.slug)
const filePath = computed(() => {
  const paths = Object.keys(projectFiles).filter((path) => !isArchivedProjectPath(path))
  return paths.find((path) => projectSlugFromPath(path) === slug && projectMatchesLocale(path, locale.value))
    ?? paths.find((path) => projectSlugFromPath(path) === slug && !projectMatchesLocale(path, locale.value))
})

if (!filePath.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const project = computed(() => parseProjectMarkdown(filePath.value ? projectFiles[filePath.value] : ''))

function formatPublishedDate(date: string) {
  if (!date) return ''
  const dateFormatter = locale.value === 'nl'
    ? new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}
</script>

<style scoped>
.project-detail-page {
  width: min(calc(100% - 48px), 1000px);
  margin: 0 auto;
  padding: 48px 0 70px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: var(--color-secondary);
  font: 16px/1.4 var(--font-mono);
  text-decoration: none;
}

.back-link:hover,
.back-link:focus-visible {
  color: var(--color-tertiary);
}

.back-link :deep(svg) {
  width: 18px;
  height: 18px;
}

.detail-card {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  background: var(--color-surface-container-low);
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding: 28px;
}

.project-label,
.section-kicker {
  margin: 0 0 12px;
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.08em;
}

.detail-header h1 {
  color: var(--color-primary);
  font: 600 40px/1.2 var(--font-mono);
}

.detail-summary {
  max-width: 680px;
  margin: 16px 0 0;
  color: var(--color-on-surface-variant);
  font-size: 18px;
  line-height: 1.6;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(220px, 0.8fr);
  gap: 32px;
  padding: 28px;
}

.detail-grid h2,
.stack-section h2 {
  margin: 0 0 16px;
  color: var(--color-on-surface);
  font: 600 24px/1.3 var(--font-mono);
}

.detail-grid section > p:not(.section-kicker) {
  margin: 0 0 16px;
  color: var(--color-on-surface-variant);
  font-size: 16px;
  line-height: 1.6;
}

.markdown-content {
  color: var(--color-on-surface-variant);
  font-size: 16px;
  line-height: 1.6;
}

.markdown-content h3 {
  margin: 24px 0 10px;
  color: var(--color-on-surface);
  font: 600 20px/1.3 var(--font-mono);
}

.markdown-content h3:first-child {
  margin-top: 0;
}

.markdown-content p {
  margin: 0 0 16px;
  white-space: pre-line;
}

.markdown-content ul {
  display: grid;
  gap: 8px;
  margin: 0 0 20px;
  padding-left: 22px;
}

.markdown-content li::marker {
  color: var(--color-tertiary);
}

.markdown-content pre {
  overflow-x: auto;
  margin: 20px 0 0;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 16px;
  background: var(--color-surface-container);
  color: var(--color-tertiary);
  font: 16px/1.5 var(--font-mono);
}

.metadata-panel {
  align-self: start;
  border-left: 1px solid var(--color-outline-variant);
  padding-left: 24px;
}

.metadata-panel div {
  display: grid;
  gap: 6px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding: 12px 0;
}

.metadata-panel span {
  color: var(--color-on-surface-variant);
  font: 16px/1.2 var(--font-mono);
}

.metadata-panel strong {
  color: var(--color-on-surface);
  font: 16px/1.3 var(--font-mono);
}

.stack-section {
  border-top: 1px solid var(--color-outline-variant);
  padding: 28px;
}

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stack-list span {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: var(--color-tertiary);
  font: 16px/1.2 var(--font-mono);
}

.detail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--color-outline-variant);
  padding: 20px 28px;
  color: var(--color-on-surface-variant);
  font: 16px/1.4 var(--font-mono);
}

@media (max-width: 680px) {
  .project-detail-page {
    width: min(calc(100% - 32px), 1000px);
    padding-top: 32px;
  }

  .detail-header {
    flex-direction: column;
    padding: 20px;
  }

  .detail-header h1 {
    font-size: 30px;
  }

  .detail-summary {
    font-size: 16px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px;
  }

  .metadata-panel {
    border-top: 1px solid var(--color-outline-variant);
    border-left: 0;
    padding: 12px 0 0;
  }

  .stack-section,
  .detail-footer {
    padding: 20px;
  }

  .detail-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
