// Tota11y Lost - Keyboard Swap Composable (for physical simulation)
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export function useKeyboardSwap() {
  const neighboringKeys: Record<string, string[]> = {
    a: ['q', 'w', 's', 'z', 'a'],
    b: ['v', 'g', 'h', 'n', 'b'],
    c: ['x', 'd', 'f', 'v', 'c'],
    d: ['s', 'e', 'r', 'f', 'x', 'c', 'd'],
    e: ['r', 'd', 'z', 'e'],
    f: ['r', 't', 'g', 'v', 'c', 'f'],
    g: ['t', 'y', 'h', 'b', 'v', 'g'],
    h: ['y', 'u', 'j', 'n', 'b', 'h'],
    i: ['u', 'o', 'k', 'j', 'i'],
    j: ['u', 'i', 'k', 'm', 'n', 'j'],
    k: ['i', 'o', 'l', 'm', 'k'],
    l: ['o', 'p', 'l'],
    m: ['n', 'j', 'k', 'm'],
    n: ['h', 'j', 'm', 'n'],
    o: ['p', 'l', 'k', 'o'],
    p: ['l', 'p'],
    q: ['w', 'a', 'q'],
    r: ['t', 'f', 'd', 'r'],
    s: ['q', 'd', 'x', 'z', 's'],
    t: ['r', 'y', 'g', 't'],
    u: ['y', 'i', 'j', 'h', 'u'],
    v: ['c', 'f', 'g', 'b', 'v'],
    w: ['a', 's', 'e', 'w'],
    x: ['s', 'd', 'c', 'x'],
    y: ['t', 'u', 'h', 'g', 'y'],
    z: ['a', 's', 'x', 'z'],
  }

  let swapHandler: ((e: KeyboardEvent) => void) | null = null
  let inputEl: HTMLInputElement | null = null

  function start(input: HTMLInputElement) {
    stop()
    inputEl = input

    swapHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key in neighboringKeys) {
        const possibleKeys = neighboringKeys[key]
        if (possibleKeys && possibleKeys.length !== 0) {
          const randomKey = possibleKeys[Math.floor(Math.random() * possibleKeys.length)]
          event.preventDefault()
          if (inputEl) inputEl.value += randomKey
        }
      }
    }

    input.addEventListener('keydown', swapHandler)
  }

  function stop() {
    if (swapHandler && inputEl) {
      inputEl.removeEventListener('keydown', swapHandler)
      swapHandler = null
      inputEl = null
    }
  }

  onUnmounted(() => stop())

  return { start, stop }
}
