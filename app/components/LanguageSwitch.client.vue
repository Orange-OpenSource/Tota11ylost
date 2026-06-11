<script setup lang="ts">
type LocaleType = 'en' | 'fr' | 'es'
const { setLocale, t, locale } = useI18n({ useScope: 'global' })

const browserLang = /^fr\b/.test(navigator.language) ? 'fr' : /^es\b/.test(navigator.language) ? 'es' : 'en'
const selectedLang = (localStorage.getItem('lang') ?? browserLang) as LocaleType
setLocale(selectedLang)
document.documentElement.lang = locale.value

function toggleLang(lang: LocaleType) {
  localStorage.setItem('lang', lang)
  setLocale(lang)
  document.documentElement.lang = lang
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-always-black supra" data-bs-theme="dark" :aria-label="t('HEADER.LANG.ARIA_NABVAR')">
    <div class="container-fluid">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: locale === 'en' }"
            href="#"
            :aria-label="t('HEADER.LANG.ARIA_EN')"
            :aria-current="locale === 'en'"
            @click.prevent="toggleLang('en')"
          >
            {{ t('HEADER.LANG.EN') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: locale === 'es' }"
            href="#"
            :aria-label="t('HEADER.LANG.ARIA_ES')"
            :aria-current="locale === 'es'"
            @click.prevent="toggleLang('es')"
          >
            {{ t('HEADER.LANG.ES') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: locale === 'fr' }"
            href="#"
            :aria-label="t('HEADER.LANG.ARIA_FR')"
            :aria-current="locale === 'fr'"
            @click.prevent="toggleLang('fr')"
          >
            {{ t('HEADER.LANG.FR') }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
