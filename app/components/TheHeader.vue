<script setup lang="ts">
const route = useRoute()
const gameStore = useGameStore()
</script>

<template>
  <header>
    <!-- Language switcher at the top -->
    <LanguageSwitch />
    <div class="bg-always-black py-xsmall">
      <div class="m-medium d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-end gap-medium ms-3xlarge">
          <img
            src="/game-assets/orange-logo.png"
            class="mx-xsmall"
            alt=""
            style="max-height: 60px;"
          >
          <h1 class="fs-hm m-none text-always-white">
            {{ $t('common.banner.title') }}
          </h1>
        </div>
        <!-- Session code + Timer Display -->
        <div
          v-if="route.name !== 'index'"
          class="d-flex align-items-center gap-medium flex-shrink-0"
          :class="{ 'pe-3xlarge': route.name === 'scores' }"
        >
          <p
            v-if="gameStore.sessionCode"
            class="tag m-none"
            style="background-color: var(--bs-color-always-black); color: var(--bs-color-always-white);"
          >
            <span aria-hidden="true">{{ $t('common.sessionCodeBadge.label', { code: gameStore.sessionCode }) }}</span>
            <span class="visually-hidden">{{ $t('common.sessionCodeBadge.aria-label_sessionCode', { code: gameStore.sessionCode }) }}</span>
          </p>
          <GameTimer v-if="route.name !== 'scores'" />
        </div>
      </div>
    </div>
  </header>
</template>
