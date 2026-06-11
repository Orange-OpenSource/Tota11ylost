<!-- Tota11y Lost - Physical Simulation (Keyboard Swap) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'physicalSimu.tabTitle' })

const { t } = useI18n()
const { goToNextPage } = useNextPage()
const keyboardSwap = useKeyboardSwap()

const inputRef = ref<HTMLInputElement | null>(null)
const showError = ref(false)

function validate() {
  const response = inputRef.value?.value.toLowerCase() ?? ''
  const expected = t('physicalSimu.response')
  if (response === expected) {
    goToNextPage()
  }
  else {
    showError.value = true
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  alert(t('physicalSimu.copyPasteForbidden'))
}

function onHint(index: number) {
  if (index === 3) {
    keyboardSwap.stop()
  }
}

onMounted(() => {
  if (inputRef.value) {
    keyboardSwap.start(inputRef.value)
  }
})
</script>

<template>
  <div class="fs-hm mw-none">
    <GameHeader :page-title="$t('physicalSimu.pageTitle')" />
    <main>
      <div class="mx-large">
        <h2 class="my-small">
          {{ $t('physicalSimu.riddleHeading') }}
        </h2>
        <ul>
          <li fs>
            {{ $t('physicalSimu.userTypeText1') }}
          </li>
          <li>{{ $t('physicalSimu.userTypeText2') }}</li>
          <li>{{ $t('physicalSimu.hint1') }}</li>
          <li>{{ $t('physicalSimu.hint2') }}</li>
          <li>{{ $t('physicalSimu.hint3') }}</li>
          <li>{{ $t('physicalSimu.hint4') }}</li>
          <li>{{ $t('physicalSimu.hint5') }}</li>
        </ul>

        <div
          v-if="showError"
          id="errorDiv"
          class="alert alert-message alert-negative mb-medium"
          role="alert"
        >
          <span class="alert-icon"><span class="visually-hidden">{{ $t('physicalSimu.errorHiddenText') }}</span></span>
          <div class="alert-container">
            <div class="alert-text-container">
              <p>{{ $t('physicalSimu.errorMessage') }}</p>
            </div>
          </div>
        </div>

        <div class="mb-medium">
          <label for="inputField" class="form-label fw-bold">{{ $t('physicalSimu.labelResponse') }}</label>
          <input
            id="inputField"
            ref="inputRef"
            type="text"
            class="form-control"
            autocomplete="off"
            :aria-label="$t('physicalSimu.aria-label_response')"
            @paste="onPaste"
          >
        </div>
        <div class="mb-medium">
          <button class="btn fs-hs p-small btn-brand my-medium" @click="validate">
            {{ $t('physicalSimu.validateButton') }}
          </button>
        </div>

        <GameHints page-id="physicalSimulation" large-text @hint="onHint" />
      </div>
    </main>
  </div>
</template>
