<template>
  <div class="theme-confirmation-backdrop" @click.self="emit('cancel')">
    <section class="theme-confirmation" role="alertdialog" aria-modal="true" aria-labelledby="light-mode-confirmation-title">
      <p class="confirmation-kicker">&gt; {{ t('displayTheme') }}</p>
      <h2 id="light-mode-confirmation-title">{{ t('confirmLightMode') }}</h2>
      <p>{{ t('confirmLightModeDescription') }}</p>
      <div class="confirmation-actions">
        <button class="confirmation-button confirmation-button-primary" type="button" @click="emit('confirm')">
          {{ t('confirm') }}
        </button>
        <button class="confirmation-button" type="button" @click="emit('cancel')">
          {{ t('cancel') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.theme-confirmation-backdrop {
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(1, 15, 31, 0.72);
}

.theme-confirmation {
  width: min(100%, 420px);
  border: 1px solid var(--color-primary, #4edea3);
  border-radius: var(--radius-sm, 0.125rem);
  padding: 24px;
  background: var(--color-surface-container, #122131);
  box-shadow: 0 18px 48px rgba(1, 15, 31, 0.45);
}

.confirmation-kicker {
  margin: 0 0 16px;
  color: var(--color-primary, #4edea3);
  font: 700 14px/1.2 var(--font-mono, monospace);
  letter-spacing: 0.06em;
}

.theme-confirmation h2 {
  margin: 0;
  color: var(--color-on-surface, #d4e4fa);
  font: 700 20px/1.3 var(--font-mono, monospace);
}

.theme-confirmation > p:not(.confirmation-kicker) {
  margin: 12px 0 24px;
  color: var(--color-on-surface-variant, #c6c6cd);
  font: 16px/1.5 var(--font-sans, sans-serif);
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirmation-button {
  border: 1px solid var(--color-outline-variant, #45464d);
  border-radius: var(--radius-sm, 0.125rem);
  padding: 10px 14px;
  background: transparent;
  color: var(--color-on-surface, #d4e4fa);
  font: 700 14px/1.2 var(--font-mono, monospace);
  cursor: pointer;
}

.confirmation-button:hover,
.confirmation-button:focus-visible {
  border-color: var(--color-tertiary, #4edea3);
  color: var(--color-tertiary, #4edea3);
}

.confirmation-button-primary {
  border-color: var(--color-primary, #4edea3);
  background: var(--color-secondary-container, #0566d9);
  color: var(--color-on-secondary-container, #e6ecff);
}
</style>
