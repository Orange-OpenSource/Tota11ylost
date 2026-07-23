<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'memorie.tabTitle' })

const { t } = useI18n()
const { goToNextPage } = useNextPage()

const textVisible = ref(false)
const simulationDisabled = ref(false)
const showTextButtonUsed = ref(false)
const answers = ref<string[]>(Array.from({ length: 8 }, () => ''))
const fieldErrors = ref<string[]>(Array.from({ length: 8 }, () => ''))
const showError = ref(false)
const textSectionRef = ref<HTMLElement | null>(null)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

function revealText(durationSeconds: number) {
  textVisible.value = true
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  hideTimeout = setTimeout(() => {
    textVisible.value = false
  }, durationSeconds * 1000)
}

function scrollToText() {
  textSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  textSectionRef.value?.focus()
}

function onShowTextClick() {
  showTextButtonUsed.value = true
  revealText(15)
}

function onHint(index: number) {
  if (index === 1) {
    revealText(10)
    scrollToText()
  }
  else if (index === 2) {
    revealText(20)
    scrollToText()
  }
  else if (index === 3) {
    simulationDisabled.value = true
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    textVisible.value = true
  }
}

function validate() {
  let hasEmptyField = false
  fieldErrors.value = answers.value.map((answer) => {
    if (answer.trim() === '') {
      hasEmptyField = true
      return t('memorie.requiredFieldError')
    }
    return ''
  })

  if (hasEmptyField) {
    showError.value = false
    return
  }

  const allCorrect = answers.value.every((answer, i) =>
    isFuzzyMatch(answer.trim().toLowerCase(), t(`memorie.listOfResponses.${i}`)),
  )

  if (allCorrect) {
    showError.value = false
    goToNextPage()
  }
  else {
    showError.value = true
  }
}

onUnmounted(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
})
</script>

<template>
  <div class="fs-hm mw-none">
    <GameHeader :page-title="$t('memorie.pageTitle')" />

    <main>
      <div class="fs-hm mx-large">
        <h2 class="my-small">
          {{ $t('memorie.descriptionHeading') }}
        </h2>
        <p class="fs-hm">
          {{ $t('memorie.descriptionText1') }}
        </p>
        <h2 class="my-small">
          {{ $t('memorie.userTypeHeading') }}
        </h2>
        <p class="fs-hm">
          {{ $t('memorie.userTypeText') }}
        </p>
        <h2 class="my-small">
          {{ $t('memorie.rulesHeading') }}
        </h2>
        <ul>
          <li class="fs-hm">
            {{ $t('memorie.rule1') }}
          </li>
          <li class="fs-hm">
            {{ $t('memorie.rule2') }}
          </li>
          <li class="fs-hm">
            {{ $t('memorie.rule3') }}
          </li>
        </ul>
        <h2 class="my-small">
          {{ $t('memorie.textHeading') }}
        </h2>
        <button
          ref="textSectionRef"
          class="btn fs-hs p-small btn-brand my-small"
          tabindex="-1"
          :disabled="showTextButtonUsed"
          @click="onShowTextClick"
        >
          {{ $t('memorie.showTextButton') }}
        </button>
        <p v-if="textVisible" class="fs-hm">
          {{ $t('memorie.storyText') }}
        </p>
        <h2 class="my-small">
          {{ $t('memorie.formHeading') }}
        </h2>
        <p class="fs-hm">
          {{ $t('memorie.allFieldsRequired') }}
        </p>

        <form @submit.prevent="validate">
          <div class="mb-medium">
            <label v-if="textVisible" for="q1" class="form-label fw-bold fs-hs">{{ $t('memorie.question1') }}</label>
            <input
              id="q1"
              v-model="answers[0]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question1')"
              :aria-describedby="fieldErrors[0] ? 'q1-error' : undefined"
            >
            <div v-if="fieldErrors[0]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q1-error">
                    {{ fieldErrors[0] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q2" class="form-label fw-bold fs-hs">{{ $t('memorie.question2') }}</label>
            <input
              id="q2"
              v-model="answers[1]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question2')"
              :aria-describedby="fieldErrors[1] ? 'q2-error' : undefined"
            >
            <div v-if="fieldErrors[1]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q2-error">
                    {{ fieldErrors[1] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q3" class="form-label fw-bold fs-hs">{{ $t('memorie.question3') }}</label>
            <input
              id="q3"
              v-model="answers[2]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question3')"
              :aria-describedby="fieldErrors[2] ? 'q3-error' : undefined"
            >
            <div v-if="fieldErrors[2]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q3-error">
                    {{ fieldErrors[2] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q4" class="form-label fw-bold fs-hs">{{ $t('memorie.question4') }}</label>
            <input
              id="q4"
              v-model="answers[3]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question4')"
              :aria-describedby="fieldErrors[3] ? 'q4-error' : undefined"
            >
            <div v-if="fieldErrors[3]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q4-error">
                    {{ fieldErrors[3] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q5" class="form-label fw-bold fs-hs">{{ $t('memorie.question5') }}</label>
            <input
              id="q5"
              v-model="answers[4]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question5')"
              :aria-describedby="fieldErrors[4] ? 'q5-error' : undefined"
            >
            <div v-if="fieldErrors[4]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q5-error">
                    {{ fieldErrors[4] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q6" class="form-label fw-bold fs-hs">{{ $t('memorie.question6') }}</label>
            <input
              id="q6"
              v-model="answers[5]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question6')"
              :aria-describedby="fieldErrors[5] ? 'q6-error' : undefined"
            >
            <div v-if="fieldErrors[5]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q6-error">
                    {{ fieldErrors[5] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q7" class="form-label fw-bold fs-hs">{{ $t('memorie.question7') }}</label>
            <input
              id="q7"
              v-model="answers[6]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question7')"
              :aria-describedby="fieldErrors[6] ? 'q7-error' : undefined"
            >
            <div v-if="fieldErrors[6]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q7-error">
                    {{ fieldErrors[6] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-medium">
            <label v-if="textVisible" for="q8" class="form-label fw-bold fs-hs">{{ $t('memorie.question8') }}</label>
            <input
              id="q8"
              v-model="answers[7]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question8')"
              :aria-describedby="fieldErrors[7] ? 'q8-error' : undefined"
            >
            <div v-if="fieldErrors[7]" class="alert alert-message alert-negative alert-sm">
              <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p id="q8-error">
                    {{ fieldErrors[7] }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showError" class="alert alert-message alert-negative mb-medium" role="alert">
            <span class="alert-icon"><span class="visually-hidden">{{ $t('memorie.errorHiddenText') }}</span></span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p>{{ $t('memorie.errorMessage') }}</p>
              </div>
            </div>
          </div>

          <button class="btn p-small fs-hs btn-brand my-small" type="submit">
            {{ $t('memorie.validateButton') }}
          </button>
        </form>

        <GameHints
          page-id="memorie"
          large-text
          :delay-ms="45000"
          @hint="onHint"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
