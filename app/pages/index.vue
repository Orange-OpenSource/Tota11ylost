<!-- Tota11y Lost - Welcome Page (Game entry point) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ title: 'welcome.tabTitle' })

const gameStore = useGameStore()

onMounted(() => {
  gameStore.setVersion('60')
})
const router = useRouter()
const { validatePseudo, getPseudoErrorMessage, PSEUDO_MAX_LENGTH } = usePseudoValidation()
gameStore.resetAll()
const pseudo = ref('')
const pseudoErrorCode = ref<'tooShort' | 'profanity' | null>(null)
const sessionCode = ref('')

function onSessionCodeInput() {
  if (sessionCode.value) {
    gameStore.setSessionCode(sessionCode.value)
  }
  else {
    gameStore.setSessionCode('')
  }
}

function startAdventure() {
  const error = validatePseudo(pseudo.value)
  if (error) {
    pseudoErrorCode.value = error
    return
  }
  pseudoErrorCode.value = null
  gameStore.setPseudo(pseudo.value.trim())
  gameStore.startTimer()

  gameStore.saveToLocalStorage()

  // index is not in selectedPages, so navigate to the first page without shifting
  const firstPage = gameStore.selectedPages[0]
  if (firstPage) {
    router.push(firstPage)
  }
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100 position-relative">
    <div class=" bg-tertiary d-none md:d-flex justify-content-end  position-absolute" style="width: 100%; z-index: -1;">
      <!-- Capped to the right third of the viewport so it never slides under the col-8 form -->
      <img
        src="/game-assets/rocket_boy.svg"
        alt=""
        class="me-3xlarge"
        style="width: 32rem; max-width: 33vw; height: auto;"
      >
    </div>
    <main class="d-flex flex-row m-medium ms-large flex-grow-1 ">
      <div class="col-12 md:col-8">
        <form class="px-xlarge pt-xlarge mt-2xlarge mx-xlarge bg-primary" @submit.prevent="startAdventure">
          <h2 style="font-size: 22px; margin-left: -10px;" class="text-brand-primary p-small mb-3xsmall ">
            {{ $t('welcome.accessibility') }}
          </h2>
          <h2 class="mb-large">
            {{ $t('welcome.intro') }}
          </h2>
          <p class="col-9 mb-2xlarge">
            {{ $t('welcome.rules') }}
          </p>

          <h4 id="aventureLabel" class="mt-small">
            {{ $t('welcome.aventure') }}
          </h4>
          <hr style="border: 3px solid #f15E00; width: 3%; margin-top: -13px;">

          <div class="select-input mb-medium component-max-width">
            <div class="select-input-container adventure-type-select">
              <label class="form-label text-muted" style="color: black; " for="exampleDisabledSelect">
                {{ $t('welcome.adventureType') }}
              </label>
              <select
                id="exampleDisabledSelect"
                style="background-color: white; border: 2px solid #d3d3d3; color: black; font-weight: bold; width: 100%;"
                disabled
                class="select-input-field"
              >
                <option value="" selected>
                  {{ $t('welcome.escapeGame') }}
                </option>
              </select>
            </div>
          </div>

          <div class="alert alert-message alert-info mb-xlarge mt-xlarge w-75">
            <div class="alert-icon" />
            <div class="alert-container">
              <div class="alert-text-container">
                <p id="sessionCodeInfo" class="alert-label">
                  {{ $t('welcome.sessionCodeDurationInfo') }}
                </p>
              </div>
            </div>
          </div>

          <div class="text-input component-max-width">
            <div class="text-input-container">
              <label for="sessionCodeInput">{{ $t('welcome.sessionCode') }}</label>
              <input
                id="sessionCodeInput"
                v-model="sessionCode"
                type="text"
                autocomplete="off"
                class="text-input-field"
                maxlength="20"
                placeholder=" "
                aria-describedby="sessionCodeInfo sessionCodeHelpBlock"
                @input="onSessionCodeInput"
              >
            </div>
            <p id="sessionCodeHelpBlock" class="helper-text">
              {{ $t('welcome.sessionCodeHelper') }}
            </p>
          </div>

          <fieldset class="control-items-list mt-xlarge">
            <p class="fs-cm">
              {{ $t('welcome.duration') }}
            </p>
            <div class="d-flex flex-row m-large mt-3xsmall gap-large">
              <div class="radio-button-item">
                <div class="control-item-assets-container">
                  <input
                    id="15min"
                    class="control-item-indicator"
                    type="radio"
                    name="gameDuration"
                    :title="$t('welcome.15min.title_15')"
                    :checked="gameStore.version === '15'"
                    :disabled="!!sessionCode"
                    @change="gameStore.setVersion('15')"
                  >
                </div>
                <div class="control-item-text-container">
                  <label class="control-item-label" for="15min">{{ $t('welcome.15min.label') }}</label>
                </div>
              </div>
              <div class="radio-button-item ">
                <div class="control-item-assets-container">
                  <input
                    id="30min"
                    class="control-item-indicator"
                    type="radio"
                    name="gameDuration"
                    :title="$t('welcome.30min.title_30')"
                    :checked="gameStore.version === '30'"
                    :disabled="!!sessionCode"
                    @change="gameStore.setVersion('30')"
                  >
                </div>
                <div class="control-item-text-container">
                  <label class="control-item-label" for="30min">{{ $t('welcome.30min.label') }}</label>
                </div>
              </div>
              <div class="radio-button-item ">
                <div class="control-item-assets-container">
                  <input
                    id="60min"
                    class="control-item-indicator"
                    type="radio"
                    name="gameDuration"
                    :title="$t('welcome.60min.title_60')"
                    :checked="gameStore.version === '60'"
                    :disabled="!!sessionCode"
                    @change="gameStore.setVersion('60')"
                  >
                </div>
                <div class="control-item-text-container">
                  <label class="control-item-label" for="60min">{{ $t('welcome.60min.label') }}</label>
                </div>
              </div>
            </div>
          </fieldset>

          <h4 id="profileLabel" class="mt-small">
            {{ $t('welcome.profile') }}
          </h4>
          <hr style="border: 3px solid #f15E00; width: 3%; margin-top: -13px;">

          <div class="text-input component-max-width mt-xlarge">
            <div class="text-input-container">
              <label for="pseudoInput">{{ $t('welcome.placeholder_enterPseudo') }}</label>
              <input
                id="pseudoInput"
                v-model="pseudo"
                type="text"
                autocomplete="off"
                class="text-input-field"
                :maxlength="PSEUDO_MAX_LENGTH"
                placeholder=" "
                aria-required="true"
                :aria-describedby="pseudoErrorCode ? 'pseudoErrorContainer pseudoHelpBlock' : 'pseudoHelpBlock'"
                @input="pseudoErrorCode = null"
              >
            </div>
            <p id="pseudoHelpBlock" class="helper-text">
              {{ $t('welcome.pseudo_alert') }}
            </p>
          </div>
          <div
            v-if="pseudoErrorCode"
            id="pseudoErrorContainer"
            class="alert alert-message alert-negative mt-3"
            role="alert"
          >
            <span class="alert-icon" aria-hidden="true">
              <p class="visually-hidden">Error</p>
            </span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p class="alert-label">
                  {{ $t(getPseudoErrorMessage(pseudoErrorCode)) }}
                </p>
              </div>
            </div>
          </div>

          <p class="mt-xlarge mb-large   w-75">
            {{ $t('welcome.deficiencyInfo') }}
          </p>
          <DeficiencyFilter />

          <button type="submit" class="btn btn-strong fs-hs p-small  my-2xlarge">
            {{ $t('welcome.buttonStartAdventure') }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.select-input-field,
.select-input-field option {
  color: black !important;
  background-color: white !important;
  -webkit-text-fill-color: black !important;
}

/*
 * Fix for OUDS @ouds/web-common 1.3.0 select-input bug: the "floated" label
 * position (small text, moved to the top) is only applied via the selector
 * `:not(:has(.select-input-field:disabled:checked))`. Since this select is
 * permanently disabled with a pre-selected option, that condition never
 * matches, so the label stays vertically centered and overlaps the select's
 * text. This select never changes state, so we force the floated position
 * unconditionally instead of relying on that (buggy) dynamic selector.
 */
.adventure-type-select > label {
  top: calc(var(--bs-text-input-padding-y) + .5 * (var(--bs-font-size-label-small) * var(--bs-font-line-height-label-small)) + .5 * (var(--bs-text-input-min-height) - 2 * var(--bs-text-input-padding-y) - var(--bs-font-size-label-small) * var(--bs-font-line-height-label-small) - var(--bs-font-size-label-large) * var(--bs-font-line-height-label-large))) !important;
  white-space: nowrap;
  font-size: var(--bs-font-size-label-small);
  line-height: var(--bs-font-line-height-label-small);
  letter-spacing: var(--bs-font-letter-spacing-label-small);
}
</style>
