<!-- Tota11y Lost - Automatic hints, each announced in a dismissible alert modal -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
import type { VueMessageType } from 'vue-i18n'

const props = defineProps<{
  pageId: string
  // Delay before each hint; the next countdown starts when the previous modal is closed
  delaysMs: number[]
  // Element focused after closing a modal if the participant has not used a form field yet
  fallbackFocusSelector?: string
}>()

const emit = defineEmits<{
  hint: [index: number]
}>()

const COUNTDOWN_STEP_MS = 20000
const FIELD_SELECTOR = 'input, select, textarea'

const { t, tm, rt } = useI18n()

const triggeredCount = ref(0)
const remainingMs = ref(0)
const activeHint = ref<number | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

let countdownTimeout: ReturnType<typeof setTimeout> | null = null
let lastField: HTMLElement | null = null

const nextDelayMs = computed(() => props.delaysMs[triggeredCount.value])
const hasNextHint = computed(() => nextDelayMs.value !== undefined)

function formatDuration(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  const parts: string[] = []
  if (minutes) parts.push(`${minutes} ${t('common.time.minute.full', minutes)}`)
  if (seconds) parts.push(`${seconds} ${t('common.time.second.full', seconds)}`)
  return parts.join(' ')
}

const remainingLabel = computed(() => formatDuration(remainingMs.value))
const nextDelayLabel = computed(() => formatDuration(nextDelayMs.value ?? 0))

function hintText(index: number): string {
  const hintsArray = tm(`hints.${props.pageId}`) as unknown as VueMessageType[]
  const raw = Array.isArray(hintsArray) ? hintsArray[index - 1] : undefined
  return raw ? rt(raw) : ''
}

function tick() {
  if (remainingMs.value <= 0) {
    openHint()
    return
  }
  const step = Math.min(COUNTDOWN_STEP_MS, remainingMs.value)
  countdownTimeout = setTimeout(() => {
    remainingMs.value -= step
    tick()
  }, step)
}

function startCountdown() {
  if (nextDelayMs.value === undefined) return
  remainingMs.value = nextDelayMs.value
  tick()
}

async function openHint() {
  triggeredCount.value++
  activeHint.value = triggeredCount.value
  emit('hint', triggeredCount.value)
  await nextTick()
  closeButtonRef.value?.focus()
}

async function closeHint() {
  activeHint.value = null
  startCountdown()
  await nextTick()
  const target = lastField?.isConnected
    ? lastField
    : props.fallbackFocusSelector
      ? document.querySelector<HTMLElement>(props.fallbackFocusSelector)
      : null
  target?.scrollIntoView({ block: 'center' })
  target?.focus({ preventScroll: true })
}

function onFocusIn(event: FocusEvent) {
  if (event.target instanceof HTMLElement && event.target.matches(FIELD_SELECTOR)) {
    lastField = event.target
  }
}

// Listened on document so the trap works even when focus is outside the modal (e.g. on body)
function onKeydown(event: KeyboardEvent) {
  if (activeHint.value === null) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeHint()
  }
  else if (event.key === 'Tab') {
    event.preventDefault()
    closeButtonRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('keydown', onKeydown)
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimeout) clearTimeout(countdownTimeout)
  document.removeEventListener('focusin', onFocusIn)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div>
    <!-- Persistent live region so each 20s update is announced -->
    <div role="status">
      <p v-if="hasNextHint && activeHint === null" class="fs-hm">
        {{ $t('hints.nextHintIn', { index: triggeredCount + 1, duration: remainingLabel }) }}
      </p>
    </div>

    <div
      v-if="activeHint !== null"
      class="modal d-block auto-hint-modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="autoHintModalTitle"
      aria-describedby="autoHintModalBody autoHintModalNext autoHintModalHelp"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header auto-hint-modal-header">
            <button
              ref="closeButtonRef"
              type="button"
              class="btn-close"
              :aria-label="$t('hints.closeHintMessage')"
              @click="closeHint"
            />
            <h2 id="autoHintModalTitle">
              {{ $t('hints.hintActivated', { index: activeHint }) }}
            </h2>
          </div>
          <div class="modal-body">
            <p id="autoHintModalBody" class="fs-hm">
              {{ hintText(activeHint) }}
            </p>
            <p id="autoHintModalNext" class="visually-hidden">
              {{ hasNextHint ? $t('hints.nextHintAfterClose', { duration: nextDelayLabel }) : $t('hints.lastHint') }}
            </p>
            <p id="autoHintModalHelp" class="visually-hidden">
              {{ $t('hints.closeHintInstructions') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auto-hint-modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);

  .modal-content {
    background-color: white;
  }
}

.auto-hint-modal-header {
  flex-direction: column;
  align-items: stretch;

  .btn-close {
    align-self: flex-end;
    margin: 0;

    /* Focus is set programmatically, so :focus-visible may not apply after a mouse click */
    &:focus {
      outline: 3px solid currentcolor;
      outline-offset: 2px;
    }
  }
}
</style>
