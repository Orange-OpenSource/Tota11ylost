<script setup lang="ts">
const route = useRoute()
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
  </header>
</template>
