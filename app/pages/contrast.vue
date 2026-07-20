<template>
  <div>
    <div class="page ms-large mt-large">
      <RandomPage />
      <h2 style=" color: #f0f0f0;  margin-left: 10px; ">
        Quel est le rapport de contraste minimum pour que le texte soit lisible ?
      </h2>
      <p style=" font-size: 1.25em; margin-left: 10px;">
        Pour obtenir la bonne réponse, cliquez sur le bouton “SUIVANT”.
      </p>

      <div class="my-small ">
        <button
          v-for="btn in buttonDefs"
          :key="btn.id"
          class="btn btn-strong m-small fs-hs p-small"
          :style="buttonStyle(btn)"
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
      <label style="font-size: 1.25em; margin-left: 10px;" for="contrastLevelinput">votre réponse :</label>

      <input
        id="inputField"
        v-model="contrastAnswer"
        type="text"
        class="form-control"
        autocomplete="off"
        style="margin-bottom: 10px; margin-top: 10px; width: 200px; margin-left: 10px;"
        :aria-label="$t('contrast.aria-label_response')"
        @keyup.enter="checkContrastAnswer"
      >
      <button
        class="btn btn-strong m-small"
        style="margin-bottom: 10px;"
        @click="checkContrastAnswer"
      >
        Valider
      </button>
      <!-- <p style="font-size: 1.25em; margin-left: 7px;">
        Le niveau de contraste peut être ajusté avec le curseur ci-dessus.
      </p>

      <p style="font-size: 1.25em; margin-left: 7px;">
        Le niveau de contraste minimum pour que le texte soit lisible est de 4,5:1.
      </p>

      <p style="font-size: 1.25em; margin-left: 7px;">
        Pour obtenir la bonne réponse, cliquez sur le bouton “SUIVANT”.
      </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const { goToNextPage } = useNextPage()

type ButtonDef = { label: string, id: string, bg?: string, color?: string }

const buttonDefs = ref<ButtonDef[]>([
  { label: 'SUIVANT', id: 'suivant', bg: '#ed7926', color: '#ff6600' },
  { label: 'SUIFANT', id: 'suifant', bg: '#ed7926', color: '#ff6600' },
  { label: 'SUIVAIT', id: 'suivait', bg: '#ed7926', color: '#ff6600' },
  { label: 'SUIVONS', id: 'suivons', bg: '#ed7926', color: '#ff6600' },
  { label: 'SUIVEUR', id: 'suiveur', bg: '#ed7926', color: '#ff6600' },
  { label: 'SUIVIES', id: 'suivies', bg: '#ed7926', color: '#ff6600' },
])

const contrastLevel = ref(0)
const maxContrast = 6

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function lerpColor(aHex: string, bHex: string, t: number) {
  const a = hexToRgb(aHex)
  const b = hexToRgb(bHex)
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bl = Math.round(a.b + (b.b - a.b) * t)
  return rgbToHex(r, g, bl)
}

function buttonStyle(btn: ButtonDef) {
  const t = Math.min(1, contrastLevel.value / maxContrast)
  const bg = lerpColor('#ed7926', btn.bg || '#ed7926', t)
  const color = lerpColor('#ed7926', btn.color || '#ff6600', t)
  return { backgroundColor: bg, color }
}

const contrastAnswer = ref('')
const showError = ref(false)

// Shuffle buttons on mount
onMounted(() => {
  buttonDefs.value.sort(() => Math.random() - 0.5)
})

function handleButtonClick(buttonId: string) {
  const selected = buttonDefs.value.find(b => b.id === buttonId)
  if (selected && selected.label === 'SUIVANT') {
    alert('Pour le niveau AA du WCAG, le rapport de contraste doit être d\'au moins 4,5:1 !')
    return
  }

  showError.value = true
  contrastLevel.value = Math.min(maxContrast, contrastLevel.value + 1)
  buttonDefs.value.sort(() => Math.random() - 0.5)
  setTimeout(() => {
    showError.value = false
  }, 2000)
}

function checkContrastAnswer() {
  const normalized = contrastAnswer.value.trim().replace(',', '.').toLowerCase()
  if (normalized === '4.5:1' || normalized === '4.5/1' || normalized === '4,5:1' || normalized === '4,5/1') {
    goToNextPage()
  }
  else {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2000)
  }
}
</script>

<style scoped>
</style>
/*
L'indice 1 affiche le message : "En plissant bien les yeux peut être..."
L'indice 2 indique : "On augmente un peu le contraste de couleur." (Augmenter le contraste de couleur)
L'indice 3 désactive la simulation et un message indique "La simulation a été désactivée et le contraste de couleur est maintenant conforme."
*/
