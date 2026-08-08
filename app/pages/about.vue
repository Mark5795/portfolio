<template>
  <div class="about-page">
    <main class="about-main">
      <section class="about-intro" aria-labelledby="about-title">
        <p class="terminal-heading" aria-hidden="true">&gt; <span>{{ t('overMe') }}</span></p>
        <h1 id="about-title" class="sr-only">{{ t('overMe') }}</h1>
        <article class="intro-card">
          <p>{{ t('aboutDescription') }}</p>
          <div class="tag-list" :aria-label="t('specializations')">
            <span>Linux/Unix</span>
            <span>Kubernetes</span>
            <span>CI/CD Pipeline</span>
            <span>Python/Bash</span>
          </div>
        </article>

        <section class="setup-section" aria-labelledby="setup-title">
          <p class="section-heading"><span aria-hidden="true">&gt;</span> <span id="setup-title">{{ t('currentSetup') }}</span></p>
          <div class="setup-grid">
            <article class="setup-card">
              <h2><Icon name="lucide:cpu" aria-hidden="true" /> HARDWARE_SPECS</h2>
              <dl>
                <div><dt>[CPU]</dt><dd>AMD Ryzen 9 7950X</dd></div>
                <div><dt>[RAM]</dt><dd>64GB DDR5-6000</dd></div>
                <div><dt>[GPU]</dt><dd>NVIDIA RTX 4080</dd></div>
                <div><dt>[STORAGE]</dt><dd>2TB NVMe Gen4</dd></div>
                <div><dt>[MONITOR]</dt><dd>2x 27&quot; 4K IPS</dd></div>
              </dl>
            </article>
            <article class="setup-card">
              <h2><Icon name="lucide:code" aria-hidden="true" /> SOFTWARE_ENV</h2>
              <dl>
                <div><dt>[OS]</dt><dd>Arch Linux / i3wm</dd></div>
                <div><dt>[EDITOR]</dt><dd>Neovim (LunaVim)</dd></div>
                <div><dt>[TERMINAL]</dt><dd>Alacritty + Tmux</dd></div>
                <div><dt>[SHELL]</dt><dd>Zsh (Powerlevel10k)</dd></div>
                <div><dt>[BROWSER]</dt><dd>Firefox Developer</dd></div>
              </dl>
            </article>
          </div>
        </section>
      </section>

      <aside class="contact-panel" aria-labelledby="contact-title">
        <!-- <p class="terminal-heading" aria-hidden="true">&gt;</p>
        <h2 id="contact-title">{{ t('initializeContact') }}</h2>
        <form class="contact-form" @submit.prevent="submitContact">
          <label for="contact-name">{{ t('nameLabel') }}</label>
          <input id="contact-name" v-model="contactName" type="text" :placeholder="t('namePlaceholder')" required>

          <label for="contact-email">{{ t('emailLabel') }}</label>
          <input id="contact-email" v-model="contactEmail" type="email" placeholder="email@domain.com" required>

          <label for="contact-message">{{ t('messageLabel') }}</label>
          <textarea id="contact-message" v-model="contactMessage" rows="4" :placeholder="t('messagePlaceholder')" required />

          <button class="technical-button technical-button-primary" type="submit">
            <Icon name="lucide:send" aria-hidden="true" />
            {{ submitted ? t('transmissionSent') : t('executeSend') }}
          </button>
          <p v-if="submitted" class="form-status" role="status">{{ t('messageQueued') }}</p>
        </form> -->

        <div class="external-links">
          <p>{{ t('externalLinks') }}</p>
          <div>
            <a href="https://github.com/Mark5795" target="_blank" rel="noreferrer"><Icon name="lucide:github" aria-hidden="true" /> GitHub</a>
            <a href="https://www.linkedin.com/in/markkea/" target="_blank" rel="noreferrer"><Icon name="lucide:linkedin" aria-hidden="true" /> LinkedIn</a>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const contactName = ref('')
const contactEmail = ref('')
const contactMessage = ref('')
const submitted = ref(false)
const { t } = useI18n()

function submitContact() {
  submitted.value = true
}
</script>

<style scoped>
.about-page {
  width: min(calc(100% - 48px), 1200px);
  margin: 0 auto;
  padding: 48px 0 70px;
}

.about-main {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: 32px;
}

.about-intro {
  min-width: 0;
}

.terminal-heading,
.section-heading {
  margin: 0 0 16px;
  color: var(--color-primary);
  font: 600 32px/1.2 var(--font-mono);
}

.terminal-heading span,
.section-heading span:last-child {
  margin-left: 12px;
}

.intro-card,
.setup-card,
.contact-form {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  background: var(--color-surface-container-low);
}

.intro-card {
  padding: 24px;
}

.intro-card p {
  margin: 0;
  color: var(--color-on-surface);
  font-size: 16px;
  line-height: 1.6;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tag-list span {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
  color: var(--color-tertiary);
  font: 16px/1.2 var(--font-mono);
}

.setup-section {
  margin-top: 36px;
}

.setup-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.setup-card {
  padding: 20px;
}

.setup-card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--color-outline-variant);
  padding-bottom: 12px;
  color: var(--color-on-surface-variant);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.06em;
}

.setup-card h2 :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.setup-card dl {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
}

.setup-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--color-on-surface);
  font: 16px/1.4 var(--font-mono);
}

.setup-card dt {
  color: var(--color-on-surface-variant);
}

.setup-card dd {
  margin: 0;
  text-align: right;
}

.contact-panel {
  min-width: 0;
  border-left: 1px solid var(--color-outline-variant);
  padding-left: 32px;
}

.contact-panel .terminal-heading {
  margin-bottom: 0;
}

.contact-panel h2 {
  margin: 0 0 16px;
  color: var(--color-primary);
  font: 600 32px/1.2 var(--font-mono);
  overflow-wrap: anywhere;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.contact-form label,
.external-links > p {
  color: var(--color-on-surface-variant);
  font: 700 16px/1.2 var(--font-mono);
  letter-spacing: 0.06em;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-outline-variant);
  padding: 11px 12px;
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font: 16px/1.4 var(--font-mono);
}

.contact-form textarea {
  resize: vertical;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--color-secondary-container);
  outline: 2px solid color-mix(in srgb, var(--color-secondary-container) 35%, transparent);
  outline-offset: 1px;
}

.contact-form .technical-button {
  justify-content: center;
  margin-top: 12px;
}

.technical-button :deep(svg),
.external-links a :deep(svg) {
  width: 18px;
  height: 18px;
}

.form-status {
  margin: 2px 0 0;
  color: var(--color-tertiary);
  font: 16px/1.4 var(--font-mono);
}

.external-links {
  margin-top: 24px;
}

.external-links > p {
  margin: 0 0 12px;
}

.external-links > div {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.external-links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--color-on-surface);
  font: 16px/1.2 var(--font-mono);
  text-decoration: none;
}

.external-links a:hover,
.external-links a:focus-visible {
  border-color: var(--color-tertiary);
  color: var(--color-tertiary);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 800px) {
  .about-main {
    grid-template-columns: 1fr;
  }

  .contact-panel {
    border-top: 1px solid var(--color-outline-variant);
    border-left: 0;
    padding: 32px 0 0;
  }
}

@media (max-width: 560px) {
  .about-page {
    width: min(calc(100% - 32px), 1200px);
    padding-top: 32px;
  }

  .terminal-heading,
  .section-heading,
  .contact-panel h2 {
    font-size: 28px;
  }

  .setup-grid {
    grid-template-columns: 1fr;
  }

  .setup-card dl div {
    align-items: flex-start;
    flex-direction: column;
    gap: 2px;
  }

  .setup-card dd {
    text-align: left;
  }
}
</style>
