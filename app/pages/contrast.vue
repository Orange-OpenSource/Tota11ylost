<template>
  <div>
    <div class="page">
      <h1>Contrast</h1>
      <p><strong>ID:</strong> 14</p>
      <p><strong>Route:</strong> /contrast</p>
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
