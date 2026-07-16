<!-- Tota11y Lost - Welcome Page (Game entry point) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ title: 'welcome.tabTitle' })

const gameStore = useGameStore()

onMounted(() => {
  gameStore.setVersion('60')
})
const router = useRouter()
gameStore.resetAll()
const pseudo = ref('')
const pseudoError = ref(false)

function startAdventure() {
  if (!pseudo.value.trim()) {
    pseudoError.value = true
    return
  }
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
                required
                placeholder=""
                style="border-top: transparent; border-left: transparent; border-right: transparent; width: 555px; font-weight: bold;"
                @input="pseudoError = false"
              >
            </div>
          </div>
          <p class="col-9 mb-large">
            {{ $t('welcome.pseudo_alert') }}
          </p>
          <div v-if="pseudoError" class="alert alert-message alert-negative mt-small">
            <span class="alert-icon" aria-hidden="true">
              <p class="visually-hidden">
                Error
              </p>
            </span>
            <div class="alert-container">
              <div class="alert-text-container">
                <p class="alert-label">
                  {{ $t('welcome.errorMessage') }}
                </p>
              </div>
            </div>
          </div>

          <div class="select-input mb-medium w-50">
            <div class="select-input-container">
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
                    @change="gameStore.setVersion('60')"
                  >
                </div>
                <div class="control-item-text-container">
                  <label class="control-item-label" for="60min">{{ $t('welcome.60min.label') }}</label>
                </div>
              </div>
            </div>
          </fieldset>
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
</style>
