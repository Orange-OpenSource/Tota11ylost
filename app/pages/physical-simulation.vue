<!-- Tota11y Lost - Physical Simulation (Keyboard Swap) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'physicalSimu.tabTitle' })

const { t } = useI18n()
const router = useRouter()
const keyboardSwap = useKeyboardSwap()

const inputRef = ref<HTMLInputElement | null>(null)
const showError = ref(false)

function validate() {
  const response = inputRef.value?.value.toLowerCase() ?? ''
  const expected = t('physicalSimu.response')
  if (response === expected) {
    router.push('/hearing')
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
  <div class="fs-2">
    <main>
      <div class="mx-4">
        <h2 class="my-2">
          {{ $t('physicalSimu.riddleHeading') }}
        </h2>
        <ul>
          <li>{{ $t('physicalSimu.userTypeText1') }}</li>
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
          class="alert alert-danger mb-3"
          role="alert"
        >
          <span class="alert-icon"><span class="visually-hidden">{{ $t('physicalSimu.errorHiddenText') }}</span></span>
          <p>{{ $t('physicalSimu.errorMessage') }}</p>
        </div>

        <div class="mb-3">
          <label for="inputField" class="form-label">{{ $t('physicalSimu.labelResponse') }}</label>
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
        <div>
          <button class="btn fs-3 p-2 btn-primary my-3" @click="validate">
            {{ $t('physicalSimu.validateButton') }}
          </button>
        </div>

        <GameHints page-id="physicalSimulation" @hint="onHint" />
      </div>
    </main>
  </div>
</template>
