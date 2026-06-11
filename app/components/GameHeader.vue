<!-- Tota11y Lost - Game Page Header (Page title display) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
defineProps<{
  pageTitle: string
}>()
</script>

<template>
  <div class="mx-large">
    <h2 class="display-2 my-large fs-ds">
      {{ pageTitle }}
    </h2>
  </div>
</template>
