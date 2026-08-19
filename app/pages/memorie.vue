<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'memorie.tabTitle' })

const { t } = useI18n()
const { goToNextPage } = useNextPage()

const textVisible = ref(false)
const simulationDisabled = ref(false)
const showTextButtonUsed = ref(false)
const answers = ref<string[]>(Array.from({ length: 8 }, () => ''))
const fieldErrors = ref<string[]>(Array.from({ length: 8 }, () => ''))
const textSectionRef = ref<HTMLElement | null>(null)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// Only these indices have an actual form field in the template
// (questions 2, 4, 6 — indices 1, 3, 5 — were removed).
const ACTIVE_FIELD_INDICES = [0, 2, 4, 6, 7]

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
  revealText(45)
}

function onHint(index: number) {
  if (index === 1) {
    revealText(20)
    scrollToText()
  }
  else if (index === 2) {
    revealText(30)
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
  const requiredErrors = [...fieldErrors.value]
  ACTIVE_FIELD_INDICES.forEach((i) => {
    if (answers.value[i]!.trim() === '') {
      hasEmptyField = true
      requiredErrors[i] = t('memorie.requiredFieldError')
    }
    else {
      requiredErrors[i] = ''
    }
  })
  fieldErrors.value = requiredErrors

  if (hasEmptyField) {
    return
  }

  let hasWrongField = false
  const wrongErrors = [...fieldErrors.value]
  ACTIVE_FIELD_INDICES.forEach((i) => {
    // Exact match only: this simulates a memory impairment, so answers
    // should not be forgiven for typos like on other pages (no fuzzy match).
    const correct = answers.value[i]!.trim().toLowerCase() === t(`memorie.listOfResponses.${i}`)
    if (!correct) {
      hasWrongField = true
      wrongErrors[i] = t('memorie.errorMessage')
    }
    else {
      wrongErrors[i] = ''
    }
  })
  fieldErrors.value = wrongErrors

  if (!hasWrongField) {
    goToNextPage()
  }
}

// Clears the "required field" error as soon as the user starts typing.
// A "wrong answer" error is left in place until the next validation attempt.
function onFieldInput(index: number) {
  if (fieldErrors.value[index] === t('memorie.requiredFieldError')) {
    fieldErrors.value[index] = ''
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
              @input="onFieldInput(0)"
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
            <label v-if="textVisible" for="q3" class="form-label fw-bold fs-hs">{{ $t('memorie.question3') }}</label>
            <input
              id="q3"
              v-model="answers[2]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question3')"
              :aria-describedby="fieldErrors[2] ? 'q3-error' : undefined"
              @input="onFieldInput(2)"
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
            <label v-if="textVisible" for="q5" class="form-label fw-bold fs-hs">{{ $t('memorie.question5') }}</label>
            <input
              id="q5"
              v-model="answers[4]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question5')"
              :aria-describedby="fieldErrors[4] ? 'q5-error' : undefined"
              @input="onFieldInput(4)"
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
            <label v-if="textVisible" for="q7" class="form-label fw-bold fs-hs">{{ $t('memorie.question7') }}</label>
            <input
              id="q7"
              v-model="answers[6]"
              type="text"
              class="form-control"
              :aria-label="$t('memorie.question7')"
              :aria-describedby="fieldErrors[6] ? 'q7-error' : undefined"
              @input="onFieldInput(6)"
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
              @input="onFieldInput(7)"
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
