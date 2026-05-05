<script setup>
const route = useRoute()
const { t } = useI18n()
const title = computed(() => t(route.meta.title ?? 'DEFAULT_TITLE'))

useHead({ title })
</script>

<template>
  <div class="d-flex flex-column h-100">
    <TheHeader />
    <div class="flex-grow-1 overflow-auto">
      <slot />
    </div>
    <TheFooter class="flex-shrink-0" />
  </div>
</template>
