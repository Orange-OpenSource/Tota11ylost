<!-- Tota11y Lost - Game Layout -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const title = computed(() => t(route.meta.title as string ?? 'common.banner.title'))

useHead({ title })
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <TheHeader />
    <div class="flex-grow-1">
      <slot />
    </div>
  </div>
</template>
