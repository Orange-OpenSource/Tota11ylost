<template>
  <div>
    <div class="page">
      <h1>Memorie</h1>
      <p><strong>ID:</strong> 16</p>
      <p><strong>Route:</strong> /memorie</p>
      <p><strong>Déficience:</strong> cognitive</p>
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
