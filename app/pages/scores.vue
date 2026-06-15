<!-- Tota11y Lost - Scores (Final scoreboard with Firebase) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'scores.tabTitle' })

const route = useRoute()
const gameStore = useGameStore()
const { t } = useI18n()
const { storeScore, getGeneralScores, getTodayScores } = useFirebaseScores()

interface ScoreEntry {
  pseudo: string
  timer: number
}

const todayScores = ref<ScoreEntry[]>([])
const generalScores = ref<ScoreEntry[]>([])
const pseudo = computed(() => gameStore.pseudo)
const version = computed(() => gameStore.version)

// Visual format: "05min 30s" — aria-hidden, abbreviations from i18n (with EN plurals)
function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h}${t('common.time.hour.abbr', h)}`)
  parts.push(`${String(m).padStart(2, '0')}${t('common.time.minute.abbr', m)}`)
  parts.push(`${String(s).padStart(2, '0')}${t('common.time.second.abbr', s)}`)
  return parts.join(' ')
}

// Accessible format: "5 minutes 30 secondes" — visually hidden, for screen readers
function formatTimeA11y(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h} ${t('common.time.hour.full', h)}`)
  parts.push(`${m} ${t('common.time.minute.full', m)}`)
  parts.push(`${s} ${t('common.time.second.full', s)}`)
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
  case 1: return '/game-assets/rank_gold.svg'
  case 2: return '/game-assets/rank_silver.svg'
  case 3: return '/game-assets/rank_bronze.svg'
  default: return null
  }
}

function isCurrent(entry: ScoreEntry): boolean {
  return entry.pseudo === pseudo.value
}

async function loadScores() {
  try {
    // Stop timer immediately when arriving on scores page
    gameStore.finishTimer()

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
      <main class="d-flex flex-column m-medium mx-large">
        <div class="d-flex flex-row">
          <div class="col-6">
            <h2 class="display-3 mb-large fs-hxl" v-html="$t('scores.congratulations')" />
            <p class="fs-bl fw-bold text-muted">
              {{ $t('scores.finalTime') }}
            </p>
            <div class="d-flex align-items-center fs-3 fw-bold">
              <span aria-hidden="true">{{ finalTimeDisplay }}</span>
              <span class="visually-hidden">{{ formatTimeA11y(finalElapsed) }}</span>
            </div>
            <p class="fw-bold mt-medium fs-bl" v-html="$t('scores.toKnowMore')" />
          </div>
          <div class="col-6 ms-2xlarge m-medium position-relative text-always-black scores-img d-flex justify-content-center">
            <img id="congratulationImage" src="/game-assets/Win.svg" :alt="$t('scores.alt_congratulationImage', { version })">
            <div class="position-absolute top-50 end-0 translate-middle-y mt-5" aria-hidden="true">
              <p class="display-0 m-0 fw-bold text-center">
                {{ version }}
              </p>
              <p class="fs-hxl fw-bold text-center">
                {{ $t('scores.minutes') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Score tables -->
        <div class="d-flex fw-bold flex-row">
          <!-- Today -->
          <div class="border col-5 m-medium">
            <p class="text-center my-medium fs-hs">
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
                    <td class="py-small vertical-align" :class="{ 'current': isCurrent(entry), 'fs-bl': isCurrent(entry) }">
                      {{ index + 1 }}
                    </td>
                    <td class="text-start py-small" :class="{ current: isCurrent(entry) }">
                      <p class="mb-none" :class="{ 'fs-bl': isCurrent(entry) }">
                        {{ entry.pseudo }}
                      </p>
                      <p class="mb-0 fs-6" :class="isCurrent(entry) ? 'text-white' : 'text-body-secondary'">
                        <span aria-hidden="true">{{ formatTime(entry.timer) }}</span>
                        <span class="visually-hidden">{{ formatTimeA11y(entry.timer) }}</span>
                      </p>
                    </td>
                    <td class="py-small vertical-align" aria-hidden="true">
                      <img
                        v-if="trophySrc(index + 1)"
                        :src="trophySrc(index + 1)!"
                        alt=""
                        class="trophy-img"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- General -->
          <div class="border col-5 m-medium">
            <p class="text-center my-medium fs-hs">
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
                    <td class="py-small vertical-align" :class="{ 'current': isCurrent(entry), 'fs-bl': isCurrent(entry) }">
                      {{ index + 1 }}
                    </td>
                    <td class="text-start py-small" :class="{ current: isCurrent(entry) }">
                      <p class="mb-none" :class="{ 'fs-bl': isCurrent(entry) }">
                        {{ entry.pseudo }}
                      </p>
                      <p class="mb-0 fs-6" :class="isCurrent(entry) ? 'text-white' : 'text-body-secondary'">
                        <span aria-hidden="true">{{ formatTime(entry.timer) }}</span>
                        <span class="visually-hidden">{{ formatTimeA11y(entry.timer) }}</span>
                      </p>
                    </td>
                    <td class="py-small vertical-align" aria-hidden="true">
                      <img
                        v-if="trophySrc(index + 1)"
                        :src="trophySrc(index + 1)!"
                        alt=""
                        class="trophy-img"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
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

.trophy-img {
  height: 40px;
  width: auto;
}

.vertical-align {
  vertical-align: middle;
}
</style>
