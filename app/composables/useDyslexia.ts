// Tota11y Lost - Dyslexia Simulation Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export function useDyslexia(selector: string = '.dyslexia', intervalMs: number = 500) {
  let intervalId: ReturnType<typeof setInterval> | null = null

  const rotationMap: Record<string, string> = {
    b: 'd', d: 'b', p: 'q', q: 'p',
    n: 'u', u: 'n', m: 'w', w: 'm',
    v: 'y', y: 'v', e: 'a', a: 'e',
    j: 'l', l: 'j', t: 'j',
    r: 'f', f: 'r',
  }

  function simulateDyslexia(text: string): string {
    return text.split('').map((char) => {
      if (char.match(/[a-zA-Z]/) && Math.random() < 0.2) {
        return rotationMap[char] || char
      }
      return char
    }).join('')
  }

  function updateSimulatedText() {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      // Store original text on first run
      const dataAttr = 'data-original-text'
      if (!el.getAttribute(dataAttr)) {
        el.setAttribute(dataAttr, el.textContent || '')
      }

      // Always simulate from the original text, not the already-transformed text
      const originalText = el.getAttribute(dataAttr) || ''
      el.textContent = simulateDyslexia(originalText)
    })
  }

  function start() {
    stop()
    intervalId = setInterval(updateSimulatedText, intervalMs)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(() => stop())

  return { start, stop, simulateDyslexia }
}
