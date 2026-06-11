<template>
  <header>
    <!-- Language switcher at the top -->
    <LanguageSwitch />
    <div class="bg-always-black py-xsmall">
      <div class="m-medium d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-end gap-medium">
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
        <GameTimer />
      </div>
    </div>
  </header>
</template>
