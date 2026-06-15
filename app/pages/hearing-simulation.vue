<!-- Tota11y Lost - Hearing Simulation (YouTube video riddle) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'hearingSimu.tabTitle' })
const { t } = useI18n()
const { goToNextPage } = useNextPage()

const answer = ref('')
const showError = ref(false)

function validate() {
  const userAnswer = answer.value.toLowerCase().trim()

  // Vérifier si la réponse contient l'un des mots-clés attendus
  const expectedAnswers = [
    t('hearingSimu.possibleResponses.0'),
    t('hearingSimu.possibleResponses.1'),
    t('hearingSimu.possibleResponses.2'),
    t('hearingSimu.possibleResponses.3'),
    t('hearingSimu.possibleResponses.4'),
  ].map(a => a.toLowerCase())

  if (expectedAnswers.some(answer => userAnswer.includes(answer))) {
    goToNextPage()
  }
  else {
    showError.value = true
  }
}
</script>

<template>
  <ClientOnly>
    <div class="fs-small mw-none">
      <GameHeader :page-title="$t('hearingSimu.pageTitle')" />

      <main>
        <div class="mx-large">
          <h2 class="display-2 my-large fs-ds">
            {{ $t('hearingSimu.pageTitle') }}
          </h2>

          <div class="mb-medium text-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/3rGYUkh7514?modestbranding=1&rel=0&showinfo=0&controls=1"
              :title="$t('hearingSimu.videoTitle')"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <div v-if="showError" class="alert alert-message alert-negative mb-medium" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('hearingSimu.errorHiddenText') }}</span></span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p>{{ $t('hearingSimu.errorMessage') }}</p>
              </div>
            </div>
          </div>

          <div class="mb-medium">
            <label for="hearingSimuAnswer" class="form-label fs-hm fw-bold">{{ $t('hearingSimu.labelResponse') }}</label>
            <input
              id="hearingSimuAnswer"
              v-model="answer"
              type="text"
              class="form-control"
              :aria-label="$t('hearingSimu.aria-label_response')"
            >
          </div>
          <div class="mb-medium">
            <button class="btn fs-hs p-small btn-brand" @click="validate">
              {{ $t('hearingSimu.validateButton') }}
            </button>
          </div>

          <GameHints page-id="hearingSimulation" large-text />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
