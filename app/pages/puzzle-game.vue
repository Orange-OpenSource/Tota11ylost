<template>
  <div>
    <div class="page">
      <h1>Puzzle Game</h1>
      <p><strong>ID:</strong> 12</p>
      <p><strong>Route:</strong> /puzzle-game</p>
      <p><strong>Déficience:</strong> physical</p>
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
