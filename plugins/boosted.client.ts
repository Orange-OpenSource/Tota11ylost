import boosted from 'boosted/dist/js/boosted.min'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('boosted', boosted)
})
