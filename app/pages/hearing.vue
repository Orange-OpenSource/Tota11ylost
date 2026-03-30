<!-- Tota11y Lost - Hearing (Progressive deafness simulation) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'hearing.tabTitle' })

const { t, locale } = useI18n()
const router = useRouter()

const answer = ref('')
const showError = ref(false)
const currentLevel = ref(1)
const maxLevel = 5

function audioSrc(level: number) {
  return `/game-assets/mp3/deafness-${level}_${locale.value}.MP3`
}

function getDeafnessLabel(level: number): string {
  const labels = ['profoundDeafness', 'severeDeafness', 'moderateDeafness', 'mildDeafness', 'noDeafness']
  return labels[level - 1] || 'profoundDeafness'
}

function onAudioEnded() {
  if (currentLevel.value < maxLevel) {
    currentLevel.value++
  }
}

function onSeeking(event: Event) {
  // Prevent seeking — reload the audio
  const audio = event.target as HTMLAudioElement
  audio.load()
}

function validate() {
  const userAnswer = answer.value.toLowerCase()

  // Collect responses until we can't find more (max 2)
  const responses: string[] = []
  for (let i = 0; i < 2; i++) {
    const resp = t(`hearing.possibleResponses.${i}`)
    if (resp === `hearing.possibleResponses.${i}`) {
      break
    }
    responses.push(resp)
  }

  if (responses.some(resp => userAnswer.includes(resp.toLowerCase()))) {
    router.push('/hearing-simulation')
  }
  else {
    showError.value = true
  }
}

function onHint(index: number) {
  if (index === 3) {
    // Reveal all audio levels at once
    currentLevel.value = maxLevel
  }
}
</script>

<template>
  <ClientOnly>
    <div class="fs-2">
      <GameHeader :page-title="$t('hearing.pageTitle')" />

      <main>
        <div class="mx-4">
          <h2>{{ $t('hearing.descriptionHeading') }}</h2>
          <p>{{ $t('hearing.descriptionText1') }}</p>
          <p>{{ $t('hearing.descriptionText2') }}</p>
          <p>{{ $t('hearing.descriptionText3') }}</p>

          <h2>{{ $t('hearing.userTypeHeading') }}</h2>
          <p>{{ $t('hearing.userTypeText1') }}</p>
          <p>{{ $t('hearing.userTypeText2') }}</p>
          <p>{{ $t('hearing.userTypeText3') }}</p>

          <h2>{{ $t('hearing.rulesHeading') }}</h2>
          <ul>
            <li>{{ $t('hearing.rule1') }}</li>
            <li>{{ $t('hearing.rule2') }}</li>
            <li>{{ $t('hearing.rule3') }}</li>
            <li>{{ $t('hearing.rule4') }}</li>
            <li>{{ $t('hearing.rule5') }}</li>
          </ul>

          <div v-if="showError" class="alert alert-danger mb-3" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('hearing.errorHiddenText') }}</span></span>
            <p>{{ $t('hearing.errorMessage') }}</p>
          </div>

          <div class="audio-container my-3">
            <div class="row g-3">
              <div v-for="level in maxLevel" :key="level" class="col">
                <div class="audio-item">
                  <p class="audio-label fw-bold mb-2 text-center">
                    {{ $t(`hearing.${getDeafnessLabel(level)}`) }}
                  </p>
                  <audio
                    v-if="level <= currentLevel"
                    controls
                    controlsList="nodownload"
                    class="w-100"
                    @ended="level === currentLevel ? onAudioEnded() : undefined"
                    @seeking="onSeeking"
                  >
                    <source :src="audioSrc(level)" type="audio/mpeg">
                    {{ $t('hearing.audioFallback') }}
                  </audio>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="hearingAnswer" class="form-label">{{ $t('hearing.labelResponse') }}</label>
            <input
              id="hearingAnswer"
              v-model="answer"
              type="text"
              class="form-control"
              :aria-label="$t('hearing.aria-label_response')"
            >
          </div>
          <div class="mb-3">
            <button class="btn fs-3 p-2 btn-primary" @click="validate">
              {{ $t('hearing.validateButton') }}
            </button>
          </div>

          <GameHints page-id="hearing" @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
