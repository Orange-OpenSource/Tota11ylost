<!-- Tota11y Lost - Cognitive Simulation (Attention Disorder + Riddles) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'cognitiveSimu.tabTitle' })

const { t } = useI18n()
const { goToNextPage } = useNextPage()
const dyslexia = useDyslexia('li', 2000)

const first = ref('')
const second = ref('')
const third = ref('')
const showError = ref(false)
const showOverlay = ref(false)
const overlayDisabled = ref(false)

type ImageItem = { url: string, text?: string, color?: string, size?: string, top?: string, opacity?: boolean, width?: string }
type CardItem = { parts: { text: string, color?: string }[], background?: string }
type OverlayItem = ImageItem | CardItem

const defaultImage: ImageItem = { url: '/game-assets/cognitive/calc.png' }

const images = computed(() => [
  { url: '/game-assets/cognitive/calc.png', text: 'trop smart', color: 'blue', size: '20px' },
  { url: '/game-assets/cognitive/game-master.jpg', text: 'HAHAH', color: 'red', size: '100px' },
  { url: '/game-assets/cognitive/grinch-3.png', text: 'Bouh noel...', color: 'red', size: '50px' },
  { url: '/game-assets/cognitive/monkey.jpg', text: t('cognitiveSimu.img_monkey'), color: 'blue', size: '80px', top: '100px' },
  { url: '/game-assets/cognitive/monkey.jpg', text: 'youpi !!!', color: 'orange', size: '180px', top: '100px' },
  { url: '/game-assets/cognitive/moving-forward.png', text: t('cognitiveSimu.img_movingForward'), color: 'black', size: '60px' },
  { url: '/game-assets/cognitive/competition.png', text: t('cognitiveSimu.img_competition'), color: 'red', size: '70px' },
  { url: '/game-assets/cognitive/fast-food.png', text: t('cognitiveSimu.img_fastFood'), color: 'orange', size: '90px' },
  { url: '/game-assets/cognitive/fast-food.png', text: t('cognitiveSimu.img_hungry'), color: 'red', size: '100px' },
  { url: '/game-assets/cognitive/fast-food.png', text: 'Miam...', color: 'green', size: '100px' },
  { url: '/game-assets/cognitive/overworked.png', text: t('cognitiveSimu.img_overworked'), color: 'blue', size: '60px' },
  { url: '/game-assets/cognitive/snapchat.png', text: t('cognitiveSimu.img_snapchat'), color: 'purple', size: '80px' },
  { url: '/game-assets/cognitive/concert-phone.jpg', text: t('cognitiveSimu.img_concert'), color: 'white', size: '90px', opacity: true },
  { url: '/game-assets/cognitive/shaving-foam.jpg', text: t('cognitiveSimu.img_shavingFoam'), color: 'blue', size: '100px' },
  { url: '/game-assets/cognitive/orange-sales-advisor.jpg', text: t('cognitiveSimu.img_lookHere'), color: 'orange', size: '80px', opacity: true },
  { url: '/game-assets/cognitive/shutterstock-1168142251.jpg', text: t('cognitiveSimu.img_notification'), color: 'red', size: '70px', opacity: true },
  { url: '/game-assets/cognitive/shutterstock-1916349737.jpg', text: t('cognitiveSimu.img_drinkWater'), color: 'yellow', size: '60px', opacity: true },
  { url: '/game-assets/cognitive/getty-549105939.jpg', text: t('cognitiveSimu.img_squirrel'), color: 'green', size: '90px', opacity: true },
  { url: '/game-assets/cognitive/orange-1145878.jpg', text: t('cognitiveSimu.img_whereWasI'), color: 'white', size: '70px', opacity: true },
  { url: '/game-assets/cognitive/u302317.jpg', text: t('cognitiveSimu.img_soft'), color: 'purple', size: '80px', opacity: true },
  { url: '/game-assets/cognitive/water-vehicles.png', text: t('cognitiveSimu.img_boats'), color: '#0a6ebd', size: '70px' },
  { url: '/game-assets/cognitive/easter-chicks.png', text: t('cognitiveSimu.img_chicks'), color: '#ffd200', size: '50px', width: '500px' },
])

// Text-only distractions in the style of calc.png
const cards = computed<CardItem[]>(() => [
  { parts: [{ text: t('cognitiveSimu.card_operatorPriority') }] },
  { parts: [{ text: t('cognitiveSimu.card_decimals') }] },
  { parts: [{ text: t('cognitiveSimu.card_months') }] },
  { parts: [{ text: t('cognitiveSimu.card_overtake') }] },
  // Stroop effect: colour names written in a different colour
  {
    background: '#ffe14d',
    parts: [
      { text: t('cognitiveSimu.card_red'), color: '#007a33' },
      { text: ', ' },
      { text: t('cognitiveSimu.card_green'), color: '#d40000' },
    ],
  },
  { parts: [{ text: t('cognitiveSimu.card_door') }] },
  { parts: [{ text: t('cognitiveSimu.card_email') }] },
  { parts: [{ text: t('cognitiveSimu.card_weekdays') }] },
])

const overlayItems = computed<OverlayItem[]>(() => [...images.value, ...cards.value])

const currentImage = ref<OverlayItem>(defaultImage)
const contentRef = ref<HTMLElement | null>(null)

let overlayTimeout: ReturnType<typeof setTimeout> | null = null
let contentAnimation: Animation | null = null
let nextItem: OverlayItem = defaultImage
let preloader: HTMLImageElement | null = null

const EASINGS = ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(.68,-0.55,.27,1.55)']

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function getRandomImage(): OverlayItem {
  return overlayItems.value[Math.floor(Math.random() * overlayItems.value.length)] ?? defaultImage
}

// Picks the next distraction and downloads its image while nothing is displayed
function prepareNextItem() {
  nextItem = getRandomImage()
  if ('url' in nextItem) {
    preloader = new Image()
    preloader.src = nextItem.url
  }
}

// Random path kept roughly inside the viewport; segment durations vary by at most ±25%
function animateContent(durationMs: number) {
  const el = contentRef.value
  if (!el) return
  const maxX = Math.max(50, (window.innerWidth - (el.offsetWidth || window.innerWidth / 3)) / 2)
  const maxY = Math.max(50, (window.innerHeight - (el.offsetHeight || window.innerHeight / 3)) / 2)
  const steps = 3 + Math.floor(Math.random() * 3)
  const offsets = Array.from({ length: steps - 1 }, (_, i) => (i + 1 + randomBetween(-0.25, 0.25)) / steps)

  const keyframes: Keyframe[] = [0, ...offsets, 1].map((offset, i, all) => ({
    offset,
    transform: `translate(${randomBetween(-maxX, maxX)}px, ${randomBetween(-maxY, maxY)}px) rotate(${randomBetween(-15, 15)}deg) scale(${randomBetween(0.8, 1.2)})`,
    opacity: i === 0 || i === all.length - 1 ? 0 : 1,
    easing: EASINGS[Math.floor(Math.random() * EASINGS.length)],
  }))

  contentAnimation?.cancel()
  contentAnimation = el.animate(keyframes, { duration: durationMs, fill: 'forwards' })
}

async function showOverlayFn() {
  if (overlayDisabled.value) return
  currentImage.value = nextItem
  showOverlay.value = true
  const delay = Math.random() * 2000 + 4000
  overlayTimeout = setTimeout(hideOverlayFn, delay)
  await nextTick()
  animateContent(delay)
}

function hideOverlayFn() {
  showOverlay.value = false
  if (overlayDisabled.value) return
  prepareNextItem()
  const delay = Math.random() * 2000 + 3000
  overlayTimeout = setTimeout(showOverlayFn, delay)
}

function validate() {
  const response1 = t('cognitiveSimu.listOfResponses.0')
  const response2 = t('cognitiveSimu.listOfResponses.1')
  const response3 = t('cognitiveSimu.listOfResponses.2')

  if (
    isFuzzyMatch(first.value.toLowerCase(), response1)
    && isFuzzyMatch(second.value.toLowerCase(), response2)
    && isFuzzyMatch(third.value.toLowerCase(), response3)
  ) {
    goToNextPage()
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
  // Start with a hidden phase so the first image has time to preload
  hideOverlayFn()
})

onUnmounted(() => {
  if (overlayTimeout) clearTimeout(overlayTimeout)
  contentAnimation?.cancel()
})
</script>

<template>
  <ClientOnly>
    <div class="fs-hm mw-none">
      <main>
        <GameHeader :page-title="$t('cognitiveSimu.pageTitle')" />
        <div class="mx-large">
          <h2 class="my-small">
            {{ $t('cognitiveSimu.riddleHeading') }}
          </h2>
          <ul class="riddles">
            <li>{{ $t('cognitiveSimu.riddle1') }}</li>
            <li>{{ $t('cognitiveSimu.riddle2') }}</li>
            <li>{{ $t('cognitiveSimu.riddle3') }}</li>
          </ul>

          <div v-if="showError" class="alert alert-message alert-negative mb-medium" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('cognitiveSimu.errorHiddenText') }}</span></span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p>{{ $t('cognitiveSimu.errorMessage') }}</p>
              </div>
            </div>
          </div>

          <div class="mb-medium">
            <label for="premier" class="form-label fw-bold">{{ $t('cognitiveSimu.labelFirst') }}</label>
            <input
              id="premier"
              v-model="first"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_first')"
            >
          </div>
          <div class="mb-medium">
            <label for="deuxieme" class="form-label fw-bold">{{ $t('cognitiveSimu.labelSecond') }}</label>
            <input
              id="deuxieme"
              v-model="second"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_second')"
            >
          </div>
          <div class="mb-medium">
            <label for="troisieme" class="form-label fw-bold">{{ $t('cognitiveSimu.labelThird') }}</label>
            <input
              id="troisieme"
              v-model="third"
              type="text"
              class="form-control"
              :aria-label="$t('cognitiveSimu.aria-label_third')"
            >
          </div>
          <div class="mb-medium">
            <button class="btn fs-hs p-small btn-brand" @click="validate">
              {{ $t('cognitiveSimu.validateButton') }}
            </button>
          </div>

          <!-- Attention disorder overlay; persistent alert region so each distraction is announced -->
          <div role="alert">
            <div v-if="showOverlay" id="overlay">
              <div id="content" ref="contentRef">
                <div v-if="'url' in currentImage" class="position-relative text-white">
                  <img
                    :src="currentImage.url"
                    :alt="currentImage.text ? '' : $t('cognitiveSimu.alt_simulatedImage')"
                    class="img-fluid"
                    :style="{ width: currentImage.width }"
                  >
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
                <div
                  v-else
                  class="distraction-card"
                  :style="{ backgroundColor: currentImage.background }"
                >
                  <span
                    v-for="(part, i) in currentImage.parts"
                    :key="i"
                    :style="{ color: part.color }"
                  >{{ part.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <GameHints page-id="cognitiveSimulation" large-text @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>

<style scoped>
.distraction-card {
  max-width: 90vw;
  padding: 2rem 3rem;
  border-radius: 1rem;
  background-color: #000000;
  color: #e95d11;
  font-size: 64px;
  font-weight: bold;
  line-height: 1.2;
}
</style>
