<template>
  <div class="projects-page">
    <section aria-labelledby="projects-title">
      <div class="section-heading">
        <h1 id="projects-title">{{ t('featuredProjects') }}</h1>
        <span>ls -la /projects</span>
        <label class="sort-control">
          <span>Sort by</span>
          <select v-model="sortOrder" aria-label="Sort projects">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <div v-if="projects.length" class="project-grid">
        <NuxtLink v-for="project in projects" :key="project.slug" class="project-card" :to="`/projects/${project.slug}`">
          <div class="project-topline">
            <span class="project-label">{{ project.label }}</span>
            <Icon name="lucide:external-link" aria-hidden="true" />
          </div>
          <h2>{{ project.title }}</h2>
          <p class="project-published">Published {{ formatPublishedDate(project.publishedOn) }}</p>
          <p>{{ project.summary }}</p>
          <div class="tag-list">
            <span v-for="technology in project.stack" :key="technology">{{ technology }}</span>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="empty-state">No project files found.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { compareProjectsByPublishedDate, isArchivedProjectPath, parseProjectMarkdown, projectLocaleFromPath, projectMatchesLocale, projectSlugFromPath } from '~/utils/project-content'

const { locale, t } = useI18n()
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const sortOrder = ref('newest')

const projectFiles = import.meta.glob('../../../content/projects/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const projects = computed(() => {
  const paths = Object.keys(projectFiles).filter((path) => !isArchivedProjectPath(path))
  const slugs = [...new Set(paths.map(projectSlugFromPath))]

  const projects = slugs.map((slug) => {
    const filePath = paths.find((path) => projectSlugFromPath(path) === slug && projectMatchesLocale(path, locale.value))
      ?? paths.find((path) => projectSlugFromPath(path) === slug && !projectLocaleFromPath(path))

    return {
      slug,
      ...parseProjectMarkdown(filePath ? projectFiles[filePath] : '')
    }
  })

  if (sortOrder.value === 'oldest') return projects.sort((left, right) => compareProjectsByPublishedDate(right, left))
  if (sortOrder.value === 'title') return projects.sort((left, right) => left.title.localeCompare(right.title))
  return projects.sort(compareProjectsByPublishedDate)
})

function formatPublishedDate(date) {
  return date ? dateFormatter.format(new Date(`${date}T00:00:00`)) : ''
}
</script>

<style scoped>
.projects-page {
  width: min(calc(100% - 48px), 1200px);
  margin: 0 auto;
  padding: 48px 0 70px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding-bottom: 16px;
}

.section-heading h1 {
  color: var(--color-primary);
  font: 600 32px/1.2 var(--font-mono);
}

.section-heading span {
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  background: var(--color-surface-container-high);
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
}

.sort-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  color: var(--color-on-surface-variant);
  font: 14px/1.4 var(--font-mono);
}

.sort-control select {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  background: var(--color-surface-container-high);
  color: var(--color-on-surface);
  font: inherit;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.project-card {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 24px;
  background: var(--color-surface-container-low);
  color: inherit;
  text-decoration: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.project-card:hover,
.project-card:focus-visible {
  border-color: var(--color-tertiary);
  box-shadow: 0 0 15px rgba(78, 222, 163, 0.12);
}

.project-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: var(--color-on-surface-variant);
}

.project-topline :deep(svg) {
  width: 18px;
  height: 18px;
}

.project-label {
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.08em;
}

.project-card h2 {
  color: var(--color-on-surface);
  font: 600 24px/1.3 var(--font-mono);
}

.project-card p {
  margin: 0;
  color: var(--color-on-surface-variant);
  font-size: 16px;
  line-height: 1.5;
}

.project-card .project-published {
  margin-top: -8px;
  color: var(--color-tertiary);
  font: 14px/1.4 var(--font-mono);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
}

.tag-list span {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
  color: var(--color-tertiary);
  font: 16px/1.2 var(--font-mono);
}

.empty-state {
  border: 1px dashed var(--color-outline-variant);
  padding: 24px;
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
}

@media (max-width: 560px) {
  .projects-page {
    width: min(calc(100% - 32px), 1200px);
    padding-top: 32px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .sort-control {
    margin-left: 0;
  }

  .section-heading h1 {
    font-size: 28px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
