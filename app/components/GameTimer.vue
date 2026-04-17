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
  <div class="d-flex align-items-center" :role="isFinal ? undefined : 'timer'" :aria-label="$t('common.timer.aria-label_timerArea')">
    <p v-if="!isFinal" class="fs-6 fw-bold text-light me-2 mb-0">
      {{ $t('common.timer.title') }}
    </p>

    <!-- Hours (if > 0) -->
    <template v-if="timer.digits.value[0]">
      <p class="fs-3 fw-bold p-1 me-1 mb-0 rounded-1" :class="isFinal ? 'bg-black text-white' : 'bg-white'" aria-hidden="true">
        {{ timer.digits.value[0] }}
      </p>
      <p class="fs-3 fw-bold me-1 mb-0" :class="isFinal ? '' : 'text-white'" aria-hidden="true">
        :
      </p>
    </template>

    <!-- Minutes -->
    <p class="fs-3 fw-bold p-1 me-1 mb-0 rounded-1" :class="isFinal ? 'bg-black text-white' : 'bg-white'" aria-hidden="true">
      {{ timer.digits.value[1] }}
    </p>
    <p class="fs-3 fw-bold p-1 me-1 mb-0 rounded-1" :class="isFinal ? 'bg-black text-white' : 'bg-white'" aria-hidden="true">
      {{ timer.digits.value[2] }}
    </p>
    <p class="fs-3 fw-bold me-1 mb-0" :class="isFinal ? '' : 'text-white'" aria-hidden="true">
      :
    </p>

    <!-- Seconds -->
    <p class="fs-3 fw-bold p-1 me-1 mb-0 rounded-1" :class="isFinal ? 'bg-black text-white' : 'bg-white'" aria-hidden="true">
      {{ timer.digits.value[3] }}
    </p>
    <p class="fs-3 fw-bold p-1 me-1 mb-0 rounded-1" :class="isFinal ? 'bg-black text-white' : 'bg-white'" aria-hidden="true">
      {{ timer.digits.value[4] }}
    </p>

    <!-- Screen reader accessible version -->
    <p class="visually-hidden" role="status">
      {{ accessibleTime }}
    </p>
  </div>
</template>
