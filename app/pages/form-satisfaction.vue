<!-- Tota11y Lost - Form Satisfaction (Zoomed-at-500% + tooltips) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'formSimu.tabTitle' })

const router = useRouter()
const gameStore = useGameStore()

const reponse1 = ref('')
const reponse2 = ref('')
const isValid = ref(false)

function validateForm() {
  const answer = reponse1.value.toLowerCase()
  if (answer === 'tubman' || answer === 'harriet tubman') {
    isValid.value = true
  }
  else {
    isValid.value = false
  }
}

function onValidate() {
  if (isValid.value) {
    gameStore.finishTimer()
    router.push('/scores?store=true')
  }
}

watch([reponse1, reponse2], validateForm)

// SVG info icon path data
const infoIconPath = 'M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z'
</script>

<template>
  <ClientOnly>
    <div class="form-satisfaction-page">
      <!-- Tooltip header area -->
      <div class="tooltip-header-bar">
        <div class="custom-tooltip-wrapper">
          <svg
            fill="#ffffff"
            width="40"
            height="40"
            viewBox="0 0 45.311 45.311"
          >
            <path :d="infoIconPath" />
          </svg>
          <span class="custom-tooltiptext tooltip-bottom">
            {{ $t('formSimu.information') }}
          </span>
        </div>
      </div>

      <!-- Header -->
      <div class="form-satisfaction-header">
        <div class="custom-tooltip-wrapper">
          <svg
            fill="#ffffff"
            width="40"
            height="40"
            viewBox="0 0 45.311 45.311"
          >
            <path :d="infoIconPath" />
          </svg>
          <span class="custom-tooltiptext tooltip-bottom">
            {{ $t('formSimu.tooltip') }}
          </span>
        </div>
        <h1 class="form-satisfaction-title">
          {{ $t('formSimu.simpleField') }}
        </h1>
        <div class="text-center text-bg-dark">
          <GameTimer />
        </div>
        <div class="custom-tooltip-wrapper" style="margin-top: 50px;">
          <svg
            fill="#ffffff"
            width="40"
            height="40"
            viewBox="0 0 45.311 45.311"
          >
            <path :d="infoIconPath" />
          </svg>
          <span class="custom-tooltiptext tooltip-left">
            {{ $t('formSimu.navigation') }}
          </span>
        </div>
      </div>

      <!-- Body tooltip -->
      <div class="custom-tooltip-wrapper" style="margin-left: 50%;">
        <svg
          fill="#000000"
          width="40"
          height="40"
          viewBox="0 0 45.311 45.311"
        >
          <path :d="infoIconPath" />
        </svg>
        <span class="custom-tooltiptext tooltip-right">
          {{ $t('formSimu.lastPoint') }}
        </span>
      </div>

      <!-- Form -->
      <form @submit.prevent>
        <div class="label-container-satisfaction">
          <label for="reponse_1">{{ $t('formSimu.question1') }}</label>
          <div class="custom-tooltip-wrapper">
            <svg
              fill="#000000"
              width="40"
              height="40"
              viewBox="0 0 45.311 45.311"
            >
              <path :d="infoIconPath" />
            </svg>
            <span class="custom-tooltiptext" style="left: 40px;">
              {{ $t('formSimu.tooltipRiddle1') }}
            </span>
          </div>
          <input
            id="reponse_1"
            v-model="reponse1"
            class="form-input-satisfaction"
            type="text"
            :aria-label="$t('formSimu.aria-label_solveRiddle1')"
            :placeholder="$t('formSimu.placeholder_response1')"
            required
          >
        </div>
        <div class="label-container-satisfaction">
          <label for="reponse_2">{{ $t('formSimu.question2') }}</label>
          <div class="custom-tooltip-wrapper">
            <svg
              fill="#000000"
              width="40"
              height="40"
              viewBox="0 0 45.311 45.311"
            >
              <path :d="infoIconPath" />
            </svg>
            <span class="custom-tooltiptext tooltip-bottom" style="left: 90px;">
              {{ $t('formSimu.tooltipRiddle2') }}
            </span>
          </div>
          <input
            id="reponse_2"
            v-model="reponse2"
            class="form-input-satisfaction"
            type="text"
            :placeholder="$t('formSimu.placeholder_response2')"
          >
        </div>
      </form>

      <!-- Validate button -->
      <div class="link-container-satisfaction">
        <button
          :class="['satisfaction-validate-btn', isValid ? 'valid' : 'invalid']"
          :disabled="!isValid"
          @click="onValidate"
        >
          {{ $t('formSimu.validateButton') }}
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.form-satisfaction-page {
  font-family: Arial, sans-serif;
  background-color: #fff;
  color: #000;
  font-size: 24px;
  position: relative;
  margin: 10px;
  transform: scale(5);
  transform-origin: 0 0;
  max-width: 100%;
}

.tooltip-header-bar {
  background-color: #000;
  color: #fff;
  text-align: justify;
  padding: 50px;
}

.form-satisfaction-header {
  font-size: 50px;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 100px;
}

.form-satisfaction-title {
  font-size: 25px !important;
}

.form-input-satisfaction {
  width: 20%;
  max-width: 40%;
  display: block !important;
  text-align: justify !important;
}

.label-container-satisfaction {
  padding-bottom: 20%;
}

.label-container-satisfaction label {
  text-align: justify !important;
  font-size: 500%;
}

.label-container-satisfaction input {
  text-align: right !important;
  margin-left: 69%;
  font-size: xx-large;
  transform: scale(2);
}

.link-container-satisfaction {
  text-align: center;
  font-size: 500%;
  margin-top: 10%;
}

/* Custom tooltip (not Bootstrap) */
.custom-tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: help;
}

.custom-tooltiptext {
  visibility: hidden;
  position: absolute;
  font-size: 20px !important;
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  padding: 10px 15px;
  z-index: 1;
  width: max-content;
  max-width: 300px;
  border: 2px solid black;
}

.custom-tooltip-wrapper:hover .custom-tooltiptext {
  visibility: visible;
  opacity: 1;
}

.tooltip-bottom {
  top: 0 !important;
  left: -50%;
}

.tooltip-right {
  top: -8px;
  right: 100%;
}

.tooltip-left {
  top: -8px;
  left: 100%;
}

.satisfaction-validate-btn {
  padding: 10px 20px;
  border: none;
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
}

.satisfaction-validate-btn.valid {
  background-color: #ff7900;
  color: #000;
  cursor: pointer;
}

.satisfaction-validate-btn.invalid {
  background-color: black;
  color: black;
  cursor: not-allowed;
  opacity: 0;
}
</style>
