// Tota11y Lost - Game State Store
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export const useGameStore = defineStore('game', {
  state: () => ({
    pseudo: '',
    version: '60' as '15' | '30' | '60',
    timerStartTime: null as number | null,
    timerFinishTime: null as number | null,
    lang: 'en',
  }),

  getters: {
    is15Version: state => state.version === '15',
    is30Version: state => state.version === '30',
    is60Version: state => state.version === '60',
  },

  actions: {
    setPseudo(pseudo: string) {
      this.pseudo = pseudo
    },

    setVersion(version: '15' | '30' | '60') {
      this.version = version
    },

    startTimer() {
      this.timerStartTime = Date.now()
      this.timerFinishTime = null
    },

    finishTimer() {
      if (!this.timerFinishTime) {
        this.timerFinishTime = Date.now()
      }
    },

    addTimePenalty(seconds: number) {
      if (this.timerStartTime) {
        this.timerStartTime -= seconds * 1000
      }
    },

    getElapsedTime(): number {
      if (!this.timerStartTime) return 0
      const end = this.timerFinishTime ?? Date.now()
      return end - this.timerStartTime
    },

    restartTimer() {
      this.timerStartTime = Date.now()
      this.timerFinishTime = null
    },

    /**
     * Get the next page route based on the current page and game version.
     * Handles the branching logic for 15/30/60 minute versions.
     */
    getNextRoute(currentPage: string): string {
      const routes: Record<string, Record<string, string>> = {
        'introduction': {
          15: '/visual',
          30: '/visual',
          60: '/visual',
        },
        'visual': {
          15: '/physical',
          30: '/visual-simulation',
          60: '/visual-simulation',
        },
        'visual-simulation': {
          15: '/physical',
          30: '/scores?store=true',
          60: '/cognitive',
        },
        'cognitive': {
          15: '/cognitive-simulation',
          30: '/cognitive-simulation',
          60: '/cognitive-simulation',
        },
        'cognitive-simulation': {
          15: '/physical',
          30: '/physical',
          60: '/physical',
        },
        'physical': {
          15: '/physical-simulation',
          30: '/physical-simulation',
          60: '/physical-simulation',
        },
        'physical-simulation': {
          15: '/form-registration',
          30: '/hearing',
          60: '/hearing',
        },
        'hearing': {
          15: '/hearing-simulation',
          30: '/visual-simulation',
          60: '/hearing-simulation',
        },
        'hearing-simulation': {
          15: '/form-registration',
          30: '/form-registration',
          60: '/form-registration',
        },
        'form-registration': {
          15: '/scores?store=true',
          30: '/cognitive-simulation',
          60: '/scores?store=true',
        },
      }

      return routes[currentPage]?.[this.version] ?? '/scores'
    },

    // Persist state to localStorage for page reloads
    saveToLocalStorage() {
      if (import.meta.client) {
        localStorage.setItem('tota11y-game', JSON.stringify({
          pseudo: this.pseudo,
          version: this.version,
          timerStartTime: this.timerStartTime,
          timerFinishTime: this.timerFinishTime,
        }))
      }
    },

    loadFromLocalStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('tota11y-game')
        if (saved) {
          const data = JSON.parse(saved)
          this.pseudo = data.pseudo ?? ''
          this.version = data.version ?? '60'
          this.timerStartTime = data.timerStartTime ?? null
          this.timerFinishTime = data.timerFinishTime ?? null
        }
      }
    },
  },
})
