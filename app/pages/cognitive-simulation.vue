<!-- Tota11y Lost - Cognitive Simulation (Attention Disorder + Riddles) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'cognitiveSimu.tabTitle' })

const { t } = useI18n()
const router = useRouter()
const dyslexia = useDyslexia('li', 2000)

const first = ref('')
const second = ref('')
const third = ref('')
const showError = ref(false)
const showOverlay = ref(false)
const overlayDisabled = ref(false)

type ImageItem = { url: string, text?: string, color?: string, size?: string, top?: string, opacity?: boolean }

const defaultImage: ImageItem = { url: '/game-assets/cognitive/A11yce.jpg' }

const images = computed(() => [
  { url: '/game-assets/cognitive/A11yce.jpg', text: t('cognitiveSimu.img_alice'), color: 'yellow', size: '50px', top: '290px', opacity: true },
  { url: '/game-assets/cognitive/calc.png' },
  { url: '/game-assets/cognitive/game-master.jpg' },
  { url: '/game-assets/cognitive/grinch-3.png' },
  { url: '/game-assets/cognitive/hungry.jpg', text: t('cognitiveSimu.img_hungry'), color: 'red', size: '100px' },
  { url: '/game-assets/cognitive/monkey.jpg', text: t('cognitiveSimu.img_monkey'), color: 'blue', size: '80px', top: '100px' },
  { url: '/game-assets/cognitive/nyan-cat.png' },
  { url: '/game-assets/cognitive/woof.png' },
])

const currentImage = ref<ImageItem>(defaultImage)

let overlayTimeout: ReturnType<typeof setTimeout> | null = null

function getRandomImage(): ImageItem {
  return images.value[Math.floor(Math.random() * images.value.length)] ?? defaultImage
}

function showOverlayFn() {
  if (overlayDisabled.value) return
  currentImage.value = getRandomImage()
  showOverlay.value = true
  const delay = Math.random() * 2000 + 3000
  overlayTimeout = setTimeout(hideOverlayFn, delay)
}

function hideOverlayFn() {
  showOverlay.value = false
  if (overlayDisabled.value) return
  const delay = Math.random() * 2000 + 3000
  overlayTimeout = setTimeout(showOverlayFn, delay)
}

function validate() {
  const response1 = t('cognitiveSimu.listOfResponses.0')
  const response2 = t('cognitiveSimu.listOfResponses.1')
  const response3 = t('cognitiveSimu.listOfResponses.2')

  if (
    first.value.toLowerCase().includes(response1)
    && second.value.toLowerCase().includes(response2)
    && third.value.toLowerCase().includes(response3)
  ) {
    router.push('/physical')
  }
  else {
    showError.value = true
  }
}

function onHint(index: number) {
  if (index === 3) {
    dyslexia.stop()
    overlayDisabled.value = true
    showOverlay.value = false
    if (overlayTimeout) clearTimeout(overlayTimeout)
  }
}

onMounted(() => {
  dyslexia.start()
  showOverlayFn()
})

onUnmounted(() => {
  if (overlayTimeout) clearTimeout(overlayTimeout)
})
</script>

<template>
  <ClientOnly>
    <div class="fs-2">
      <GameHeader :page-title="$t('cognitiveSimu.pageTitle')" />

      <main>
        <div class="mx-4">
          <h2 class="my-2">
            {{ $t('cognitiveSimu.riddleHeading') }}
          </h2>
          <ul class="riddles">
            <li>{{ $t('cognitiveSimu.riddle1') }}</li>
            <li>{{ $t('cognitiveSimu.riddle2') }}</li>
            <li>{{ $t('cognitiveSimu.riddle3') }}</li>
          </ul>

          <div v-if="showError" class="alert alert-danger mb-3" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('cognitiveSimu.errorHiddenText') }}</span></span>
            <p>{{ $t('cognitiveSimu.errorMessage') }}</p>
          </div>

          <div class="mb-3">
            <label for="premier" class="form-label">{{ $t('cognitiveSimu.labelFirst') }}</label>
            <input
              id="premier"
              v-model="first"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_first')"
            >
          </div>
          <div class="mb-3">
            <label for="deuxieme" class="form-label">{{ $t('cognitiveSimu.labelSecond') }}</label>
            <input
              id="deuxieme"
              v-model="second"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_second')"
            >
          </div>
          <div class="mb-3">
            <label for="troisieme" class="form-label">{{ $t('cognitiveSimu.labelThird') }}</label>
            <input
              id="troisieme"
              v-model="third"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_third')"
            >
          </div>
          <div class="mb-3">
            <button class="btn fs-3 p-2 btn-primary" @click="validate">
              {{ $t('cognitiveSimu.validateButton') }}
            </button>
          </div>

          <!-- Attention disorder overlay -->
          <div v-if="showOverlay" id="overlay">
            <div id="content">
              <div class="position-relative text-white">
                <img :src="currentImage.url" :alt="$t('cognitiveSimu.alt_simulatedImage')" class="img-fluid">
                <div
                  v-if="currentImage.text"
                  class="position-absolute p-4"
                  :style="{
                    backgroundColor: currentImage.opacity ? '#00000050' : 'transparent',
                    color: currentImage.color || 'black',
                    top: currentImage.top || '0',
                    fontSize: currentImage.size || '0',
                  }"
                >
                  {{ currentImage.text }}
                </div>
              </div>
            </div>
          </div>

          <GameHints page-id="cognitiveSimulation" @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
