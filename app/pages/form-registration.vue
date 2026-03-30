<!-- Tota11y Lost - Form Registration (Inaccessible form challenge) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'form.tabTitle' })

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()

// Form fields (food-named IDs like in original)
const pistache = ref('') // nom
const cacahuete = ref('') // prenom
const olives = ref('') // password
const saucisson = ref('') // age
const chips = ref('') // mail
const tapenade = ref('') // telephone
const selectedFruits = ref<string[]>([])

// Labels visibility (initially hidden — added by hint 1)
const showLabels = ref(false)
// Submit button enabled (initially disabled — enabled by hint 2)
const submitEnabled = ref(false)
// Detailed errors (shown by hint 3)
const showDetailedErrors = ref(false)

// Error states
const showGlobalError = ref(false)
const errors = reactive({
  pistache: '',
  cacahuete: '',
  olives: '',
  saucisson: '',
  chips: '',
  tapenade: '',
  fruit: '',
})

// Extra detail strings appended by hint 3
const emailExtraDetail = ref('')
const telephoneExtraDetail = ref('')
const fruitExtraDetail = ref('')

const hintLevel = ref(0)

const fruits = [
  { id: 'fraise', value: 'Fraise', key: 'form.strawberry' },
  { id: 'pomme', value: 'Pomme', key: 'form.apple' },
  { id: 'clementine', value: 'Clémentine', key: 'form.clementine' },
  { id: 'ananas', value: 'Ananas', key: 'form.pineapple' },
  { id: 'mangue', value: 'Mangue', key: 'form.mango' },
  { id: 'litchi', value: 'Litchi', key: 'form.lychee' },
  { id: 'melon', value: 'Melon', key: 'form.melon' },
]

function validateEmail(email: string) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

function validateTel(tel: string) {
  return /^(\+33|\+34)[0-9]{9}$/.test(tel)
}

function errorForm(): boolean {
  let hasError = false

  // Reset all errors
  errors.pistache = ''
  errors.cacahuete = ''
  errors.olives = ''
  errors.saucisson = ''
  errors.chips = ''
  errors.tapenade = ''
  errors.fruit = ''

  if (pistache.value === '') {
    hasError = true
    if (showDetailedErrors.value)
      errors.pistache = t('form.errorName')
  }
  if (cacahuete.value === '') {
    hasError = true
    if (showDetailedErrors.value)
      errors.cacahuete = t('form.errorFirstName')
  }
  if (olives.value.length < 4 || olives.value.length > 8) {
    hasError = true
    if (showDetailedErrors.value)
      errors.olives = t('form.errorPassword')
  }
  const ageInt = Number.parseInt(saucisson.value)
  if (Number.isNaN(ageInt) || ageInt >= 18) {
    hasError = true
    if (showDetailedErrors.value)
      errors.saucisson = t('form.errorAge')
  }
  if (!validateEmail(chips.value)) {
    hasError = true
    if (showDetailedErrors.value)
      errors.chips = t('form.errorEmail')
  }
  if (!validateTel(tapenade.value)) {
    hasError = true
    if (showDetailedErrors.value)
      errors.tapenade = t('form.errorPhoneNumber')
  }
  if (selectedFruits.value.length !== 3) {
    hasError = true
    if (showDetailedErrors.value)
      errors.fruit = t('form.errorFruits')
  }

  // Before hint 2, auto-enable button when valid
  if (hintLevel.value < 2) {
    submitEnabled.value = !hasError
  }

  return hasError
}

function onSubmit() {
  showGlobalError.value = false

  if (!errorForm()) {
    const next = gameStore.getNextRoute('form-registration')
    router.push(next)
  }
  else {
    if (hintLevel.value >= 2) {
      showGlobalError.value = true
    }
  }
}

function onHint(index: number) {
  hintLevel.value = index
  switch (index) {
    case 1:
      // Add labels
      showLabels.value = true
      break
    case 2:
      // Enable submit button
      submitEnabled.value = true
      break
    case 3:
      // Show detailed error messages + append extra details
      showDetailedErrors.value = true
      emailExtraDetail.value = ` ${t('form.detailEmail')}`
      telephoneExtraDetail.value = ` ${t('form.detailPhoneNumber')}`
      fruitExtraDetail.value = ` ${t('form.detailFruits')}`
      errorForm()
      break
  }
}

// Watch fields for auto-validation (before hint 2)
watch([pistache, cacahuete, olives, saucisson, chips, tapenade, selectedFruits], () => {
  errorForm()
})
</script>

<template>
  <ClientOnly>
    <div class="fs-2">
      <main>
        <div class="mx-4">
          <h2>{{ $t('form.descriptionHeading') }}</h2>
          <p>{{ $t('form.descriptionText1') }}</p>
          <p>{{ $t('form.descriptionText2') }}</p>
          <p>{{ $t('form.descriptionText3') }}</p>

          <h2>{{ $t('form.userTypeHeading') }}</h2>
          <p>{{ $t('form.userTypeText') }}</p>

          <h2>{{ $t('form.rulesHeading') }}</h2>
          <ul>
            <li>{{ $t('form.rule1') }}</li>
            <li>{{ $t('form.rule2') }}</li>
            <li>{{ $t('form.rule3') }}</li>
            <li>{{ $t('form.rule4') }}</li>
            <li>{{ $t('form.rule5') }}</li>
          </ul>

          <h2>{{ $t('form.formHeading') }}</h2>

          <div class="form-container">
            <p role="status">
              {{ $t('form.allFieldsRequired') }}
            </p>

            <!-- Global error -->
            <div
              v-if="showGlobalError"
              id="errorDiv"
              class="alert alert-danger mb-3"
              role="alert"
            >
              <span class="alert-icon" />
              <p>{{ $t('form.errorInForm') }}</p>
            </div>

            <!-- Nom (pistache) -->
            <div id="pistacheDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="nom"
                for="pistache"
                class="form-label"
              >{{ $t('form.labelName') }}</label>
              <input
                id="pistache"
                v-model="pistache"
                type="text"
                class="form-control"
                aria-describedby="errorpistacheText"
              >
              <div v-if="errors.pistache" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorpistacheText">
                  {{ errors.pistache }}
                </p>
              </div>
            </div>

            <!-- Prenom (cacahuete) -->
            <div id="cacahueteDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="prenom"
                for="cacahuete"
                class="form-label"
              >{{ $t('form.labelFirstName') }}</label>
              <input
                id="cacahuete"
                v-model="cacahuete"
                type="text"
                class="form-control"
                aria-describedby="errorcacahueteText"
              >
              <div v-if="errors.cacahuete" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorcacahueteText">
                  {{ errors.cacahuete }}
                </p>
              </div>
            </div>

            <!-- Password (olives) -->
            <div id="olivesDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="password"
                for="olives"
                class="form-label"
              >{{ $t('form.labelPassword') }}</label>
              <input
                id="olives"
                v-model="olives"
                type="password"
                class="form-control"
                aria-describedby="errorolivesText"
              >
              <div v-if="errors.olives" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorolivesText">
                  {{ errors.olives }}
                </p>
              </div>
            </div>

            <!-- Age (saucisson) -->
            <div id="saucissonDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="age"
                for="saucisson"
                class="form-label"
              >{{ $t('form.labelAge') }}</label>
              <input
                id="saucisson"
                v-model="saucisson"
                type="text"
                class="form-control"
                aria-describedby="errorsaucissonText"
              >
              <div v-if="errors.saucisson" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorsaucissonText">
                  {{ errors.saucisson }}
                </p>
              </div>
            </div>

            <!-- Email (chips) -->
            <div id="chipsDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="email"
                for="chips"
                class="form-label"
              >
                {{ $t('form.labelEmail') }}{{ emailExtraDetail }}
              </label>
              <input
                id="chips"
                v-model="chips"
                type="text"
                class="form-control"
                aria-describedby="errorchipsText"
              >
              <div v-if="errors.chips" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorchipsText">
                  {{ errors.chips }}
                </p>
              </div>
            </div>

            <!-- Telephone (tapenade) -->
            <div id="tapenadeDiv" class="mb-3">
              <label
                v-if="showLabels"
                id="telephone"
                for="tapenade"
                class="form-label"
              >
                {{ $t('form.labelPhoneNumber') }}{{ telephoneExtraDetail }}
              </label>
              <input
                id="tapenade"
                v-model="tapenade"
                type="text"
                class="form-control"
                aria-describedby="errortapenadeText"
              >
              <div v-if="errors.tapenade" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errortapenadeText">
                  {{ errors.tapenade }}
                </p>
              </div>
            </div>

            <!-- Fruits (checkboxes) -->
            <fieldset aria-describedby="errorfruitText">
              <legend id="legendFruit">
                <template v-if="showLabels">
                  {{ $t('form.labelFruits') }}{{ fruitExtraDetail }}
                </template>
              </legend>
              <div v-if="errors.fruit" class="alert alert-danger alert-sm">
                <span class="alert-icon"><span class="visually-hidden">{{ $t('form.formError') }}</span></span>
                <p id="errorfruitText">
                  {{ errors.fruit }}
                </p>
              </div>
              <div class="mb-3">
                <div v-for="fruit in fruits" :key="fruit.id" class="form-check form-check-inline">
                  <input
                    :id="fruit.id"
                    v-model="selectedFruits"
                    class="form-check-input"
                    type="checkbox"
                    :value="fruit.value"
                  >
                  <label class="form-check-label" :for="fruit.id">{{ $t(fruit.key) }}</label>
                </div>
                <div class="my-3">
                  <button
                    type="button"
                    class="btn fs-3 p-2 btn-primary"
                    :disabled="!submitEnabled"
                    @click="onSubmit"
                  >
                    {{ $t('form.signupButton') }}
                  </button>
                </div>
              </div>
            </fieldset>
          </div>

          <GameHints page-id="formRegistration" :delay-ms="1" @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
