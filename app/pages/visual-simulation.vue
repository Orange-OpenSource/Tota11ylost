<!-- Tota11y Lost - Visual Simulation (Braille/Blindness) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'visualSimu.tabTitle' })

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()
const { toBraille } = useBraille()

const nom = ref('')
const prenom = ref('')
const naissance = ref('')
const validationMessage = ref('')
const validationLink = ref('')
const textBloc = ref('')
const simulationDisabled = ref(false)

function updateTextBloc(event: FocusEvent) {
  const target = event.target as HTMLElement
  const ariaLabel = target.getAttribute('aria-label') || ''
  const text = target.textContent || ''

  if (target.classList.contains('form-input')) {
    // For inputs, display label in Braille
    const noAccent = ariaLabel.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    textBloc.value = toBraille(noAccent)
  }
  else {
    // For paragraphs and other elements, display readable text
    textBloc.value = text
  }
}

function validateForm() {
  const expectedName = t('visualSimu.name')
  const expectedFirstName = t('visualSimu.firstName')
  const expectedBirthDate = t('visualSimu.birthDate')

  if (
    nom.value.toLowerCase() === expectedName
    && prenom.value.toLowerCase() === expectedFirstName
    && naissance.value === expectedBirthDate
  ) {
    validationMessage.value = t('visualSimu.congratulations')
    validationLink.value = gameStore.is30Version ? '/scores?store=true' : '/cognitive'
  }
  else {
    validationMessage.value = t('visualSimu.error')
    validationLink.value = ''
  }
}

function navigateNext() {
  if (validationLink.value) {
    router.push(validationLink.value)
  }
}

function onHint(index: number) {
  if (index === 3) {
    simulationDisabled.value = true
  }
}

onMounted(() => {
  document.addEventListener('focusin', updateTextBloc)

  // Auto-focus on first focusable element
  setTimeout(() => {
    const firstFocusable = document.querySelector('[tabindex="0"]') as HTMLElement
    if (firstFocusable) {
      firstFocusable.focus()
    }
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('focusin', updateTextBloc)
})
</script>

<template>
  <ClientOnly>
    <div class="fs-2 simulation-page" :class="{ 'no-cursor': !simulationDisabled }">
      <!-- Braille display area - white on black - at top and visible -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div id="text-bloc" v-html="textBloc" />

      <main>
        <div class="mx-4 fs-6">
          <h2>{{ $t('visualSimu.userTypeHeading') }}</h2>

          <!-- All invisible but focusable elements -->
          <div class="visually-hidden" role="region">
            <p tabindex="0" :aria-label="$t('visualSimu.userTypeText1')">
              {{ $t('visualSimu.userTypeText1') }}
            </p>
            <p tabindex="0" :aria-label="$t('visualSimu.userTypeText2')">
              {{ $t('visualSimu.userTypeText2') }}
            </p>

            <h2>{{ $t('visualSimu.riddleHeading') }}</h2>
            <p
              v-for="i in 15"
              :key="`riddle-${i}`"
              tabindex="0"
              :aria-label="$t(`visualSimu.riddleText${i}`)"
            >
              {{ $t(`visualSimu.riddleText${i}`) }}
            </p>

            <p tabindex="0" :aria-label="$t('visualSimu.formInstructions')">
              {{ $t('visualSimu.formInstructions') }}
            </p>

            <!-- Invisible form -->
            <form @submit.prevent>
              <label class="visually-hidden" for="nom">{{ $t('visualSimu.labelName') }}</label>
              <input
                id="nom"
                v-model="nom"
                class="form-input"
                type="text"
                required
                tabindex="0"
                :aria-label="$t('visualSimu.aria-label_name')"
                @input="validateForm"
                @focusin="updateTextBloc"
              >

              <label class="visually-hidden" for="prenom">{{ $t('visualSimu.labelFirstName') }}</label>
              <input
                id="prenom"
                v-model="prenom"
                class="form-input"
                type="text"
                required
                tabindex="0"
                :aria-label="$t('visualSimu.aria-label_firstName')"
                @input="validateForm"
                @focusin="updateTextBloc"
              >

              <label class="visually-hidden" for="naissance">{{ $t('visualSimu.labelBirthDate') }}</label>
              <input
                id="naissance"
                v-model="naissance"
                class="form-input"
                type="text"
                required
                tabindex="0"
                :aria-label="$t('visualSimu.aria-label_birthDate')"
                @input="validateForm"
                @focusin="updateTextBloc"
              >
            </form>

            <div>
              <a
                class="visuel21"
                tabindex="0"
                :href="validationLink || '#'"
                :aria-label="validationMessage || $t('visualSimu.validationError')"
                @click.prevent="navigateNext"
                @focusin="updateTextBloc"
              >
                {{ validationMessage || $t('visualSimu.validationError') }}
              </a>
            </div>
          </div>

          <GameHints
            page-id="visualSimulation"
            :custom-class="simulationDisabled ? '' : 'hints-visualSimulation'"
            @hint="onHint"
          />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.simulation-page {
  background-color: black !important;
  color: black;
  min-height: 100vh;
}

#text-bloc {
  display: block;
  background-color: white;
  color: black;
  padding: 2rem;
  margin: 10rem 1rem 1rem 1rem;
  min-height: 100px;
  font-size: 1.2rem;
  border: 2px solid #ddd;
  word-break: break-word;
}

.simulation-page main {
  background-color: black !important;
  color: black !important;
  padding: 0 !important;
  margin: 0 !important;

  * {
    background-color: black !important;
    color: black !important;
    border-color: black !important;

    &::placeholder {
      color: black !important;
    }
  }
}

.no-cursor {
  cursor: none !important;

  * {
    cursor: none !important;
  }
}
</style>
