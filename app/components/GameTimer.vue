<!-- Tota11y Lost - Game Timer Display -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
defineProps<{
  isFinal?: boolean
}>()

const timer = useGameTimer()
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
      {{ timer.displayTime.value }}
    </p>
  </div>
</template>
