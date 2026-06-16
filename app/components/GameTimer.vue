<!-- Tota11y Lost - Game Timer Display -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
defineProps<{
  isFinal?: boolean
}>()

const { t } = useI18n()
const timer = useGameTimer()

// Builds "X minutes Y secondes" for screen readers — the visual digits use aria-hidden
const accessibleTime = computed(() => {
  const d = timer.digits.value
  const hours = d[0] ?? 0
  const minutes = ((d[1] ?? 0) * 10) + (d[2] ?? 0)
  const seconds = ((d[3] ?? 0) * 10) + (d[4] ?? 0)
  const parts: string[] = []
  if (hours > 0) parts.push(`${hours} ${t('common.time.hour.full', hours)}`)
  parts.push(`${minutes} ${t('common.time.minute.full', minutes)}`)
  parts.push(`${seconds} ${t('common.time.second.full', seconds)}`)
  return parts.join(' ')
})
</script>

<template>
  <div class="d-flex align-items-center gap-2 pe-3xlarge" :role="isFinal ? undefined : 'timer'" :aria-label="$t('common.timer.aria-label_timerArea')">
    <!-- OUDS Tag with timer icon -->
    <p
      class="tag"
      :class="isFinal ? '' : 'tag-muted'"
      :style="!isFinal ? 'background-color: var(--bs-color-always-white); color: var(--bs-color-always-black); margin-right: auto;' : 'background-color: var(--bs-color-always-black); color: var(--bs-color-always-white); margin-right: auto;'"
      :aria-label="`${t('common.timer.title')}: ${timer.displayTime}`"
    >
      <img src="/game-assets/timer.svg" alt="Chronomètre" style="width: 1.5em; height: 1.5em; display: inline-block; margin-right: 0.5em; vertical-align: middle; image-rendering: smooth;">
      {{ timer.displayTime }}
    </p>

    <!-- Screen reader accessible version -->
    <p class="visually-hidden" role="status">
      {{ accessibleTime }}
    </p>
  </div>
</template>
