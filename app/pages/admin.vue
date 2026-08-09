<template>
  <div class="admin-page">
    <section class="admin-panel" aria-labelledby="admin-title">
      <p class="section-kicker">&gt; ADMIN_CONSOLE</p>
      <h1 id="admin-title">Comment moderation</h1>

      <form v-if="!authenticated" class="admin-login" @submit.prevent="login">
        <label for="admin-password">Admin password</label>
        <input id="admin-password" v-model="password" type="password" autocomplete="current-password" required>
        <button class="technical-button technical-button-primary" type="submit" :disabled="loading">
          <Icon name="lucide:log-in" aria-hidden="true" />
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
        <p v-if="errorMessage" class="admin-message" role="alert">{{ errorMessage }}</p>
      </form>

      <div v-else class="admin-content">
        <div class="admin-toolbar">
          <p class="admin-message">{{ comments.length }} comment{{ comments.length === 1 ? '' : 's' }}</p>
          <button class="technical-button technical-button-secondary" type="button" @click="logout">
            <Icon name="lucide:log-out" aria-hidden="true" />
            Sign out
          </button>
        </div>

        <p v-if="loading" class="admin-message" role="status">Loading comments...</p>
        <p v-else-if="!comments.length" class="admin-message">No comments yet.</p>
        <ul v-else class="admin-comment-list">
          <li v-for="comment in comments" :key="comment.id" class="admin-comment">
            <div class="admin-comment-meta">
              <strong>{{ comment.name }}</strong>
              <span>{{ comment.projectSlug }}</span>
              <time :datetime="comment.createdAt">{{ formatDate(comment.createdAt) }}</time>
            </div>
            <p>{{ comment.message }}</p>
            <div class="comment-actions">
              <button v-if="!comment.approved" class="approve-button" type="button" :disabled="approvingId === comment.id" @click="acceptComment(comment.id)">
                <Icon name="lucide:check" aria-hidden="true" />
                {{ approvingId === comment.id ? 'Accepting...' : 'Accept' }}
              </button>
              <span v-else class="approved-label"><Icon name="lucide:check-circle-2" aria-hidden="true" /> Accepted</span>
              <button class="delete-button" type="button" :disabled="deletingId === comment.id || approvingId === comment.id" @click="removeComment(comment.id)">
                <Icon name="lucide:trash-2" aria-hidden="true" />
                {{ deletingId === comment.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </li>
        </ul>

        <p v-if="errorMessage" class="admin-message" role="alert">{{ errorMessage }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type AdminComment = {
  id: number
  projectSlug: string
  name: string
  message: string
  createdAt: string
  approved: boolean
}

type AdminSession = {
  configured: boolean
  authenticated: boolean
}

const password = ref('')
const authenticated = ref(false)
const configured = ref(true)
const comments = ref<AdminComment[]>([])
const loading = ref(false)
const deletingId = ref<number | null>(null)
const approvingId = ref<number | null>(null)
const errorMessage = ref('')

const session = await $fetch<AdminSession>('/api/admin/session')
authenticated.value = session.authenticated
configured.value = session.configured

if (authenticated.value) await loadComments()

async function loadComments() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await $fetch<{ comments: AdminComment[] }>('/api/admin/comments')
    comments.value = response.comments
  } catch {
    authenticated.value = false
    errorMessage.value = 'Your admin session has expired.'
  } finally {
    loading.value = false
  }
}

async function login() {
  loading.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    password.value = ''
    authenticated.value = true
    await loadComments()
  } catch {
    errorMessage.value = configured.value
      ? 'Invalid admin password.'
      : 'Admin login is not configured on the server.'
  } finally {
    loading.value = false
  }
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  authenticated.value = false
  comments.value = []
}

async function acceptComment(id: number) {
  approvingId.value = id
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: 'PATCH' })
    const comment = comments.value.find((item) => item.id === id)
    if (comment) comment.approved = true
  } catch {
    errorMessage.value = 'The comment could not be accepted.'
  } finally {
    approvingId.value = null
  }
}

async function removeComment(id: number) {
  if (!window.confirm('Delete this comment permanently?')) return

  deletingId.value = id
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    comments.value = comments.value.filter((comment) => comment.id !== id)
  } catch {
    errorMessage.value = 'The comment could not be deleted.'
  } finally {
    deletingId.value = null
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}
</script>

<style scoped>
.admin-page {
  width: min(calc(100% - 48px), 1000px);
  margin: 0 auto;
  padding: 48px 0 70px;
}

.admin-panel {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 28px;
  background: var(--color-surface-container-low);
}

.section-kicker {
  margin: 0 0 12px;
  color: var(--color-tertiary);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.08em;
}

.admin-panel h1 {
  margin: 0 0 28px;
  color: var(--color-primary);
  font: 600 32px/1.2 var(--font-mono);
}

.admin-login {
  display: grid;
  gap: 10px;
  max-width: 440px;
}

.admin-login label {
  color: var(--color-on-surface-variant);
  font: 700 14px/1.2 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.admin-login input {
  min-height: 46px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font: 16px/1.5 var(--font-mono);
}

.admin-login input:focus {
  border-color: var(--color-tertiary);
  outline: 2px solid color-mix(in srgb, var(--color-tertiary) 35%, transparent);
  outline-offset: 1px;
}

.admin-login .technical-button {
  justify-content: center;
  margin-top: 8px;
}

.admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding-bottom: 16px;
}

.admin-message {
  margin: 0;
  color: var(--color-on-surface-variant);
  font: 16px/1.5 var(--font-mono);
}

.admin-comment-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.admin-comment {
  position: relative;
  border-left: 2px solid var(--color-tertiary);
  padding: 16px 64px 16px 16px;
  background: var(--color-surface-container);
}

.admin-comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: baseline;
}

.admin-comment-meta strong {
  color: var(--color-primary);
  font: 700 16px/1.3 var(--font-mono);
}

.admin-comment-meta span,
.admin-comment-meta time {
  color: var(--color-on-surface-variant);
  font: 13px/1.3 var(--font-mono);
}

.admin-comment p {
  margin: 10px 0 0;
  color: var(--color-on-surface);
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.delete-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 7px 9px;
  background: transparent;
  color: var(--color-on-surface-variant);
  font: 13px/1.2 var(--font-mono);
  cursor: pointer;
}

.delete-button:hover,
.delete-button:focus-visible {
  border-color: #ff7b7b;
  color: #ff7b7b;
}

.delete-button:disabled {
  cursor: wait;
  opacity: 0.5;
}

.comment-actions {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.approve-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--color-tertiary);
  border-radius: var(--radius-sm);
  padding: 7px 9px;
  background: transparent;
  color: var(--color-tertiary);
  font: 13px/1.2 var(--font-mono);
  cursor: pointer;
}

.approve-button:hover,
.approve-button:focus-visible {
  background: var(--color-tertiary);
  color: var(--color-surface-container-lowest);
}

.approved-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 0;
  color: var(--color-tertiary);
  font: 13px/1.2 var(--font-mono);
}

@media (max-width: 600px) {
  .admin-page {
    width: min(calc(100% - 32px), 1000px);
    padding-top: 32px;
  }

  .admin-panel {
    padding: 20px;
  }

  .admin-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-comment {
    padding-right: 16px;
    padding-top: 54px;
  }

  .comment-actions {
    left: 16px;
    right: 16px;
    justify-content: flex-start;
  }
}
</style>
