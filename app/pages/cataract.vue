<template>
  <div>
    <div class="page">
      <h1>Cataract</h1>
      <p><strong>ID:</strong> 11</p>
      <p><strong>Route:</strong> /cataract</p>
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
