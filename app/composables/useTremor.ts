// Tota11y Lost - Mouse Tremor Simulation Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export function useTremor() {
  const normal = [
    -0.954486511205664, -0.390343505844172, 0.954967163741049, -0.741969088844115,
    0.415498313809018, 1.11448864081483, 0.76051606293719, 0.737922868989143,
    -0.538210735151749, 2.95321369930028, 1.29722248593233, 0.879352418857219,
    -0.431491137709812, 0.907957414011492, 1.32937856972126, -2.06193940045371,
    0.853924002501051, 0.644568387942851, 0.29585966062521, 0.029283909642257,
  ]

  const tremorBasePx = 40
  let intervalId: ReturnType<typeof setInterval> | null = null
  let lastCursor = { clientX: 0, clientY: 0 }
  let mouseMoveHandler: ((e: MouseEvent) => void) | null = null
  let clickHandler: (() => void) | null = null

  function sampleInt(magnitude: number): number {
    const idx = Math.round(Math.random() * (normal.length - 1))
    const value = normal[idx] ?? 0
    return value * magnitude
  }

  function start(
    cursorElement: HTMLElement,
    onFakeClick?: (x: number, y: number, element: Element | null) => void,
  ) {
    stop()

    mouseMoveHandler = (e: MouseEvent) => {
      lastCursor = { clientX: e.clientX, clientY: e.clientY }
    }

    clickHandler = () => {
      const x = parseInt(cursorElement.style.left, 10)
      const y = parseInt(cursorElement.style.top, 10)
      const element = document.elementFromPoint(x, y)
      onFakeClick?.(x, y, element)
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('click', clickHandler)

    intervalId = setInterval(() => {
      const randX = sampleInt(tremorBasePx)
      const randY = sampleInt(tremorBasePx)
      cursorElement.style.top = `${lastCursor.clientY + randY}px`
      cursorElement.style.left = `${lastCursor.clientX + randX}px`
      cursorElement.style.transition = 'top 0.2s, left 0.2s linear'
    }, 200)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (mouseMoveHandler) {
      document.removeEventListener('mousemove', mouseMoveHandler)
      mouseMoveHandler = null
    }
    if (clickHandler) {
      document.removeEventListener('click', clickHandler)
      clickHandler = null
    }
  }

  onUnmounted(() => stop())

  return { start, stop }
}
