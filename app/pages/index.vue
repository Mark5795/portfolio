<template>
  <div class="home-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-glow" aria-hidden="true" />
      <p class="terminal-line"><Icon name="lucide:terminal" aria-hidden="true" /> mark@sys_portfolio:~# ./init.sh</p>
      <h1 id="hero-title" class="hero-title">
        <span class="terminal-glow">{{ currentHeadline }}</span><span class="cursor" aria-hidden="true">_</span>
      </h1>
      <p class="hero-copy">{{ t('heroCopy') }}</p>
      <div class="hero-actions">
        <a class="technical-button technical-button-primary" href="projects">{{ t('viewProjects') }} <Icon name="lucide:arrow-right" aria-hidden="true" /></a>
        <NuxtLink class="technical-button technical-button-secondary" to="/about">{{ t('initiateContact') }}</NuxtLink>
      </div>
    </section>

    <section id="projects" class="projects-section" aria-labelledby="projects-title">
      <div class="section-heading">
        <h2 id="projects-title">{{ t('featuredProjects') }}</h2>
        <span>ls -la /projects</span>
      </div>

      <div v-if="projects.length" class="project-grid">
        <NuxtLink v-for="project in projects" :key="project.slug" class="project-card" :to="`/projects/${project.slug}`">
          <div class="project-topline">
            <span class="project-label">{{ project.label }}</span>
            <Icon name="lucide:external-link" aria-hidden="true" />
          </div>
          <h3>{{ project.title }}</h3>
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

const headlines = ['Building Software.', 'Managing People.', 'Solving Problems.', 'Managing Infrastructure.', 'Scaling Hardware.' ]
const { locale, t } = useI18n()
const currentHeadline = ref(headlines[0])
const projectFiles = import.meta.glob('../../content/projects/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const projects = computed(() => {
  const paths = Object.keys(projectFiles).filter((path) => !isArchivedProjectPath(path))
  const slugs = [...new Set(paths.map(projectSlugFromPath))]

  return slugs.map((slug) => {
    const filePath = paths.find((path) => projectSlugFromPath(path) === slug && projectMatchesLocale(path, locale.value))
      ?? paths.find((path) => projectSlugFromPath(path) === slug && !projectLocaleFromPath(path))

    return {
      slug,
      ...parseProjectMarkdown(filePath ? projectFiles[filePath] : '')
    }
  }).sort(compareProjectsByPublishedDate)
})

function formatPublishedDate(date) {
  if (!date) return ''
  const dateFormatter = locale.value === 'nl'
    ? new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}

let headlineIndex = 0
let characterIndex = 0
let deleting = false
let typewriterTimer = setTimeout(() => undefined, 0)

function typeHeadline() {
  const headline = headlines[headlineIndex] || 'Building Software.'

  if (deleting) {
    characterIndex -= 1
  } else {
    characterIndex += 1
  }

  currentHeadline.value = headline.slice(0, characterIndex)

  let delay = deleting ? 50 : 100
  if (!deleting && characterIndex === headline.length) {
    deleting = true
    delay = 2000
  } else if (deleting && characterIndex === 0) {
    deleting = false
    headlineIndex = (headlineIndex + 1) % headlines.length
    delay = 500
  }

  typewriterTimer = setTimeout(typeHeadline, delay)
}

onMounted(() => {
  clearTimeout(typewriterTimer)
  typewriterTimer = setTimeout(typeHeadline, 1000)
})

onBeforeUnmount(() => {
  clearTimeout(typewriterTimer)
})
</script>

<style scoped>
.home-page {
  width: min(calc(100% - 48px), 1200px);
  margin: 0 auto;
}

.hero {
  position: relative;
  display: flex;
  min-height: min(60vh, 640px);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  isolation: isolate;
}

.hero-glow {
  position: absolute;
  z-index: -1;
  top: 0;
  right: -10%;
  width: 60%;
  height: 80%;
  background: radial-gradient(ellipse, rgba(15, 23, 42, 0.8), transparent 70%);
  pointer-events: none;
}

.terminal-line,
.hero-copy,
.project-card p {
  color: var(--color-on-surface-variant);
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  margin: 0 0 16px;
  color: var(--color-tertiary);
  font: 16px/1.5 var(--font-mono);
  overflow-wrap: anywhere;
}

.terminal-line :deep(svg) {
  width: 16px;
  height: 16px;
}

.hero-title {
  min-height: 106px;
  margin: 0;
  color: var(--color-primary);
  font: 700 clamp(2.25rem, 5vw, 3rem)/1.1 var(--font-mono);
}

.terminal-glow {
  text-shadow: 0 0 10px rgba(78, 222, 163, 0.4);
}

.cursor {
  color: var(--color-tertiary);
  animation: blink 1s step-end infinite;
}

.hero-copy {
  max-width: 680px;
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.technical-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.technical-button :deep(svg) {
  width: 16px;
  height: 16px;
}

.projects-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 64px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding-bottom: 16px;
}

.section-heading h2 {
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

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.project-card {
  position: relative;
  display: flex;
  min-height: 280px;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 24px;
  background: var(--color-surface-container-low);
  color: inherit;
  text-decoration: none;
  transition: box-shadow 150ms ease, border-color 150ms ease;
}

.project-card:hover,
.project-card:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 15px rgba(190, 198, 224, 0.1);
}

.empty-state {
  border: 1px dashed var(--color-outline-variant);
  padding: 24px;
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
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
  overflow-wrap: anywhere;
}

.project-card h3 {
  color: var(--color-on-surface);
  font: 600 24px/1.3 var(--font-mono);
}

.project-card p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
}

.tag-list span {
  border: 1px solid rgba(69, 70, 77, 0.5);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  background: var(--color-surface-container-high);
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 700px) {
  .home-page {
    width: min(calc(100% - 32px), 1200px);
  }

  .hero {
    min-height: 460px;
    gap: 20px;
  }

  .hero-title {
    min-height: 80px;
    font-size: clamp(2.25rem, 11vw, 3rem);
  }

  .hero-copy {
    font-size: 16px;
  }

  .hero-actions {
    width: 100%;
    margin-top: 8px;
  }

  .technical-button {
    flex: 1 1 100%;
    justify-content: center;
    min-height: 48px;
    box-sizing: border-box;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .projects-section {
    gap: 24px;
    padding-bottom: 40px;
  }

  .section-heading h2 {
    font-size: 28px;
  }

  .project-card {
    min-height: 0;
    padding: 20px;
  }
}
</style>
