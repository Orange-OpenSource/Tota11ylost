<template>
  <header>
    <!-- Language switcher at the top -->
    <LanguageSwitch />
    <div class="bg-dark py-2">
      <div class="m-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-end gap-3">
          <img
            src="/game-assets/orange-logo.png"
            class="mx-2"
            alt=""
            style="max-height: 60px;"
          >
          <h1 class="fs-2 m-0 text-white">
            {{ $t('common.banner.title') }}
          </h1>
        </div>
        <!-- Timer Display -->
        <div class="flex-shrink-0">
          <GameTimer />
        </div>
      </div>
    </div>
  </header>
</template>
