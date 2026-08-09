import type { Ref } from 'vue'

export type ProjectComment = {
  id: number
  name: string
  message: string
  createdAt: string
  approved: boolean
}

type Turnstile = {
  render: (element: HTMLElement, options: { sitekey: string; action: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string
  reset: (widgetId?: string) => void
}

export async function useProjectComments(slug: string, turnstileContainer: Ref<HTMLElement | null>) {
  const { locale } = useI18n()
  const commentName = ref('')
  const commentMessage = ref('')
  const turnstileToken = ref('')
  const turnstileWidgetId = ref<string>()
  const submitting = ref(false)
  const submitted = ref(false)
  const submitError = ref('')
  let turnstileInterval: number | undefined

  function renderTurnstile() {
    const turnstile = (window as typeof window & { turnstile?: Turnstile }).turnstile
    if (!turnstile || !turnstileContainer.value || turnstileWidgetId.value) return

    turnstileWidgetId.value = turnstile.render(turnstileContainer.value, {
      sitekey: '0x4AAAAAAELNUIRUK26rYuC6',
      action: 'turnstile-spin-v2',
      callback: (token) => { turnstileToken.value = token },
      'expired-callback': () => { turnstileToken.value = '' },
      'error-callback': () => { turnstileToken.value = '' },
    })
  }

  onMounted(() => {
    turnstileInterval = window.setInterval(() => {
      renderTurnstile()
      if (turnstileWidgetId.value && turnstileInterval) {
        window.clearInterval(turnstileInterval)
        turnstileInterval = undefined
      }
    }, 100)
  })

  onBeforeUnmount(() => {
    if (turnstileInterval) window.clearInterval(turnstileInterval)
  })

  const { data: commentsData, pending: commentsPending, error: commentsError, refresh: refreshComments } = await useFetch<{ comments: ProjectComment[] }>(`/api/comments/${slug}`)
  const comments = computed(() => commentsData.value?.comments || [])

  async function submitComment() {
    if (!turnstileToken.value || submitting.value) return

    submitting.value = true
    submitted.value = false
    submitError.value = ''

    try {
      await $fetch(`/api/comments/${slug}`, {
        method: 'POST',
        body: {
          name: commentName.value,
          message: commentMessage.value,
          'cf-turnstile-response': turnstileToken.value,
        },
      })
      commentMessage.value = ''
      submitted.value = true
      await refreshComments()
    } catch {
      submitError.value = 'The comment could not be posted. Please try again.'
    } finally {
      submitting.value = false
      turnstileToken.value = ''
      const turnstile = (window as typeof window & { turnstile?: Turnstile }).turnstile
      if (turnstile && turnstileWidgetId.value) turnstile.reset(turnstileWidgetId.value)
    }
  }

  function formatCommentDate(date: string) {
    return new Intl.DateTimeFormat(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  return {
    comments,
    commentsPending,
    commentsError,
    commentName,
    commentMessage,
    turnstileToken,
    turnstileContainer,
    submitting,
    submitted,
    submitError,
    submitComment,
    formatCommentDate,
  }
}
