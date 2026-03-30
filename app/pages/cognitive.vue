<!-- Tota11y Lost - Cognitive Impairment Page (Dyslexia) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'cognitive.tabTitle' })

const { t } = useI18n()
const router = useRouter()
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
    { label: t('cognitive.buttonLabel1'), href: '/cognitive-simulation' },
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
    router.push(link.href)
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
  <div class="fs-2">
    <main>
      <div class="mx-4">
        <h2 class="my-2">
          {{ $t('cognitive.descriptionHeading') }}
        </h2>
        <p>{{ $t('cognitive.descriptionText1') }}</p>
        <p>{{ $t('cognitive.descriptionText2') }}</p>
        <p>{{ $t('cognitive.descriptionText3') }}</p>
        <h2>{{ $t('cognitive.userTypeHeading') }}</h2>
        <p>{{ $t('cognitive.userTypeText') }}</p>
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
            class="btn btn-primary m-2 dyslexia fs-3 p-2"
            role="link"
            @click="navigate(link)"
          >
            {{ link.label }}
          </button>
        </div>

        <GameHints page-id="cognitive" @hint="onHint" />
      </div>
    </main>
  </div>
</template>
