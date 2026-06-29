<!-- Tota11y Lost - Visual Impairment Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'visual.tabTitle' })
const { goToNextPage } = useNextPage()

const correctSequence = ['green-button', 'blue-button', 'red-button', 'purple-button']
const buttonDefs = ref([
  { label: $t('visual.blueButton'), id: 'blue-button' },
  { label: $t('visual.purpleButton'), id: 'purple-button' },
  { label: $t('visual.greenButton'), id: 'green-button' },
  { label: $t('visual.redButton'), id: 'red-button' },
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
      goToNextPage()
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
  <div class="fs-hm mw-none">
    <main>
      <div class="mx-large ">
        <h2>{{ $t('visual.descriptionHeading') }}</h2>
        <p class="fs-hm ">
          {{ $t('visual.descriptionText1') }}
        </p>
        <p class="fs-hm ">
          {{ $t('visual.descriptionText2') }}
        </p>
        <h2>{{ $t('visual.userTypeHeading') }}</h2>
        <p class="fs-hm ">
          {{ $t('visual.userTypeDescription') }}
        </p>
        <h2>{{ $t('visual.rulesHeading') }}</h2>
        <ul class="grey-markers">
          <li>{{ $t('visual.rule1') }}</li>
          <li>{{ $t('visual.rule2') }}</li>
        </ul>

        <div class="my-small">
          <button
            v-for="btn in buttonDefs"
            :key="btn.id"
            class="btn btn-strong m-small fs-hs p-small"
            :class="getButtonClass(btn.id)"
            :aria-label="btn.label"

            @click="handleButtonClick(btn.id)"
          >
            {{ $t('visual.buttonsLabel') }}
          </button>
        </div>

        <div v-if="showError" class="alert alert-message alert-negative" role="alert">
          <span class="alert-icon" aria-hidden="true"><p class="visually-hidden">
            Error
          </p></span>
          <div class="alert-container">
            <div class="alert-text-container">
              <p class="alert-label">
                {{ $t('visual.errorMessage') }}
              </p>
            </div>
          </div>
        </div>

        <GameHints page-id="visual" large-text @hint="onHint" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.grey-markers li::marker {
  color: grey !important;
}
.btn-dark{
    --bs-btn-bg: grey !important;
    --bs-btn-border-color: grey !important;
}
</style>
