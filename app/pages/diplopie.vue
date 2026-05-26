<template>
  <div>
    <div class="page">
      <h1>Diplopie</h1>
      <p><strong>ID:</strong> 15</p>
      <p><strong>Route:</strong> /diplopie</p>
      <p><strong>Déficience:</strong> visual</p>
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
