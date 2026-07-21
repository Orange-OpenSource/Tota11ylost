<template>
  <div class="d-flex">
    <div v-if="hintList.length" class="page ms-large mt-4xlarge justify-content-center  d-flex flex-column  align-items-center text-center" role="status">
      <div class="alert-container">
        <div class="alert-text-container">
          <div style="margin: 0; padding-left: 1.2rem; text-align: left;">
            <p v-for="(hint, index) in hintList" :key="index">
              {{ hint }}
            </p>
          </div>
        </div>

        <input
          v-model="contrastInput"
          type="text"
          style="margin: 10px; padding: 5px; width: 200px;"
          placeholder=""
        >

        <button
          class="btn btn-strong m-small"
          style="margin-bottom: 10px;"
          @click="validateContrastAnswer"
        >
          Valider
        </button>
      </div>
    </div>
    <div class="page ms-large mt-4xlarge d-flex flex-column justify-content-center align-items-center text-center">
      <RandomPage />

      <h2 style=" color: #f0f0f0;font-size: 1.8em; margin-left: 10px;">
        {{ h2Text }}
      </h2>

      <div class="my-small ">
        <button
          v-for="btn in buttonDefs"
          :key="btn.id"
          class="btn btn-strong m-small fs-hs p-small"
          :style="buttonStyle(btn)"
          :aria-label="btn.label"
          @click="handleButtonClick(btn.label)"
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

      <GameHints page-id="contrast" large-text @hint="onHint" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { goToNextPage } = useNextPage()

type ButtonDef = { label: string, id: string, bg?: string, color?: string }

const questions = ref([
  { texte: 'Qui est impacté par un mauvais contraste ?', choix: ['les aveugles', 'tout le monde', 'personne'], reponse: 'tout le monde', indice: 'Le ratio est constitué de deux parties : une pour la luminosité la plus claire et l\'autre pour la plus sombre.' },
  { texte: 'Est-ce que le contraste change selon la taille du texte ?', choix: ['Oui', 'Non', 'Parfois'], reponse: 'oui', indice: ' Le ratio de contraste est l\'équivalent d\'une acuité visuelle d\'environ 20/40' },
  { texte: 'Quel outil permet de tester le contraste ?', choix: ['Cela existe pas', 'Pas besoin ça se voit', 'Contrast Color Analyzer'], reponse: 'Contrast Color Analyzer', indice: 'le ratio est 4.5:1 pour un texte normal et 3:1 pour un texte large. Il a a été défini pour garantir qu\'une personne ayant une perte de vision liée à l\'âge puisse lire un texte standard sans loupe ni technologie d\'assistance.' },
])

const contrastLevel = ref(0)
const maxContrast = 3

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

const showError = ref(false)
const contrastInput = ref('')
const currentQuestionIndex = ref(0)
const shuffleVersion = ref(0)
const hintList = ref<string[]>([])
const shownHintIndexes = ref<Set<number>>(new Set())
const h2Text = computed(() => questions.value[currentQuestionIndex.value]?.texte ?? '')

const buttonDefs = computed<ButtonDef[]>(() => {
  const choices = questions.value[currentQuestionIndex.value]?.choix ?? []
  const shuffledChoices = [...choices].sort(() => Math.random() - 0.5)

  return shuffledChoices.map((choice, index) => ({
    label: choice,
    id: `choice-${currentQuestionIndex.value}-${shuffleVersion.value}-${index}`,
    bg: '#ed7926',
    color: '#ff6600',
  }))
})

function onHint(index: number) {
  if (index === 3) {
    contrastLevel.value = maxContrast
  }
}

function validateContrastAnswer() {
  const normalizedInput = contrastInput.value.trim().replace(',', '.').toLowerCase()

  if (normalizedInput === '4.5:1' || normalizedInput === '4.5/1') {
    goToNextPage()
    return
  }

  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 2000)
}

function handleButtonClick(selectedLabel: string) {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  if (!currentQuestion) {
    return
  }

  if (selectedLabel.trim().toLowerCase() === currentQuestion.reponse.trim().toLowerCase()) {
    const currentHint = questions.value[currentQuestionIndex.value]?.indice
    if (currentHint && !shownHintIndexes.value.has(currentQuestionIndex.value)) {
      hintList.value.push(currentHint)
      shownHintIndexes.value.add(currentQuestionIndex.value)
    }

    const isLastQuestion = currentQuestionIndex.value >= questions.value.length - 1

    if (isLastQuestion) {
      return
    }

    currentQuestionIndex.value += 1
  }
  else {
    showError.value = true
    contrastLevel.value = Math.min(maxContrast, contrastLevel.value + 1)
    setTimeout(() => {
      showError.value = false
    }, 2000)
  }

  shuffleVersion.value += 1
}
</script>

<style scoped>
</style>
