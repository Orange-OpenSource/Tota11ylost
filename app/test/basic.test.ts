import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import index from '@/pages/index.vue'

mockNuxtImport('useHead', () => {
  return () => {
    return { value: 'mocked storage' }
  }
})

mockNuxtImport('useI18n', () => {
  return () => {
    return {
      t: (msg: string) => msg,
    }
  }
})

describe('index', () => {
  it('renders index page', () => {
    const page = mount(index, {
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    })

    // Vérifier que le contenu de la page est rendu
    expect(page.text()).toContain('HOME.WELCOME')
  })
})
