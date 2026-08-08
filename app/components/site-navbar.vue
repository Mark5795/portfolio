<template>
  <header class="site-header">
    <nav class="site-nav" aria-label="Main navigation">
      <NuxtLink class="brand" to="/" :aria-label="`Sys Portfolio ${t('home')}`">SYS_PORTFOLIO - MARK KEA</NuxtLink>

      <div class="nav-actions">
        <div class="nav-links">
          <NuxtLink class="nav-link" active-class="nav-link-active" to="/">{{ t('home') }}</NuxtLink>
          <NuxtLink class="nav-link" active-class="nav-link-active" to="/projects">{{ t('projects') }}</NuxtLink>
          <NuxtLink class="nav-link" active-class="nav-link-active" to="/about">{{ t('about') }}</NuxtLink>
        </div>

        <div class="utility-links">
          <button class="utility-button mr-1" type="button" :aria-label="t('openTerminal')" @click="openTerminal">
            <Icon name="lucide:terminal" aria-hidden="true" size="2em" />
          </button>
          <button
            class="utility-button"
            type="button"
            :aria-label="t('openSettings')"
            :aria-expanded="settingsOpen"
            aria-controls="theme-settings"
            @click="settingsOpen = !settingsOpen"
          >
            <Icon name="lucide:settings" aria-hidden="true" size="2em" />
          </button>
        </div>

        <div v-if="settingsOpen" id="theme-settings" class="theme-settings" role="dialog" :aria-label="t('openSettings')">
          <p class="settings-title">{{ t('displayTheme') }}</p>
          <label class="theme-option">
            <input v-model="theme" type="radio" value="dark">
            <span>{{ t('darkMode') }}</span>
          </label>
          <label class="theme-option">
            <input v-model="theme" type="radio" value="light">
            <span>{{ t('lightMode') }}</span>
          </label>
          <p class="settings-title language-title">{{ t('language') }}</p>
          <label class="theme-option">
            <input :checked="locale === 'en'" type="radio" name="site-language" value="en" @change="setLocale('en')">
            <span>{{ t('english') }}</span>
          </label>
          <label class="theme-option">
            <input :checked="locale === 'nl'" type="radio" name="site-language" value="nl" @change="setLocale('nl')">
            <span>{{ t('dutch') }}</span>
          </label>
        </div>

        <button
          class="menu-button"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="t('toggleNavigation')"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <div v-if="menuOpen" id="mobile-navigation" class="mobile-navigation">
      <NuxtLink class="nav-link" active-class="nav-link-active" to="/" @click="menuOpen = false">{{ t('home') }}</NuxtLink>
      <NuxtLink class="nav-link" active-class="nav-link-active" to="/projects" @click="menuOpen = false">{{ t('projects') }}</NuxtLink>
      <NuxtLink class="nav-link" active-class="nav-link-active" to="/about" @click="menuOpen = false">{{ t('about') }}</NuxtLink>
      <div class="mobile-utility-links">
        <button class="mobile-utility-button" type="button" :aria-label="t('openTerminal')" @click="openTerminal">
          <Icon name="lucide:terminal" aria-hidden="true" />
          <span>{{ t('openTerminal') }}</span>
        </button>
        <button
          class="mobile-utility-button"
          type="button"
          :aria-label="t('openSettings')"
          :aria-expanded="settingsOpen"
          aria-controls="theme-settings"
          @click="settingsOpen = !settingsOpen"
        >
          <Icon name="lucide:settings" aria-hidden="true" />
          <span>{{ t('openSettings') }}</span>
        </button>
      </div>
    </div>

    <TerminalEasterEgg v-model:open="terminalOpen" />
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const menuOpen = ref(false)
const terminalOpen = ref(false)
const settingsOpen = ref(false)
const theme = ref('dark')
const { locale, t, setLocale } = useI18n()

function applyTheme() {
  if (!import.meta.client) return

  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('portfolio-theme', theme.value)
}

function openTerminal() {
  menuOpen.value = false
  terminalOpen.value = true
}

onMounted(() => {
  const savedTheme = localStorage.getItem('portfolio-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') theme.value = savedTheme
  applyTheme()
})

watch(theme, () => applyTheme())
</script>

<style scoped>
.site-header {
  border-bottom: 1px solid rgba(144, 144, 151, 0.24);
  padding: 0 24px;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 1200px);
  min-height: 56px;
  margin: 0 auto;
}

.brand,
.nav-link,
.utility-button {
  font-family: var(--font-mono, "JetBrains Mono", monospace);
}

.brand {
  color: var(--color-on-surface, #d4e4fa);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
}

.nav-actions,
.nav-links,
.utility-links {
  display: flex;
  align-items: center;
}

.nav-actions {
  position: relative;
  gap: 20px;
}

.nav-links {
  gap: 20px;
}

.nav-link {
  position: relative;
  padding: 21px 0 19px;
  color: var(--color-on-surface-variant, #c6c6cd);
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: 16px;
  text-decoration: none;
  transition: color 150ms ease;
}

.nav-link:hover,
.nav-link:focus-visible,
.nav-link-active {
  color: var(--color-tertiary, #4edea3);
}

.nav-link-active::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 1px;
  background: var(--color-tertiary, #4edea3);
  content: "";
}

.utility-links {
  gap: 8px;
  border-left: 1px solid var(--color-outline-variant, #45464d);
  padding-left: 16px;
}

.utility-button {
  display: inline-grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--color-on-surface-variant, #c6c6cd);
}

.utility-button:hover,
.utility-button:focus-visible {
  color: var(--color-tertiary, #4edea3);
}

.utility-button :deep(svg) {
  width: 20px;
  height: 20px;
}

.theme-settings {
  position: absolute;
  z-index: 10;
  top: 44px;
  right: 0;
  width: 180px;
  border: 1px solid var(--color-outline-variant, #45464d);
  border-radius: var(--radius-sm, 0.125rem);
  padding: 14px;
  background: var(--color-surface-container, #122131);
  box-shadow: 0 12px 24px rgba(1, 15, 31, 0.3);
}

.settings-title {
  margin: 0 0 12px;
  color: var(--color-tertiary, #4edea3);
  font: 700 16px/1.2 var(--font-mono, monospace);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--color-on-surface, #d4e4fa);
  font: 16px/1.3 var(--font-sans, sans-serif);
}

.theme-option input {
  accent-color: var(--color-secondary-container, #0566d9);
}

.menu-button,
.mobile-navigation {
  display: none;
}

@media (max-width: 560px) {
  .site-header {
    padding: 0 16px;
  }

  .site-nav {
    min-height: 52px;
  }

  .nav-actions {
    gap: 8px;
  }

  .nav-links {
    display: none;
  }

  .utility-links {
    border-left: 0;
    display: none;
    padding-left: 0;
  }

  .menu-button {
    display: inline-grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border: 1px solid var(--color-outline-variant, #45464d);
    background: transparent;
    color: var(--color-on-surface-variant, #c6c6cd);
  }

  .menu-button :deep(svg) {
    width: 18px;
    height: 18px;
  }

  .mobile-navigation {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid var(--color-outline-variant, #45464d);
    padding: 8px 0 12px;
  }

  .mobile-navigation .nav-link {
    padding: 10px 0;
  }

  .mobile-utility-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid var(--color-outline-variant, #45464d);
    margin-top: 4px;
    padding-top: 8px;
  }

  .mobile-utility-button {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    padding: 10px 0;
    background: transparent;
    color: var(--color-on-surface-variant, #c6c6cd);
    font: 16px/1.3 var(--font-sans, sans-serif);
    text-align: left;
  }

  .mobile-utility-button:hover,
  .mobile-utility-button:focus-visible {
    color: var(--color-tertiary, #4edea3);
  }

  .mobile-utility-button :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .theme-settings {
    top: 48px;
    right: -4px;
    width: min(280px, calc(100vw - 32px));
    box-sizing: border-box;
  }

}
</style>
