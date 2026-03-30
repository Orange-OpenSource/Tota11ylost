<!-- Tota11y Lost - Hearing Simulation (YouTube video riddle) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'hearingSimu.tabTitle' })

const { t, locale, messages } = useI18n()
const router = useRouter()
const gameStore = useGameStore()

const answer = ref('')
const showError = ref(false)

const possibleResponses = computed(() => {
  // Force reactivity on locale change
  void locale.value

  const responses: string[] = []
  const currentMessages = messages.value[locale.value]

  for (let i = 0; i < 5; i++) {
    // Check if the key exists in the current language
    const keyPath = `hearingSimu.possibleResponses.${i}`
    const nested = keyPath.split('.').reduce((obj: unknown, key: string) => {
      return typeof obj === 'object' && obj !== null ? (obj as Record<string, unknown>)[key] : undefined
    }, currentMessages)

    if (nested === undefined) {
      break
    }

    const resp = t(keyPath)
    responses.push(resp)
  }
  console.log('Possible responses:', responses)
  return responses
})

function validate() {
  const userAnswer = answer.value.toLowerCase()

  if (possibleResponses.value.some(resp => userAnswer.includes(resp.toLowerCase()))) {
    const next = gameStore.getNextRoute('hearing-simulation')
    router.push(next)
  }
  else {
    showError.value = true
  }
}
</script>

<template>
  <ClientOnly>
    <div class="fs-2">
      <GameHeader :page-title="$t('hearingSimu.pageTitle')" />

      <main>
        <div class="mx-4">
          <h2 class="display-2 my-4">
            {{ $t('hearingSimu.pageTitle') }}
          </h2>

          <div class="mb-3 text-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/3rGYUkh7514?modestbranding=1&rel=0&showinfo=0&controls=1"
              :title="$t('hearingSimu.videoTitle')"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <div v-if="showError" class="alert alert-danger mb-3" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('hearingSimu.errorHiddenText') }}</span></span>
            <p>{{ $t('hearingSimu.errorMessage') }}</p>
          </div>

          <div class="mb-3">
            <label for="hearingSimuAnswer" class="form-label">{{ $t('hearingSimu.labelResponse') }}</label>
            <input
              id="hearingSimuAnswer"
              v-model="answer"
              type="text"
              class="form-control"
              :aria-label="$t('hearingSimu.aria-label_response')"
            >
          </div>
          <div class="mb-3">
            <button class="btn fs-3 p-2 btn-primary" @click="validate">
              {{ $t('hearingSimu.validateButton') }}
            </button>
          </div>

          <GameHints page-id="hearingSimulation" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
