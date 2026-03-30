<!-- Tota11y Lost - Welcome Page (Game entry point) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ title: 'welcome.tabTitle' })

const router = useRouter()
const gameStore = useGameStore()

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
    <main class="d-flex flex-row m-3 ms-4 flex-grow-1">
      <div class="col-6">
        <h2 class="mb-5">
          {{ $t('welcome.intro') }}
        </h2>
        <h3 class="col-9 mb-4">
          {{ $t('welcome.rules') }}
        </h3>

        <h4>{{ $t('welcome.adventureType') }}</h4>
        <p>{{ $t('welcome.escapeGame') }}</p>

        <h4 id="timeSelection" class="mt-3">
          {{ $t('welcome.duration') }}
        </h4>
        <div class="d-flex flex-row" role="group" aria-labelledby="timeSelection">
          <div class="form-check me-3">
            <input
              id="15min"
              class="form-check-input"
              type="radio"
              name="gameDuration"
              :title="$t('welcome.15min.title_15')"
              :checked="gameStore.version === '15'"
              @change="gameStore.setVersion('15')"
            >
            <label class="form-check-label" for="15min">{{ $t('welcome.15min.label') }}</label>
          </div>
          <div class="form-check me-3">
            <input
              id="30min"
              class="form-check-input"
              type="radio"
              name="gameDuration"
              :title="$t('welcome.30min.title_30')"
              :checked="gameStore.version === '30'"
              @change="gameStore.setVersion('30')"
            >
            <label class="form-check-label" for="30min">{{ $t('welcome.30min.label') }}</label>
          </div>
          <div class="form-check">
            <input
              id="60min"
              class="form-check-input"
              type="radio"
              name="gameDuration"
              :title="$t('welcome.60min.title_60')"
              :checked="gameStore.version === '60'"
              @change="gameStore.setVersion('60')"
            >
            <label class="form-check-label" for="60min">{{ $t('welcome.60min.label') }}</label>
          </div>
        </div>

        <form @submit.prevent="startAdventure">
          <div class="form-group col-9">
            <h4 id="pseudoLabel" class="mt-3">
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
            <div v-if="pseudoError" class="alert alert-danger mt-2">
              {{ $t('welcome.errorMessage') }}
            </div>
          </div>
          <button type="submit" class="btn fs-3 p-2 btn-primary mt-4">
            {{ $t('welcome.buttonStartAdventure') }}
          </button>
        </form>
      </div>
      <div class="ms-5 col-4">
        <img src="~/assets/img/Start.svg" alt="">
      </div>
    </main>
  </div>
</template>
