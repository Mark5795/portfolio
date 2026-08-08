<template>
  <div class="privacy-page">
    <section aria-labelledby="privacy-title">
      <p class="terminal-heading" aria-hidden="true">&gt; PRIVACY_PROTOCOL</p>
      <h1 id="privacy-title">{{ t('privacyTitle') }}</h1>
      <p class="privacy-intro">{{ t('privacyIntro') }}</p>

      <div class="privacy-sections">
        <article>
          <h2>{{ t('privacyDataTitle') }}</h2>
          <p>{{ t('privacyDataText') }}</p>
        </article>
        <article>
          <h2>{{ t('privacyCookiesTitle') }}</h2>
          <p>{{ t('privacyCookiesText') }}</p>
        </article>
        <article>
          <h2>{{ t('privacyExternalTitle') }}</h2>
          <p>{{ t('privacyExternalText') }}</p>
        </article>
        <article>
          <h2>{{ t('privacyContactTitle') }}</h2>
          <p>{{ t('privacyContactText') }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.privacy-page {
  width: min(calc(100% - 48px), 900px);
  margin: 0 auto;
  padding: 48px 0 70px;
}

.terminal-heading {
  margin: 0 0 12px;
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  color: var(--color-primary);
  font: 600 40px/1.2 var(--font-mono);
}

.privacy-intro {
  max-width: 720px;
  margin: 20px 0 40px;
  color: var(--color-on-surface-variant);
  font-size: 18px;
  line-height: 1.6;
}

.privacy-sections {
  display: grid;
  gap: 20px;
}

article {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 24px;
  background: var(--color-surface-container-low);
}

h2 {
  margin: 0 0 12px;
  color: var(--color-on-surface);
  font: 600 20px/1.3 var(--font-mono);
}

article p {
  margin: 0;
  color: var(--color-on-surface-variant);
  font-size: 16px;
  line-height: 1.7;
}

@media (max-width: 560px) {
  .privacy-page {
    width: min(calc(100% - 32px), 900px);
    padding-top: 32px;
  }

  h1 {
    font-size: 32px;
  }
}
</style>