<template>
  <div v-if="isShutdown" class="shutdown-screen" role="dialog" aria-modal="true" aria-labelledby="shutdown-title">
    <div class="shutdown-content">
      <template v-if="isBooting">
        <Icon class="boot-icon" name="lucide:loader-circle" aria-hidden="true" />
        <p class="shutdown-kicker">SYSTEM STARTUP</p>
        <h2 id="shutdown-title">Booting system...</h2>
        <div class="boot-log" aria-live="polite">
          <p v-for="(line, index) in bootLines" :key="`${index}-${line}`">{{ line }}</p>
        </div>
      </template>
      <template v-else-if="isShuttingDown">
        <Icon class="shutdown-icon" name="lucide:loader-circle" aria-hidden="true" />
        <p class="shutdown-kicker">SYSTEM SHUTDOWN</p>
        <h2 id="shutdown-title">Shutting down...</h2>
        <div class="boot-log shutdown-log" aria-live="polite">
          <p v-for="(line, index) in shutdownLines" :key="`${index}-${line}`">{{ line }}</p>
        </div>
      </template>
      <template v-else>
        <Icon name="lucide:power" aria-hidden="true" />
        <p class="shutdown-kicker">SYSTEM SHUTDOWN</p>
        <h2 id="shutdown-title">Website offline.</h2>
        <p class="shutdown-message">All processes have been politely asked to stop.</p>
        <button class="boot-button" type="button" @click="bootSystem">BOOT_SYSTEM</button>
      </template>
    </div>
  </div>

  <div v-else-if="terminalOpen" class="terminal-backdrop" @click.self="closeTerminal">
    <section class="terminal-window" role="dialog" aria-modal="true" aria-labelledby="terminal-title">
      <div class="terminal-header">
        <div>
          <span class="terminal-dot" aria-hidden="true" />
          <span id="terminal-title">MARK@SYS_PORTFOLIO:~</span>
        </div>
        <button class="terminal-close" type="button" aria-label="Close terminal" @click="closeTerminal">
          <Icon name="lucide:x" aria-hidden="true" />
        </button>
      </div>

      <div class="terminal-output" aria-live="polite">
        <p v-for="(line, index) in terminalOutput" :key="`${index}-${line}`" :class="{ 'terminal-success': index === 0 }">{{ line }}</p>
      </div>

      <form class="terminal-form" @submit.prevent="runCommand">
        <label for="terminal-command">root@sys_portfolio:~#</label>
        <input id="terminal-command" ref="terminalInput" v-model="terminalCommand" autocomplete="off" spellcheck="false" aria-label="Terminal command">
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])
const terminalOpen = computed(() => props.open)
const isShutdown = ref(false)
const isBooting = ref(false)
const isShuttingDown = ref(false)
const bootLines = ref([''])
const shutdownLines = ref([''])
const terminalCommand = ref('')
const terminalInput = ref<HTMLInputElement | null>(null)
const terminalOutput = ref([
  'ACCESS GRANTED. Welcome, curious human.',
  'Type "help" for available commands.'
])

function openTerminal() {
  nextTick(() => terminalInput.value?.focus())
}

function closeTerminal() {
  emit('update:open', false)
  terminalCommand.value = ''
}

function runCommand() {
  const command = terminalCommand.value.trim().toLowerCase()
  terminalCommand.value = ''

  if (!command) return

  const responses = {
    help: 'help  about  status  shutdown  clear  exit',
    about: 'A portfolio powered by curiosity, caffeine, and clean deploys.',
    status: 'SYSTEMS NOMINAL. Creativity engine: ONLINE.',
    'sudo make me a sandwich': 'Nice try. Try "about" instead.',
    hello: 'Hello, operator. The terminal says hi back.',
    '42': 'The answer checks out. The question is still compiling.'
  }

  if (command === 'clear') {
    terminalOutput.value = []
    return
  }

  if (command === 'exit') {
    closeTerminal()
    return
  }

  if (command === 'shutdown') {
    isShutdown.value = true
    isShuttingDown.value = true
    shutdownLines.value = []
    startShutdown()
    return
  }

  const response = Object.entries(responses).find(([key]) => key === command)?.[1] ?? `command not found: ${command}`
  terminalOutput.value.push(`root@sys_portfolio:~# ${command}`, response)
}

function startShutdown() {
  const steps = [
    '[ OK ] Saving terminal session',
    '[ OK ] Stopping portfolio services',
    '[ OK ] Closing network connections',
    '[ OK ] Flushing system cache',
    '[ OK ] Power state: OFFLINE'
  ]
  let stepIndex = 0

  const showNextStep = () => {
    shutdownLines.value.push(steps[stepIndex] || '[ OK ] Power state: OFFLINE')
    stepIndex += 1

    if (stepIndex < steps.length) {
      shutdownTimer = setTimeout(showNextStep, 420)
      return
    }

    shutdownTimer = setTimeout(() => {
      isShuttingDown.value = false
    }, 650)
  }

  showNextStep()
}

function bootSystem() {
  isBooting.value = true
  bootLines.value = []

  const steps = [
    '[ OK ] Restoring system memory',
    '[ OK ] Initializing network interface',
    '[ OK ] Mounting creative filesystem',
    '[ OK ] Starting portfolio services',
    '[ OK ] Establishing secure connection'
  ]
  let stepIndex = 0

  const showNextStep = () => {
    bootLines.value.push(steps[stepIndex] || '[ OK ] System ready')
    stepIndex += 1

    if (stepIndex < steps.length) {
      bootTimer = setTimeout(showNextStep, 420)
      return
    }

    bootTimer = setTimeout(() => {
      isBooting.value = false
      isShutdown.value = false
      terminalOutput.value = [
        'BOOT COMPLETE. Welcome back, operator.',
        'Type "help" for available commands.'
      ]
      nextTick(() => terminalInput.value?.focus())
    }, 700)
  }

  showNextStep()
}

let bootTimer = setTimeout(() => undefined, 0)
let shutdownTimer = setTimeout(() => undefined, 0)

const handleEscape = (event = new Event('keydown')) => {
  if ('key' in event && event.key === 'Escape' && terminalOpen.value && !isShutdown.value) closeTerminal()
}

watch(() => props.open, (isOpen) => {
  if (isOpen) openTerminal()
})
onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => {
  clearTimeout(bootTimer)
  clearTimeout(shutdownTimer)
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.terminal-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(1, 15, 31, 0.72);
  backdrop-filter: blur(6px);
}

.shutdown-screen {
  position: fixed;
  z-index: 110;
  inset: 0;
  display: grid;
  place-items: center;
  background: #010f1f;
  color: var(--color-on-surface, #d4e4fa);
  animation: shutdown-fade 500ms ease-out;
}

.shutdown-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  text-align: center;
}

.shutdown-content :deep(svg) {
  width: 48px;
  height: 48px;
  color: var(--color-tertiary, #4edea3);
  filter: drop-shadow(0 0 12px rgba(78, 222, 163, 0.5));
}

.shutdown-content .boot-icon {
  animation: boot-spin 1.2s linear infinite;
}

.shutdown-content .shutdown-icon {
  animation: shutdown-pulse 900ms ease-in-out infinite alternate;
}

.shutdown-kicker {
  margin: 0;
  color: var(--color-tertiary, #4edea3);
  font: 700 16px/1.2 var(--font-mono, "JetBrains Mono", monospace);
  letter-spacing: 0.12em;
}

.shutdown-content h2 {
  margin: 0;
  font: 600 32px/1.2 var(--font-mono, "JetBrains Mono", monospace);
}

.shutdown-message {
  max-width: 480px;
  margin: 0;
  color: var(--color-on-surface-variant, #c6c6cd);
  font: 16px/1.5 var(--font-sans, Inter, sans-serif);
}

.boot-log {
  width: min(100%, 480px);
  border: 1px solid var(--color-outline-variant, #45464d);
  padding: 12px 16px;
  background: rgba(1, 15, 31, 0.72);
  color: var(--color-tertiary, #4edea3);
  text-align: left;
  font: 16px/1.6 var(--font-mono, "JetBrains Mono", monospace);
}

.boot-log p {
  margin: 0;
}

.shutdown-log {
  color: var(--color-on-surface-variant, #c6c6cd);
}

.boot-button {
  margin-top: 8px;
  border: 1px solid var(--color-tertiary, #4edea3);
  border-radius: var(--radius-sm, 0.125rem);
  padding: 12px 16px;
  background: transparent;
  color: var(--color-tertiary, #4edea3);
  font: 700 16px/1.2 var(--font-mono, "JetBrains Mono", monospace);
}

.boot-button:hover,
.boot-button:focus-visible {
  background: rgba(78, 222, 163, 0.12);
  box-shadow: 0 0 12px rgba(78, 222, 163, 0.24);
}

.terminal-window {
  width: min(100%, 640px);
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid var(--color-outline-variant, #45464d);
  border-radius: var(--radius-md, 0.375rem);
  background: var(--color-surface-container-lowest, #010f1f);
  box-shadow: 0 0 24px rgba(78, 222, 163, 0.16);
}

.terminal-header,
.terminal-header > div,
.terminal-form {
  display: flex;
  align-items: center;
}

.terminal-header {
  justify-content: space-between;
  border-bottom: 1px solid var(--color-outline-variant, #45464d);
  padding: 12px 16px;
  color: var(--color-on-surface-variant, #c6c6cd);
  font: 16px/1.4 var(--font-mono, "JetBrains Mono", monospace);
}

.terminal-header > div {
  gap: 8px;
}

.terminal-dot {
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  background: var(--color-tertiary, #4edea3);
  box-shadow: 0 0 8px rgba(78, 222, 163, 0.7);
}

.terminal-close {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--color-on-surface-variant, #c6c6cd);
}

.terminal-close:hover,
.terminal-close:focus-visible {
  color: var(--color-tertiary, #4edea3);
}

.terminal-close :deep(svg) {
  width: 18px;
  height: 18px;
}

.terminal-output {
  min-height: 180px;
  max-height: 300px;
  overflow-y: auto;
  padding: 20px 16px;
  color: var(--color-on-surface-variant, #c6c6cd);
  font: 16px/1.6 var(--font-mono, "JetBrains Mono", monospace);
}

.terminal-output p {
  margin: 0 0 8px;
  overflow-wrap: anywhere;
}

.terminal-output .terminal-success {
  color: var(--color-tertiary, #4edea3);
}

.terminal-form {
  gap: 8px;
  border-top: 1px solid var(--color-outline-variant, #45464d);
  padding: 12px 16px;
  color: var(--color-tertiary, #4edea3);
  font: 16px/1.5 var(--font-mono, "JetBrains Mono", monospace);
}

.terminal-form label {
  flex: 0 0 auto;
}

.terminal-form input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-on-surface, #d4e4fa);
  font: inherit;
}

@media (max-width: 560px) {
  .terminal-backdrop {
    align-items: center;
    padding: 8px;
  }

  .terminal-window {
    width: 100%;
    max-height: calc(100vh - 16px);
  }

  .terminal-header > div {
    min-width: 0;
    flex: 1;
  }

  .terminal-header > div span:last-child {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .terminal-output {
    min-height: 140px;
    max-height: min(260px, 38vh);
    padding: 16px 12px;
  }

  .terminal-form {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
  }

  .terminal-form input {
    width: 100%;
    box-sizing: border-box;
  }

  .shutdown-content h2 {
    font-size: 28px;
  }
}

@keyframes shutdown-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes boot-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shutdown-pulse {
  from {
    opacity: 0.45;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
