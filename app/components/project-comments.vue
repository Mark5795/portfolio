<template>
  <section class="comments-section" aria-labelledby="comments-title">
    <p class="section-kicker">&gt; COMMUNITY_INPUT</p>
    <h2 id="comments-title">{{ t('commentsTitle') }}</h2>

    <div v-if="commentsPending" class="comments-status" role="status">{{ t('loadingComments') }}</div>
    <div v-else-if="commentsError" class="comments-status" role="status">{{ t('commentsUnavailable') }}</div>
    <p v-else-if="!comments.length" class="comments-status">{{ t('firstComment') }}</p>
    <ol v-else class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <strong>{{ comment.name }}</strong>
          <time :datetime="comment.createdAt">{{ formatCommentDate(comment.createdAt) }}</time>
        </div>
        <p>{{ comment.message }}</p>
      </li>
    </ol>

    <form class="comment-form" @submit.prevent="submitComment">
      <div class="comment-field">
        <label for="comment-name">{{ t('commentName') }}</label>
        <input id="comment-name" v-model="commentName" type="text" maxlength="80" autocomplete="name" required>
      </div>

      <div class="comment-field">
        <label for="comment-message">{{ t('commentMessage') }}</label>
        <textarea id="comment-message" v-model="commentMessage" maxlength="2000" rows="5" required />
      </div>

      <div
        ref="turnstileContainer"
        class="cf-turnstile"
        data-sitekey="0x4AAAAAAELNUIRUK26rYuC6"
        data-action="turnstile-spin-v2"
      />

      <button class="technical-button technical-button-primary" type="submit" :disabled="submitting || !turnstileToken">
        <Icon name="lucide:send" aria-hidden="true" />
        {{ submitting ? t('sendingComment') : t('postComment') }}
      </button>
      <p v-if="submitError" class="comments-status" role="alert">{{ submitError }}</p>
    </form>

    <div v-if="submitted" class="comment-confirmation-backdrop" @click.self="closeConfirmation">
      <section class="comment-confirmation" role="alertdialog" aria-modal="true" aria-labelledby="comment-confirmation-title">
        <p class="confirmation-kicker">&gt; {{ t('commentsTitle') }}</p>
        <h2 id="comment-confirmation-title">{{ t('commentPosted') }}</h2>
        <p>{{ t('commentPostedDescription') }}</p>
        <div class="confirmation-actions">
          <button class="confirmation-button confirmation-button-primary" type="button" @click="closeConfirmation">
            {{ t('close') }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProjectComments } from '~/composables/useProjectComments'

const { t } = useI18n()
const props = defineProps<{ slug: string }>()
const turnstileContainer = ref<HTMLElement | null>(null)
const {
  comments,
  commentsPending,
  commentsError,
  commentName,
  commentMessage,
  turnstileToken,
  submitting,
  submitted,
  submitError,
  submitComment,
  formatCommentDate,
} = await useProjectComments(props.slug, turnstileContainer)

function closeConfirmation() {
  submitted.value = false
}
</script>

<style scoped>
.comments-section {
  border-top: 1px solid var(--color-outline-variant);
  padding: 28px;
}

.section-kicker {
  margin: 0 0 12px;
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.08em;
}

.comments-section h2 {
  margin: 0 0 20px;
  color: var(--color-on-surface);
  font: 600 24px/1.3 var(--font-mono);
}

.comments-status {
  margin: 0;
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
}

.comment-confirmation-backdrop {
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(1, 15, 31, 0.72);
}

.comment-confirmation {
  width: min(100%, 420px);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: 24px;
  background: var(--color-surface-container);
  box-shadow: 0 18px 48px rgba(1, 15, 31, 0.45);
}

.confirmation-kicker {
  margin: 0 0 16px;
  color: var(--color-primary);
  font: 700 14px/1.2 var(--font-mono);
  letter-spacing: 0.06em;
}

.comment-confirmation h2 {
  margin: 0;
  color: var(--color-on-surface);
  font: 700 20px/1.3 var(--font-mono);
}

.comment-confirmation > p:not(.confirmation-kicker) {
  margin: 12px 0 24px;
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-sans);
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirmation-button {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  background: transparent;
  color: var(--color-on-surface);
  font: 700 14px/1.2 var(--font-mono);
  cursor: pointer;
}

.confirmation-button:hover,
.confirmation-button:focus-visible {
  border-color: var(--color-tertiary);
  color: var(--color-tertiary);
}

.confirmation-button-primary {
  border-color: var(--color-primary);
  background: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
}

.comment-list {
  display: grid;
  gap: 12px;
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
}

.comment {
  border-left: 2px solid var(--color-tertiary);
  padding: 14px 16px;
  background: var(--color-surface-container);
}

.comment-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.comment-header strong {
  color: var(--color-primary);
  font: 700 16px/1.3 var(--font-mono);
}

.comment-header time {
  color: var(--color-on-surface-variant);
  font: 13px/1.3 var(--font-mono);
}

.comment p {
  margin: 8px 0 0;
  color: var(--color-on-surface);
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.comment-form {
  display: grid;
  gap: 16px;
  max-width: 680px;
  margin-top: 24px;
}

.comment-field {
  display: grid;
  gap: 8px;
}

.comment-form label {
  margin-top: 4px;
  color: var(--color-on-surface-variant);
  font: 700 14px/1.2 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.comment-form input,
.comment-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font: 16px/1.5 var(--font-mono);
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.comment-form input {
  min-height: 46px;
  padding: 10px 12px;
}

.comment-form textarea {
  min-height: 138px;
  padding: 13px 14px;
  resize: vertical;
}

.comment-form input::placeholder,
.comment-form textarea::placeholder {
  color: var(--color-on-surface-variant);
  opacity: 0.8;
}

.comment-form input:hover,
.comment-form textarea:hover {
  border-color: var(--color-secondary);
  background: var(--color-surface-container);
}

.comment-form input:focus,
.comment-form textarea:focus {
  border-color: var(--color-tertiary);
  outline: 2px solid color-mix(in srgb, var(--color-tertiary) 35%, transparent);
  outline-offset: 1px;
  background: var(--color-surface-container);
}

.comment-form .cf-turnstile {
  min-height: 65px;
  margin: 0 0 2px;
}

.comment-form .technical-button {
  justify-content: center;
  margin-top: 4px;
}

.comment-form .technical-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 680px) {
  .comments-section {
    padding: 20px;
  }

  .comment-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
