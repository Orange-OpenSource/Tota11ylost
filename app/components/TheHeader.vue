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
        <!-- Timer Display -->
        <div v-if="route.name !== 'index' && route.name !== 'scores'" class="flex-shrink-0">
          <GameTimer />
        </div>
      </div>
    </div>

    <!-- Session code reminder: fixed in a corner, visible throughout the game -->
    <p
      v-if="gameStore.sessionCode && route.name !== 'index'"
      class="tag tag-muted m-none"
      style="position: fixed; bottom: 1rem; left: 1rem; z-index: 1050; background-color: var(--bs-color-always-white); color: var(--bs-color-always-black);"
      :aria-label="$t('common.sessionCodeBadge.aria-label_sessionCode', { code: gameStore.sessionCode })"
    >
      {{ $t('common.sessionCodeBadge.label') }}: {{ gameStore.sessionCode }}
    </p>
  </header>
</template>
