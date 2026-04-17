// Tota11y Lost - Hints System Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

import type { VueMessageType } from 'vue-i18n'

export interface HintOptions {
  pageId: string
  isFormRegistration?: boolean
  delayMs?: number
  debug?: boolean
  onHint?: (hintIndex: number) => void
}

export function useHints(options: HintOptions) {
  const { t, tm, rt } = useI18n()
  const route = useRoute()
  const timer = useGameTimer()

  const currentHintIndex = ref(0)
  const hintsAvailable = ref(false)
  const noMoreHints = ref(false)
  const hintTexts = ref<string[]>([])

  const penaltyTimes = [30, 120, 300, 0]

  // Delay before hints become available: 5min normally, 10s in debug, custom or 1ms for form-registration
  const isDebug = ref(false)

  function initDebugMode() {
    const debugParam = route.query?.debug
    isDebug.value = options.debug === true || debugParam === 'true'
  }

  const hintDelay = computed(() => {
    if (options.delayMs !== undefined) return options.delayMs
    if (options.isFormRegistration) return 1
    if (isDebug.value) return 10000
    return 300000 // 5 minutes
  })

  let hintTimeout: ReturnType<typeof setTimeout> | null = null

  function getHintButtonLabel(): string {
    const time = penaltyTimes[currentHintIndex.value]
    if (!time) return t('hints.noMoreHints')
    const duration = time < 60 ? time : time / 60
    const unit = time < 60
      ? t('common.time.second.abbr', duration)
      : t('common.time.minute.abbr', duration)
    return t('form.labelHintsButton', { duration, unit })
  }

  function getHintButtonA11yLabel(): string {
    const time = penaltyTimes[currentHintIndex.value]
    if (!time) return t('hints.noMoreHints')
    const duration = time < 60 ? time : time / 60
    const unit = time < 60
      ? t('common.time.second.full', duration)
      : t('common.time.minute.full', duration)
    return t('form.labelHintsButton', { duration, unit })
  }

  const hintButtonLabel = computed(() => getHintButtonLabel())
  const hintButtonA11yLabel = computed(() => getHintButtonA11yLabel())

  function takeHint() {
    if (noMoreHints.value || currentHintIndex.value >= 3) return

    const idx = Math.min(currentHintIndex.value as number, penaltyTimes.length - 1)
    timer.addPenalty(penaltyTimes[idx] as number)
    currentHintIndex.value++

    // Get hint text from i18n — tm() returns the raw message array, rt() resolves each item to a string
    const hintsArray = tm(`hints.${options.pageId}`) as unknown as VueMessageType[]
    const rawHint = hintsArray[currentHintIndex.value - 1]
    if (Array.isArray(hintsArray) && rawHint) {
      hintTexts.value.push(rt(rawHint))
    }

    // Call the page-specific hint callback
    options.onHint?.(currentHintIndex.value)

    if (currentHintIndex.value >= 3) {
      noMoreHints.value = true
    }
  }

  onMounted(() => {
    initDebugMode()

    const setupHintTimeout = () => {
      if (hintTimeout) clearTimeout(hintTimeout)
      hintTimeout = setTimeout(() => {
        hintsAvailable.value = true
      }, hintDelay.value)
    }

    setupHintTimeout()

    // Watch for changes in hintDelay and reset timeout
    watch(hintDelay, () => {
      if (!hintsAvailable.value) {
        setupHintTimeout()
      }
    })
  })

  onUnmounted(() => {
    if (hintTimeout) clearTimeout(hintTimeout)
  })

  return {
    currentHintIndex,
    hintsAvailable,
    noMoreHints,
    hintTexts,
    hintButtonLabel,
    hintButtonA11yLabel,
    takeHint,
  }
}
