<template>
  <header>
    <!-- Language switcher at the top -->
    <LanguageSwitch />
    <div class="bg-dark py-2">
      <div class="m-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-end gap-3">
          <NuxtLink to="/" :aria-label="$t('common.banner.alt_orangeLogo')">
            <img
              src="~/assets/img/orange-logo.png"
              class="mx-2"
              :alt="$t('common.banner.alt_orangeLogo')"
              style="max-height: 60px;"
            >
          </NuxtLink>
          <h1 class="fs-2 m-0 text-white">
            {{ $t('common.banner.title') }}
          </h1>
        </div>
        <!-- Timer Display -->
        <GameTimer />
      </div>
    </div>
  </header>
</template>
