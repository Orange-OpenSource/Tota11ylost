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
const categoriesRestantes = computed(() => gameStore.categoriesRestantes)

// Catégories sélectionnées (inverse des restantes)
const selectedCategories = computed(() => {
  const allCategories = ['visual', 'physical', 'hearing', 'cognitive']
  return allCategories.filter(cat => !categoriesRestantes.value.includes(cat))
})

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
    <div class="d-flex flex-column min-vh-100 position-relative">
      <div class="bg-tertiary d-flex justify-content-end position-absolute" style="width: 100%; z-index: -1;">
        <img
          id="congratulationImage"
          src="/game-assets/winners.png"
          :alt="$t('scores.alt_congratulationImage', { version })"
          class="me-3xlarge"
        >
        <div class="position-absolute top-50 start-50 translate-middle mt-3xlarge" aria-hidden="true" />
      </div>

      <main class="d-flex flex-row m-medium ms-large flex-grow-1">
        <div class="col-8">
          <div class="px-xlarge pt-xlarge mt-2xlarge mx-xlarge bg-primary w-85">
            <div class="col-6 w-100">
              <h2 style="font-size: 2rem;" class="display-3 mb-large fs-hxl w-100" v-html="$t('scores.congratulations', { pseudo, finalTimeDisplay })" />
              <p class="fs-bl fw-bold text-muted w-100">
                {{ $t('scores.finalTime') }}
              </p>
              <ul class="align-items-center fs-hs fw-bold">
                <li class="">
                  <p>{{ $t('scores.aventureType') }}</p>
                </li>
                <li aria-hidden="true" class="">
                  <p>{{ $t('scores.timeList') }}{{ finalTimeDisplay }}</p>
                </li>
                <li class="visually-hidden">
                  {{ formatTimeA11y(finalElapsed) }}
                </li>
                <li aria-hidden="true" class="">
                  <p>{{ $t('scores.defeciencyList') }}  {{ selectedCategories.join(' et ') }}</p>
                </li>
              </ul>

              <div class="alert alert-message alert-info " style="margin-right: 20px; margin-bottom: 20px;">
                <div class="alert-icon" />
                <div class="alert-container">
                  <div class="alert-text-container">
                    <p class="alert-label">
                      {{ $t('scores.toKnowMore') }}
                    </p>
                    <a
                      :href="$t('scores.link')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="alert-link"
                    >{{ $t('scores.nameLink') }}</a>
                  </div>
                </div>
              </div>

              <a href="./" class="btn btn-default">Nouvelle aventure</a>
            </div>

            <!-- Score tables -->
            <h3 class=" my-medium fs-hs fw-bold">
              {{ $t('scores.tabTitle') }}
            </h3>
            <div class="d-flex gap-medium ">
              <!-- Today -->
              <div class="border col-6 w-75">
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
                        <td class="text-start py-small" :class="{ current: isCurrent(entry) }">
                          <p class="mb-none" :class="{ 'fs-bl': isCurrent(entry) }">
                            {{ entry.pseudo }}
                          </p>
                          <p class="mb-none fs-bm" :class="isCurrent(entry) ? 'text-always-white' : 'text-muted'">
                            <span aria-hidden="true">{{ formatTime(entry.timer) }}</span>
                            <span class="visually-hidden">{{ formatTimeA11y(entry.timer) }}</span>
                          </p>
                        </td>
                        <td class="py-small vertical-align" :class="{ 'current': isCurrent(entry), 'fs-bl': isCurrent(entry) }">
                          <span v-if="(index + 1) <= 3" class="star">★ {{ index + 1 }}</span>
                          <span v-else>{{ index + 1 }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- General -->
              <div class="border col-6  w-75">
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
                        <td class="text-start py-small" :class="{ current: isCurrent(entry) }">
                          <p class="mb-none" :class="{ 'fs-bl': isCurrent(entry) }">
                            {{ entry.pseudo }}
                          </p>
                          <p class="mb-none fs-bm" :class="isCurrent(entry) ? 'text-always-white' : 'text-muted'">
                            <span aria-hidden="true">{{ formatTime(entry.timer) }}</span>
                            <span class="visually-hidden">{{ formatTimeA11y(entry.timer) }}</span>
                          </p>
                        </td>
                        <td class="py-small vertical-align" :class="{ 'current': isCurrent(entry), 'fs-bl': isCurrent(entry) }">
                          <span v-if="(index + 1) <= 3" class="star">★ {{ index + 1 }}</span>
                          <span v-else>{{ index + 1 }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
