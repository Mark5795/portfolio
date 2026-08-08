<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="copyright">© 2026 MARK KEA. {{ t('allRightsReserved') }}</p>

      <nav class="footer-links" :aria-label="t('projects')">
        <a href="https://www.linkedin.com/in/markkea/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/Mark5795" target="_blank" rel="noreferrer">GitHub</a>
        <a href="/source">{{ t('sourceCode') }}</a>
        <a href="/privacy">{{ t('privacy') }}</a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid rgba(144, 144, 151, 0.24);
  background: rgba(1, 15, 31, 0.58);
  color: var(--color-on-surface-variant, #c6c6cd);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(calc(100% - 48px), 1200px);
  min-height: 70px;
  margin: 0 auto;
  gap: 24px;
}

.copyright,
.footer-links {
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 16px;
  line-height: 1.4;
}

.copyright {
  margin: 0;
  color: var(--color-on-surface-variant, #c6c6cd);
  letter-spacing: 0.04em;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 20px;
}

.footer-links a {
  color: var(--color-on-surface-variant, #c6c6cd);
  text-decoration: underline;
  text-decoration-color: var(--color-outline-variant, #45464d);
  text-underline-offset: 3px;
  transition: color 150ms ease, text-decoration-color 150ms ease;
}

.footer-links a:hover,
.footer-links a:focus-visible {
  color: var(--color-tertiary, #4edea3);
  text-decoration-color: var(--color-tertiary, #4edea3);
}

@media (max-width: 600px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
    width: min(calc(100% - 32px), 1200px);
    padding: 18px 0;
  }

  .footer-links {
    justify-content: flex-start;
    gap: 12px 16px;
  }
}
</style>
