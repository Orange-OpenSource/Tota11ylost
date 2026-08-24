<script setup lang="ts">
const { goToNextPage } = useNextPage()

type ButtonDef = { label: string, id: string, bg?: string, color?: string }

const questions = ref([
  { texte: $t('contrast.question1'), choix: [$t('contrast.choice1'), $t('contrast.choice2'), $t('contrast.choice3')], reponse: $t('contrast.choice2'), indice: $t('contrast.hints.0') },
  { texte: $t('contrast.question2'), choix: [$t('contrast.choice4'), $t('contrast.choice5'), $t('contrast.choice6')], reponse: $t('contrast.choice4'), indice: $t('contrast.hints.1') },
  { texte: $t('contrast.question3'), choix: [$t('contrast.choice7'), $t('contrast.choice8'), $t('contrast.choice9')], reponse: $t('contrast.choice9'), indice: $t('contrast.hints.2') },
])

const modalVisible = ref(false)
const contrastLevel = ref(1)
const currentHintMessage = ref('')
const maxContrast = 3
const forceBlackText = ref(false)

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
  const bg = lerpColor('#ed7926', btn.bg || '#E67018', t)
  const color = forceBlackText.value ? '#000000' : lerpColor('#ed7926', btn.color || '#ff6600', t)
  return { backgroundColor: bg, color }
}

const showError = ref(false)
const currentQuestionIndex = ref(0)
const shuffleVersion = ref(0)
const hintList = ref<string[]>([])
const shownHintIndexes = ref<Set<number>>(new Set())
const pendingNextPage = ref(false)
const h3Text = computed(() => questions.value[currentQuestionIndex.value]?.texte ?? '')
const currentHint = computed(() => questions.value[currentQuestionIndex.value]?.indice ?? '')

const buttonDefs = computed<ButtonDef[]>(() => {
  const choices = questions.value[currentQuestionIndex.value]?.choix ?? []
  const shuffledChoices = [...choices].sort(() => Math.random() - 0.5)

  return shuffledChoices.map((choice, index) => ({
    label: choice,
    id: `choice-${currentQuestionIndex.value}-${shuffleVersion.value}-${index}`,
    bg: '#ed7926',
    color: '#ed79aa',
  }))
})

// Largeur minimale des boutons adaptée au texte le plus long de la question
// affichée, pour éviter le "wrap" sans imposer une taille fixe identique partout.
// Le facteur par caractère (15px) et le padding (70px) sont calibrés sur le pire
// cas : la classe fs-hs atteint 24px sur desktop (contre 18px sur mobile), donc
// on prévoit large plutôt que de sous-estimer sur les grands écrans.
const buttonMinWidth = computed(() => {
  const longestLabelLength = buttonDefs.value.reduce((max, btn) => Math.max(max, btn.label.length), 0)
  return Math.min(420, Math.max(220, longestLabelLength * 15 + 70))
})
function onHint(index: number) {
  if (index === 1 || index === 2) {
    contrastLevel.value = Math.min(maxContrast, contrastLevel.value + 1)
    forceBlackText.value = false
  }
  else if (index === 3) {
    contrastLevel.value = maxContrast
    forceBlackText.value = true
  }
}

function handleButtonClick(selectedLabel: string) {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  if (!currentQuestion) {
    return
  }

  if (selectedLabel.trim().toLowerCase() === currentQuestion.reponse.trim().toLowerCase()) {
    const isLastQuestion = currentQuestionIndex.value >= questions.value.length - 1
    const willShowHint = currentHint.value && !shownHintIndexes.value.has(currentQuestionIndex.value)

    if (willShowHint) {
      currentHintMessage.value = currentHint.value
      modalVisible.value = true
      shownHintIndexes.value.add(currentQuestionIndex.value)
    }

    if (isLastQuestion) {
      if (willShowHint) {
        pendingNextPage.value = true
      }
      else {
        goToNextPage()
      }
      return
    }

    currentQuestionIndex.value += 1
  }
  else {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2000)
  }

  shuffleVersion.value += 1
}

function closeHintModal() {
  modalVisible.value = false

  if (pendingNextPage.value) {
    pendingNextPage.value = false
    goToNextPage()
  }
}

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && modalVisible.value) {
    closeHintModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <div class="fs-hm mw-none">
    <GameHeader :page-title="$t('contrast.pageTitle')" />
    <main>
      <div class="mx-large">
        <h2>{{ $t('contrast.descriptionHeading') }}</h2>
        <p class="fs-hm">
          {{ $t('contrast.descriptionText1') }}
        </p>
        <p class="fs-hm">
          {{ $t('contrast.descriptionText2') }}
        </p>
        <h2>{{ $t('contrast.userTypeHeading') }}</h2>
        <p class="fs-hm">
          {{ $t('contrast.userTypeText') }}
        </p>

        <h2>{{ $t('contrast.rulesHeading') }}</h2>
        <ul>
          <li>{{ $t('contrast.rule1') }}</li>
          <li>{{ $t('contrast.rule2') }}</li>
        </ul>
      </div>

      <div :class="hintList.length ? 'page ms-large mt-4xlarge flex-1 d-flex flex-column justify-content-start align-items-center text-center' : 'page ms-large mt-4xlarge flex-1 d-flex flex-column justify-content-center align-items-center text-center'">
        <h3 class="questions">
          {{ h3Text }}
        </h3>

        <div class="my-small answer-buttons" :style="{ '--btn-min-width': buttonMinWidth + 'px' }">
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

        <div v-if="showError" class="alert alert-message " role="alert">
          <div class="alert-container">
            <div class="alert-text-container">
              <p class="alert-label">
                Mauvaise réponse, pourtant tout est écrit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div
      v-if="modalVisible"
      class="modal d-block"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      style="background: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <button
              id="close-popup"
              class="my-small ms-auto close-popup border-none btn"
              :aria-label="$t('physical.aria-label_closeModal')"
              @click="closeHintModal"
            >
              X
            </button>
          </div>
          <div class="modal-body">
            <p id="modal-contrast" class="fs-hm">
              {{ currentHintMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <GameHints
      page-id="contrast"
      large-text
      class=" mx-large"
      @hint="onHint"
    />
  </div>
</template>

<style scoped>
.hintstyle {
  border: 2px solid black;
}

.questions {
  color: #f3f1f1;
  font-size: 1.5em;
  margin-left: 10px;
}

.answer-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.answer-buttons button {
  flex: 1 1 0;
  min-width: var(--btn-min-width, 150px);
}

.modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5) !important;
}

.modal-dialog {
  margin: auto;
}

.modal-content {
  background-color: white !important;
  color: #000 !important;
  border: 1px solid #ddd;
  padding-top: 0;
}

.modal-body {
  padding: 1.5rem;
  padding-top: 0;
}
</style>
