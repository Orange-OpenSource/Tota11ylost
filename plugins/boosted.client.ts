import oudsWeb from '@ouds/web-common/dist/js/ouds-web.min'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('oudsWeb', oudsWeb)
})
