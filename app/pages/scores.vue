<!-- Tota11y Lost - Scores (Final scoreboard with Firebase) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'scores.tabTitle' })

const route = useRoute()
const gameStore = useGameStore()
const { storeScore, getGeneralScores, getTodayScores } = useFirebaseScores()

interface ScoreEntry {
  pseudo: string
  timer: number
}

const todayScores = ref<ScoreEntry[]>([])
const generalScores = ref<ScoreEntry[]>([])
const pseudo = computed(() => gameStore.pseudo)
const version = computed(() => gameStore.version)

// Format time from ms to displayable string
function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  parts.push(`${String(m).padStart(2, '0')}min`)
  parts.push(`${String(s).padStart(2, '0')}s`)
  return parts.join(' ')
}

// Final elapsed time
const finalElapsed = computed(() => {
  if (gameStore.timerStartTime && gameStore.timerFinishTime) {
    return gameStore.timerFinishTime - gameStore.timerStartTime
  }
  return 0
})

const finalTimeDisplay = computed(() => formatTime(finalElapsed.value))

// Trophy image per position
function trophySrc(position: number): string | null {
  switch (position) {
    case 1: return '/game-assets/rank=gold.svg'
    case 2: return '/game-assets/rank=silver.svg'
    case 3: return '/game-assets/rank=bronze.svg'
    default: return null
  }
}

function isCurrent(entry: ScoreEntry): boolean {
  return entry.pseudo === pseudo.value
}

async function loadScores() {
  try {
    // Store score if URL has ?store=true
    const store = route.query.store
    if (pseudo.value && pseudo.value.length > 0 && store) {
      await storeScore(pseudo.value, version.value)
    }

    todayScores.value = await getTodayScores(version.value)
    generalScores.value = await getGeneralScores(version.value)
  }
  catch (e) {
    console.error('Failed to load scores:', e)
  }
}

onMounted(loadScores)
</script>

<template>
  <ClientOnly>
    <div class="d-flex flex-column min-vh-100">
      <!-- Main -->
      <main class="d-flex flex-column m-3 mx-4">
        <div class="d-flex flex-row">
          <div class="col-6">
            <h2 class="display-3 mb-4">
              {{ $t('scores.congratulations') }}
            </h2>
            <p class="fs-6 fw-bold text-body-secondary">
              {{ $t('scores.finalTime') }}
            </p>
            <div class="d-flex align-items-center fs-3 fw-bold">
              {{ finalTimeDisplay }}
            </div>
            <p class="fw-bold mt-3 fs-4">
              {{ $t('scores.toKnowMore') }}
            </p>
          </div>
          <div class="col-5 m-3 position-relative text-dark scores-img">
            <img id="congratulationImage" src="/game-assets/Win.svg" :alt="$t('scores.alt_congratulationImage', { version })">
            <div class="position-absolute top-50 start-50 translate-middle mt-5" aria-hidden="true">
              <p class="display-0 m-0 fw-bold text-center">
                {{ version }}
              </p>
              <p class="fs-1 fw-bold text-center">
                {{ $t('scores.minutes') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Score tables -->
        <div class="d-flex fw-bold flex-row">
          <!-- Today -->
          <div class="border border-light col-5 m-3">
            <p class="text-center my-3 fs-4">
              {{ $t('scores.todayTitle') }}
            </p>
            <div class="scrollable-table-container">
              <table class="table table-responsive">
                <tbody>
                  <tr
                    v-for="(entry, index) in todayScores"
                    :key="`today-${index}`"
                    :class="{ 'current-score': isCurrent(entry) }"
                  >
                    <td class="py-7 vertical-align" :class="{ 'current': isCurrent(entry), 'fs-5': isCurrent(entry) }">
                      {{ index + 1 }}
                    </td>
                    <td class="text-start py-7" :class="{ current: isCurrent(entry) }">
                      <p class="mb-0" :class="{ 'fs-5': isCurrent(entry) }">
                        {{ entry.pseudo }}
                      </p>
                      <p class="mb-0 fs-6" :class="isCurrent(entry) ? 'text-white' : 'text-body-secondary'">
                        {{ formatTime(entry.timer) }}
                      </p>
                    </td>
                    <td class="py-7 vertical-align" aria-hidden="true">
                      <img
                        v-if="trophySrc(index + 1)"
                        :src="trophySrc(index + 1)!"
                        alt=""
                        :class="{ zoom: isCurrent(entry) }"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- General -->
          <div class="border border-light col-5 m-3">
            <p class="text-center my-3 fs-4">
              {{ $t('scores.generalTitle') }}
            </p>
            <div class="scrollable-table-container">
              <table class="table table-responsive">
                <tbody>
                  <tr
                    v-for="(entry, index) in generalScores"
                    :key="`general-${index}`"
                    :class="{ 'current-score': isCurrent(entry) }"
                  >
                    <td class="py-7 vertical-align" :class="{ 'current': isCurrent(entry), 'fs-5': isCurrent(entry) }">
                      {{ index + 1 }}
                    </td>
                    <td class="text-start py-7" :class="{ current: isCurrent(entry) }">
                      <p class="mb-0" :class="{ 'fs-5': isCurrent(entry) }">
                        {{ entry.pseudo }}
                      </p>
                      <p class="mb-0 fs-6" :class="isCurrent(entry) ? 'text-white' : 'text-body-secondary'">
                        {{ formatTime(entry.timer) }}
                      </p>
                    </td>
                    <td class="py-7 vertical-align" aria-hidden="true">
                      <img
                        v-if="trophySrc(index + 1)"
                        :src="trophySrc(index + 1)!"
                        alt=""
                        :class="{ zoom: isCurrent(entry) }"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <TheFooter />
    </div>
  </ClientOnly>
</template>

<style scoped>
.scrollable-table-container {
  max-height: 400px;
  overflow-y: auto;
}

.current-score {
  background-color: var(--bs-primary, #ff7900);
}

.current {
  color: #fff;
}

.scores-img {
  max-width: 300px;
}

.zoom {
  animation: zoom 1s ease-in-out infinite alternate;
}

@keyframes zoom {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

.vertical-align {
  vertical-align: middle;
}
</style>
