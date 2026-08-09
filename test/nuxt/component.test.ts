import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref } from 'vue'
import PrivacyPage from '../../app/pages/privacy.vue'
import ProjectComments from '../../app/components/project-comments.vue'

vi.mock('../../app/composables/useProjectComments', () => ({
  useProjectComments: async () => ({
    comments: ref([]),
    commentsPending: ref(false),
    commentsError: ref(null),
    commentName: ref(''),
    commentMessage: ref(''),
    turnstileToken: ref(''),
    submitting: ref(false),
    submitted: ref(false),
    submitError: ref(''),
    submitComment: vi.fn(),
    formatCommentDate: (date: string) => date,
  }),
}))

describe('component test example', () => {
  it('can mount components', async () => {
    const TestComponent = defineComponent({
      setup() {
        return () => h('div', 'Hello Nuxt!')
      },
    })
    
    const component = await mountSuspended(TestComponent)
    
    expect(component.text()).toBe('Hello Nuxt!')
  })

  it('renders the privacy page content', async () => {
    const page = await mountSuspended(PrivacyPage)

    expect(page.find('h1').text()).toBe('Privacy Policy')
    expect(page.text()).toContain('Data collection')
    expect(page.text()).toContain('Cookies and storage')
  })

  it('renders the project comments form with Turnstile protection', async () => {
    const page = await mountSuspended(ProjectComments, {
      props: { slug: 'portfolio' },
    })

    expect(page.find('h2').text()).toBe('Comments')
    expect(page.text()).toContain('Be the first to comment.')
    expect(page.find('label[for="comment-name"]').exists()).toBe(true)
    expect(page.find('label[for="comment-message"]').exists()).toBe(true)
    const fields = page.findAll('.comment-field')
    expect(fields[0].find('input#comment-name').exists()).toBe(true)
    expect(fields[1].find('textarea#comment-message').exists()).toBe(true)

    const turnstile = page.find('.cf-turnstile')
    expect(turnstile.attributes('data-sitekey')).toBe('0x4AAAAAAELNUIRUK26rYuC6')
    expect(turnstile.attributes('data-action')).toBe('turnstile-spin-v2')
  })

})
