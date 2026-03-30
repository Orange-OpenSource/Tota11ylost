// Tota11y Lost - Game Timer Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export function useGameTimer() {
  const gameStore = useGameStore()

  const displayTime = ref('')
  const digits = ref<number[]>([0, 0, 0, 0, 0])
  let intervalId: ReturnType<typeof setInterval> | null = null

  function timeToDigits(milliseconds: number): number[] {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    const tensOfMinutes = Math.floor(remainingMinutes / 10)
    const unitsOfMinutes = remainingMinutes % 10
    const remainingSeconds = totalSeconds % 60
    const tensOfSeconds = Math.floor(remainingSeconds / 10)
    const unitsOfSeconds = remainingSeconds % 10
    return [totalHours, tensOfMinutes, unitsOfMinutes, tensOfSeconds, unitsOfSeconds]
  }

  function getFormattedTime(ms?: number): string {
    const time = timeToDigits(ms ?? gameStore.getElapsedTime())
    return (time[0] ? `${time[0]}:` : '') + `${time[1] || '0'}${time[2]}:${time[3]}${time[4]}`
  }

  function update() {
    const elapsed = gameStore.getElapsedTime()
    digits.value = timeToDigits(elapsed)
    displayTime.value = getFormattedTime(elapsed)
    gameStore.saveToLocalStorage()
  }

  function start() {
    stop()
    update()
    intervalId = setInterval(update, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function addPenalty(seconds: number) {
    gameStore.addTimePenalty(seconds)
    update()
  }

  onMounted(() => {
    gameStore.loadFromLocalStorage()
    if (gameStore.timerStartTime && !gameStore.timerFinishTime) {
      start()
    }
    else {
      update()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    displayTime,
    digits,
    start,
    stop,
    update,
    addPenalty,
    getFormattedTime,
    timeToDigits,
  }
}
