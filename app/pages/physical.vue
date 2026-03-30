<!-- Tota11y Lost - Physical (Motor) Impairment Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'physical.tabTitle' })

const gameStore = useGameStore()
const router = useRouter()

const falseCursorRef = ref<HTMLImageElement | null>(null)
const modalVisible = ref(true)
const tremorActive = ref(true)
const cursorX = ref(0)
const cursorY = ref(0)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
let tremorIntervalId: ReturnType<typeof setInterval> | null = null

const nextRoute = computed(() => gameStore.getNextRoute('physical'))

// Tremor noise values
const tremorNoise = [
  -0.954, -0.390, 0.955, -0.742, 0.415, 1.114, 0.761, 0.738,
  -0.538, 2.953, 1.297, 0.879, -0.431, 0.908, 1.329, -2.062,
  0.854, 0.645, 0.296, 0.029,
]

function getRandomTremor(): number {
  const idx = Math.round(Math.random() * (tremorNoise.length - 1))
  return (tremorNoise[idx] ?? 0) * 40
}

function updateCursorPosition(e: MouseEvent) {
  lastMouseX.value = e.clientX
  lastMouseY.value = e.clientY
}

function applyTremor() {
  if (!tremorActive.value) return

  // Add tremor offset to make clicking difficult
  const tremorX = getRandomTremor()
  const tremorY = getRandomTremor()

  cursorX.value = lastMouseX.value + tremorX
  cursorY.value = lastMouseY.value + tremorY
}

function handleFakeClick() {
  const element = document.elementFromPoint(cursorX.value, cursorY.value)

  if (!element) return

  if (element.id === 'close-popup' || element.closest('#close-popup')) {
    modalVisible.value = false
  }
  else if (element.id === 'link30or60' || element.closest('#link30or60')) {
    router.push(nextRoute.value)
  }
}

function onHint(index: number) {
  if (index === 3) {
    tremorActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousemove', updateCursorPosition)
  document.addEventListener('click', handleFakeClick)

  // Continuous tremor animation
  tremorIntervalId = setInterval(() => {
    applyTremor()
  }, 50)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateCursorPosition)
  document.removeEventListener('click', handleFakeClick)

  if (tremorIntervalId) {
    clearInterval(tremorIntervalId)
  }
})
</script>

<template>
  <ClientOnly>
    <div class="physical fs-2" :class="{ 'no-cursor': tremorActive }">
      <GameHeader :page-title="$t('physical.pageTitle')" />

      <main>
        <div class="mx-4 height40">
          <!-- Instructions Modal -->
          <div
            v-if="modalVisible"
            class="modal d-block"
            tabindex="-1"
            style="background: rgba(0,0,0,0.5);"
          >
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    id="close-popup"
                    class="my-2 ms-auto close-popup border-0 btn"
                    :class="{ 'no-cursor': tremorActive }"
                    :aria-label="$t('physical.aria-label_closeModal')"
                    @click="modalVisible = false"
                  >
                    X
                  </button>
                </div>
                <div class="modal-body">
                  <h1>{{ $t('physical.modalTitle') }}</h1>
                  <h2>{{ $t('physical.descriptionHeading') }}</h2>
                  <p>{{ $t('physical.descriptionText1') }}</p>
                  <p>{{ $t('physical.descriptionText2') }}</p>
                  <h2>{{ $t('physical.userTypeHeading') }}</h2>
                  <p>{{ $t('physical.userTypeText') }}</p>
                  <h2>{{ $t('physical.rulesHeading') }}</h2>
                  <ul>
                    <li>{{ $t('physical.rule1') }}</li>
                    <li>{{ $t('physical.rule2') }}</li>
                    <li>{{ $t('physical.rule3') }}</li>
                  </ul>
                  <GameHints page-id="physical" @hint="onHint" />
                </div>
              </div>
            </div>
          </div>

          <NuxtLink
            id="link30or60"
            :to="nextRoute"
            class="valid fs-3 p-2"
          >
            {{ $t('physical.validateLink') }}
          </NuxtLink>
        </div>
      </main>

      <!-- Fake cursor - follows mouse position with tremor offset -->
      <img
        v-if="tremorActive"
        ref="falseCursorRef"
        src="http://telcontar.net/Misc/screeniecursors/Cursor%20arrow%20white.png"
        class="fake-cursor"
        :style="{
          left: `${cursorX}px`,
          top: `${cursorY}px`,
        }"
        alt=""
      >
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.physical {
  background-color: #f5f5f5 !important;
  color: #000 !important;
  min-height: 100vh;

  * {
    background-color: transparent;
    color: inherit;
  }
}

.physical main {
  background-color: #f5f5f5 !important;
  padding: 2rem;

  * {
    background-color: transparent;
    color: #000;
  }
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

  .modal-dialog {
    margin: auto;
  }

  .modal-content {
    background-color: white !important;
    color: #000 !important;
    border: 1px solid #ddd;

    * {
      background-color: transparent !important;
      color: #000 !important;
    }
  }

  .modal-body {
    padding: 1.5rem;
  }

  .close-popup {
    background-color: transparent !important;
    color: #000 !important;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      color: #666;
    }
  }
}

.no-cursor {
  cursor: none !important;

  * {
    cursor: none !important;
  }
}

.valid {
  display: inline-block;
  padding: 0.75rem 1.5rem !important;
  background-color: #ff6600 !important;
  color: white !important;
  text-decoration: none !important;
  border-radius: 0.25rem;
  font-weight: 600;

  &:hover {
    background-color: #e55a00 !important;
    text-decoration: none !important;
  }
}

.fake-cursor {
  position: fixed !important;
  pointer-events: none !important;
  width: 32px;
  height: 32px;
  z-index: 9999;
  display: block !important;
  opacity: 1 !important;
  object-fit: contain;
}
</style>
