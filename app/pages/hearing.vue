<!-- Tota11y Lost - Hearing (Progressive deafness simulation) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'hearing.tabTitle' })

const { t, locale, te } = useI18n()
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

  const responses: string[] = []
  for (let i = 0; te(`hearing.possibleResponses.${i}`); i++) {
    responses.push(t(`hearing.possibleResponses.${i}`).toLowerCase())
  }

  if (responses.some(resp => isFuzzyMatch(userAnswer, resp))) {
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
    <div class="fs-hm mw-none">
      <GameHeader :page-title="$t('hearing.pageTitle')" />

      <main>
        <div class="mx-large">
          <h2>{{ $t('hearing.descriptionHeading') }}</h2>
          <p class="fs-hm" v-html="$t('hearing.descriptionText1')" />
          <p class="fs-hm">
            {{ $t('hearing.descriptionText2') }}
          </p>
          <p class="fs-hm">
            {{ $t('hearing.descriptionText3') }}
          </p>

          <h2>{{ $t('hearing.userTypeHeading') }}</h2>
          <p class="fs-hm">
            {{ $t('hearing.userTypeText1') }}
          </p>
          <p class="fs-hm">
            {{ $t('hearing.userTypeText2') }}
          </p>
          <p class="fs-hm">
            {{ $t('hearing.userTypeText3') }}
          </p>

          <h2>{{ $t('hearing.rulesHeading') }}</h2>
          <ul>
            <li class="fs-hm">
              {{ $t('hearing.rule1') }}
            </li>
            <li class="fs-hm">
              {{ $t('hearing.rule2') }}
            </li>
            <li class="fs-hm">
              {{ $t('hearing.rule3') }}
            </li>
            <li class="fs-hm">
              {{ $t('hearing.rule4') }}
            </li>
            <li class="fs-hm">
              {{ $t('hearing.rule5') }}
            </li>
          </ul>

          <div v-if="showError" class="alert alert-message alert-negative mb-medium" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('hearing.errorHiddenText') }}</span></span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p>{{ $t('hearing.errorMessage') }}</p>
              </div>
            </div>
          </div>

          <div class="audio-container my-medium">
            <div class="row g-3">
              <div v-for="level in maxLevel" :key="level" class="col">
                <div class="audio-item">
                  <p class="audio-label fs-hm fw-bold mb-small text-center">
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

          <div class="mb-medium">
            <label for="hearingAnswer" class="form-label fw-bold">{{ $t('hearing.labelResponse') }}</label>
            <input
              id="hearingAnswer"
              v-model="answer"
              type="text"
              class="form-control"
              :aria-label="$t('hearing.aria-label_response')"
            >
          </div>
          <div class="mb-medium">
            <button class="btn fs-hs p-small btn-brand" @click="validate">
              {{ $t('hearing.validateButton') }}
            </button>
          </div>

          <GameHints page-id="hearing" large-text @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
