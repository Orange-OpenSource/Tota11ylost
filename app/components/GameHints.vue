<!-- Tota11y Lost - Game Hints Panel -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
const props = defineProps<{
  pageId: string
  isFormRegistration?: boolean
  delayMs?: number
  debug?: boolean
  customClass?: string
}>()

const emit = defineEmits<{
  hint: [index: number]
}>()

const hints = useHints({
  pageId: props.pageId,
  isFormRegistration: props.isFormRegistration || (props.delayMs !== undefined && props.delayMs < 10000),
  delayMs: props.delayMs,
  debug: props.debug,
  onHint: (index: number) => emit('hint', index),
})
</script>

<template>
  <div v-show="hints.hintsAvailable.value" :class="customClass">
    <h2>{{ $t('form.hintsHeading') }}</h2>
    <p role="alert">
      {{ isFormRegistration ? $t('hints.hintsAvailableNow') : $t('hints.hintsAvailable') }}
    </p>
    <div class="indicesDiv">
      <div v-for="(text, i) in hints.hintTexts.value" :key="i" role="alert">
        <h3>{{ $t(`form.hint${(i as number) + 1}Heading`) }}</h3>
        <p>{{ text }}</p>
      </div>
      <div class="my-3">
        <button
          type="button"
          class="btn fs-3 p-2 btn-primary"
          :disabled="hints.noMoreHints.value"
          @click="hints.takeHint()"
        >
          {{ hints.noMoreHints.value ? $t('hints.noMoreHints') : hints.hintButtonLabel.value }}
        </button>
      </div>
    </div>
  </div>
</template>
