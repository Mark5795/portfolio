import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import PrivacyPage from '../../app/pages/privacy.vue'

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
})
