<!-- Tota11y Lost - Welcome Page (Game entry point) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ title: 'welcome.tabTitle' })

const gameStore = useGameStore()
const router = useRouter()

onMounted(() => {
  gameStore.setVersion('60')
})

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
  router.push('/introduction')
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <main class="d-flex flex-row m-medium ms-large flex-grow-1">
      <div class="col-6">
        <h2 class="mb-3xlarge">
          {{ $t('welcome.intro') }}
        </h2>
        <h3 class="col-9 mb-large">
          {{ $t('welcome.rules') }}
        </h3>

        <h4>{{ $t('welcome.adventureType') }}</h4>
        <p>{{ $t('welcome.escapeGame') }}</p>

        <fieldset class="control-items-list mt-medium">
          <legend>{{ $t('welcome.duration') }}</legend>
          <div class="d-flex flex-row">
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
        </div>

        <DeficiencyFilter />

        <form @submit.prevent="startAdventure">
          <div class="form-group col-9">
            <h4 id="pseudoLabel" class="mt-small">
              {{ $t('welcome.pseudo') }}
            </h4>
            <input
              v-model="pseudo"
              type="text"
              class="form-control"
              aria-labelledby="pseudoLabel"
              required
              :placeholder="$t('welcome.placeholder_enterPseudo')"
              @input="pseudoError = false"
            >
            <div v-if="pseudoError" class="alert alert-message alert-negative mt-small">
              <span class="alert-icon" aria-hidden="true" /><p class="visually-hidden">
                Error
              </p>
              <div class="alert-container">
                <div class="alert-text-container">
                  <p class="alert-label">
                    {{ $t('welcome.errorMessage') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn fs-3 p-2 btn-primary mt-4">
            {{ $t('welcome.buttonStartAdventure') }}
          </button>
        </form>
      </div>
      <div class="ms-5xlarge col-4">
        <img src="/game-assets/Start.svg" alt="">
      </div>
    </main>
  </div>
</template>
