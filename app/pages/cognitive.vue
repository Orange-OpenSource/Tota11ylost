<!-- Tota11y Lost - Cognitive Impairment Page (Dyslexia) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'cognitive.tabTitle' })

const { t } = useI18n()
const { goToNextPage } = useNextPage()
const dyslexia = useDyslexia('.dyslexia', 500)

interface DyslexiaLink {
  label: string
  href: string
}

const links = ref<DyslexiaLink[]>([])

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}

function buildLinks() {
  links.value = shuffle([
    { label: t('cognitive.buttonLabel1'), href: '/next' },
    { label: t('cognitive.buttonLabel2'), href: '/cognitive' },
    { label: t('cognitive.buttonLabel3'), href: '/cognitive' },
    { label: t('cognitive.buttonLabel4'), href: '/cognitive' },
  ])
}

function navigate(link: DyslexiaLink) {
  if (link.href === '/cognitive') {
    // Wrong answer = reload page
    window.location.reload()
  }
  else {
    goToNextPage()
  }
}

function onHint(index: number) {
  if (index === 3) {
    dyslexia.stop()
    buildLinks() // Rebuild links without dyslexia
  }
}

onMounted(() => {
  buildLinks()
  nextTick(() => dyslexia.start())
})
</script>

<template>
  <div class="fs-hm mw-none">
    <main>
      <div class="mx-large">
        <h2 class="my-small">
          {{ $t('cognitive.descriptionHeading') }}
        </h2>
        <p class="fs-hm" v-html="$t('cognitive.descriptionText1')" />
        <p class="fs-hm ">
          {{ $t('cognitive.descriptionText2') }}
        </p>
        <p class="fs-hm ">
          {{ $t('cognitive.descriptionText3') }}
        </p>
        <h2>{{ $t('cognitive.userTypeHeading') }}</h2>
        <p class="fs-hm ">
          {{ $t('cognitive.userTypeText') }}
        </p>
        <h2>{{ $t('cognitive.rulesHeading') }}</h2>
        <ul>
          <li>{{ $t('cognitive.rule1') }}</li>
          <li>{{ $t('cognitive.rule2') }}</li>
          <li>{{ $t('cognitive.rule3') }}</li>
          <li>{{ $t('cognitive.rule4') }}</li>
        </ul>

        <h2 id="skip">
          {{ $t('cognitive.buttonsHeading') }}
        </h2>
        <div>
          <button
            v-for="(link, i) in links"
            :key="i"
            class="btn btn-brand m-small dyslexia fs-hs p-small"
            role="link"
            @click="navigate(link)"
          >
            {{ link.label }}
          </button>
        </div>

        <GameHints page-id="cognitive" large-text @hint="onHint" />
      </div>
    </main>
  </div>
</template>
