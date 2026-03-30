<!-- Tota11y Lost - Visual Impairment Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'visual.tabTitle' })

const router = useRouter()
const gameStore = useGameStore()

const correctSequence = ['green-button', 'blue-button', 'red-button', 'purple-button']
const buttonDefs = ref([
  { label: 'Bouton bleu', id: 'blue-button' },
  { label: 'Bouton violet', id: 'purple-button' },
  { label: 'Bouton vert', id: 'green-button' },
  { label: 'Bouton rouge', id: 'red-button' },
])

const sequenceIndex = ref(0)
const showError = ref(false)
const colorsRevealed = ref(false)

// Shuffle buttons on mount
onMounted(() => {
  buttonDefs.value.sort(() => Math.random() - 0.5)
})

function handleButtonClick(buttonId: string) {
  if (buttonId === correctSequence[sequenceIndex.value]) {
    sequenceIndex.value++
    if (sequenceIndex.value === correctSequence.length) {
      const next = gameStore.is15Version ? '/physical' : '/visual-simulation'
      router.push(next)
    }
  }
  else {
    showError.value = true
    sequenceIndex.value = 0
    setTimeout(() => {
      showError.value = false
    }, 2000)
  }
}

function onHint(index: number) {
  if (index === 3) {
    colorsRevealed.value = true
  }
}

function getButtonClass(buttonId: string): string {
  if (!colorsRevealed.value) return 'btn-dark'
  if (buttonId.includes('blue')) return 'btn-info blue-button'
  if (buttonId.includes('purple')) return 'purple-button'
  if (buttonId.includes('green')) return 'green-button'
  if (buttonId.includes('red')) return 'red-button'
  return 'btn-dark'
}
</script>

<template>
  <div class="fs-2">
    <main>
      <div class="mx-4">
        <h2>{{ $t('visual.descriptionHeading') }}</h2>
        <p>{{ $t('visual.descriptionText1') }}</p>
        <p>{{ $t('visual.descriptionText2') }}</p>
        <h2>{{ $t('visual.userTypeHeading') }}</h2>
        <p>{{ $t('visual.userTypeDescription') }}</p>
        <h2>{{ $t('visual.rulesHeading') }}</h2>
        <ul class="grey-markers">
          <li>{{ $t('visual.rule1') }}</li>
          <li>{{ $t('visual.rule2') }}</li>
        </ul>

        <div class="my-2">
          <button
            v-for="btn in buttonDefs"
            :key="btn.id"
            class="btn m-2 fs-3 p-2"
            :class="getButtonClass(btn.id)"
            :aria-label="btn.label"
            @click="handleButtonClick(btn.id)"
          >
            {{ $t('visual.buttonsLabel') }}
          </button>
        </div>

        <div v-if="showError" class="alert alert-danger" role="alert">
          <span class="alert-icon" />
          <p>{{ $t('visual.errorMessage') }}</p>
        </div>

        <GameHints page-id="visual" @hint="onHint" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.grey-markers li::marker {
  color: grey !important;
}
</style>
