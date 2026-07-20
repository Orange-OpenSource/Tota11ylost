<template>
  <div>
    <div class="page ms-large mt-large">
      <h1>Contrast</h1>
      <RandomPage />
      <p style="background-color: #ff6600; color: #ed7926; font-size: 1.25em; margin-left: 7px;">
        Le bon libellé de bouton est “SUIVANT”
      </p>

      <div class="my-small ">
        <button
          v-for="btn in buttonDefs"
          :key="btn.id"
          class="btn btn-strong m-small fs-hs p-small"
          style="background-color:#ed7926; color:#ff6600 ; "
          :aria-label="btn.label"
          @click="handleButtonClick(btn.id)"
        >
          {{ btn.label }}
        </button>
      </div>

      <div v-if="showError" class="alert alert-message alert-negative" role="alert">
        <div class="alert-container">
          <div class="alert-text-container">
            <p class="alert-label">
              Mauvaise réponse, pourtant tout est écrit.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { goToNextPage } = useNextPage()

const buttonDefs = ref([
  { label: 'SUIVANT', id: 'suivant' },
  { label: 'SUIFANT', id: 'suifant' },
  { label: 'SUIVAIT', id: 'suivait' },
  { label: 'SUIVONS', id: 'suivons' },
  { label: 'SUIVEUR', id: 'suiveur' },
  { label: 'SUIVIES', id: 'suivies' },
])

const showError = ref(false)

// Shuffle buttons on mount
onMounted(() => {
  buttonDefs.value.sort(() => Math.random() - 0.5)
})

function handleButtonClick(buttonId: string) {
  const selected = buttonDefs.value.find(b => b.id === buttonId)
  if (selected && selected.label === 'SUIVANT') {
    goToNextPage()
    return
  }

  // mauvais choix : afficher erreur et reshuffle
  showError.value = true
  buttonDefs.value.sort(() => Math.random() - 0.5)
  setTimeout(() => {
    showError.value = false
  }, 2000)
}
</script>

<style scoped>
</style>
/*
L'indice 1 affiche le message : "En plissant bien les yeux peut être..."
L'indice 2 indique : "On augmente un peu le contraste de couleur." (Augmenter le contraste de couleur)
L'indice 3 désactive la simulation et un message indique "La simulation a été désactivée et le contraste de couleur est maintenant conforme."
*/
