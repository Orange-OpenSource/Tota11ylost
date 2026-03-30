import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/max-attributes-per-line': ['warn', { singleline: 3, multiline: 1 }],
  },
})
