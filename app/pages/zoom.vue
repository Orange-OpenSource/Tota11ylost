<template>
  <div>
    <div class="page">
      <h1>Zoom</h1>
      <p><strong>ID:</strong> 13</p>
      <p><strong>Route:</strong> /zoom</p>
      <p><strong>Déficience:</strong> visual</p>
      <RandomPage />
    </div>
    <button @click.prevent="goToNextPage">
      Next Page
    </button>
  </div>
</template>

<script setup lang="ts">
const { goToNextPage } = useNextPage()
</script>

<style scoped>
</style>
