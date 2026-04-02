// https://nuxt.com/docs/api/configuration/nuxt-config
import { version } from './package.json'

export default defineNuxtConfig({

  modules: [
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/test-utils',
    '@nuxt/eslint',
  ],

  // Uncomment for SPA mode
  ssr: false,

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s - Nuxt + Boosted Template',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'A template to start a new Nuxt + Boosted project' },
      ],
    },
  },

  css: [
    '~/assets/styles/main.scss',
    '~/assets/styles/game.scss',
    '~/assets/styles/game-braille.scss',
  ],

  runtimeConfig: {
    backendUrl: '/',
    public: {
      webappVersion: `${version}-dev`, // Used in the footer, and overrided by the CI/CD in STAGING / PROD (see openshift/os-pre-apply.sh)
      i18n: {
        baseUrl: 'https://localhost:3000', // Update to your production URL and if needed define a NUXT_PUBLIC_I18N_BASE_URL env variable in your CI/CD
      },
      // Firebase config for Tota11y Lost scores — set via env vars
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    },
  },

  compatibilityDate: '2025-11-12',

  nitro: {
    preset: 'static',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true, // Suppress warnings from dependencies
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
    build: {
      minify: 'esbuild',
      cssMinify: 'esbuild',
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'lang',
    locales: [
      { code: 'en', language: 'en-GB', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json' },
      { code: 'es', language: 'es-ES', file: 'es.json' },
    ],
    compilation: { strictMessage: false, escapeHtml: false }, // Allow HTML tag in message
    vueI18n: './i18n.config.ts',
  },
})
