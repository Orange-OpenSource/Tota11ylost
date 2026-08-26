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
    <div class=" bg-tertiary d-flex justify-content-end  position-absolute" style="width: 100%; z-index: -1;">
      <img src="/game-assets/rocket_boy.svg" alt="" class="me-3xlarge">
    </div>
    <main class="d-flex flex-row m-medium ms-large flex-grow-1 ">
      <div class="col-8  ">
        <form class="px-xlarge pt-xlarge mt-2xlarge mx-xlarge bg-primary" @submit.prevent="startAdventure">
          <h2 style="font-size: 22px; margin-left: -10px;" class="text-brand-primary p-small ">
            {{ $t('welcome.accessibility') }}
          </h2>
          <h2 class="mb-3xlarge">
            {{ $t('welcome.intro') }}
          </h2>
          <p class="col-9 mb-large">
            {{ $t('welcome.rules') }}
          </p>

          <h4 id="aventureLabel" class="mt-small">
            {{ $t('welcome.aventure') }}
          </h4>
          <div class="text-input w-50 bg-secondary">
            <div class="text-input-container text-input-container-outlined">
              <label id="pseudoLabel" for="exampleTextInputOutlined">{{ $t('welcome.placeholder_enterPseudo') }}</label>
              <input
                id="exampleTextInputOutlined"
                v-model="pseudo"
                type="text"
                class="text-input-field "
                aria-labelledby="pseudoLabel"
                aria-describedby="pseudoErrorContainer"
                :maxlength="PSEUDO_MAX_LENGTH"
                placeholder=""
                style="border-top: transparent; border-left: transparent; border-right: transparent; width: 555px; font-weight: bold;"
                @input="pseudoErrorCode = null"
              >
            </div>
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
          <p class="col-9 mb-large">
            {{ $t('welcome.pseudo_alert') }}
          </p>

          <div class="select-input mb-medium w-50">
            <div class="select-input-container adventure-type-select">
              <label class="form-label " style="color: black; " for="exampleDisabledSelect">
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

          <fieldset class="control-items-list mt-medium">
            <p>{{ $t('welcome.duration') }} :</p>
            <div class="d-flex flex-row m-large">
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

          <div class="mt-medium mb-medium w-75">
            <label for="sessionCodeInput" class="form-label" style="color: black;">
              {{ $t('welcome.sessionCode') }}
            </label>
            <p class="mb-small text-muted" style="font-size: 0.875rem;">
              {{ $t('welcome.sessionCodeHint') }}
            </p>
            <input
              id="sessionCodeInput"
              v-model="sessionCode"
              type="text"
              class="text-input-field"
              maxlength="20"
              :placeholder="$t('welcome.sessionCodePlaceholder')"
              style="border: 2px solid #d3d3d3; width: 300px; font-weight: bold; padding: 0.5rem;"
              @input="onSessionCodeInput"
            >
          </div>

          <div class="alert alert-message alert-info mb-medium w-75">
            <div class="alert-icon" />
            <div class="alert-container">
              <div class="alert-text-container">
                <p class="alert-label">
                  {{ $t('welcome.deficiencyInfo') }}
                </p>
              </div>
            </div>
          </div>
          <DeficiencyFilter />

          <button type="submit" class="btn btn-strong fs-hs p-small  mt-large">
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
