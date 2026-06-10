import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  // STATE
const pageRoutes = ref<Record<number, string>>({
    1: '/visual',
    2: '/visual-simulation',
    3: '/cognitive',
    4: '/cognitive-simulation',
    5: '/physical',
    6: '/physical-simulation',
    7: '/hearing',
    8: '/hearing-simulation',
    9: '/form-registration',
    10: '/form-satisfaction',
    11: '/cataract',
    12: '/puzzle-game',
    13: '/zoom',
    14: '/contrast',
    15: '/diplopie',
    16: '/memorie',
    17: '/index',
    18: '/introduction',

  })

  const deficiency = ref<Record<string, number[]>>({
    visual: [1, 10, 11, 13, 14, 15],
    physical: [5, 6, 12],
    hearing: [7, 8],
    cognitive: [3, 4, 16],
  })

  const selectedPages = ref<string[]>([])
  const categoriesRestantes = ref(['visual', 'physical', 'hearing', 'cognitive'])

  const pseudo = ref('')
  const version = ref<'15' | '30' | '60'>('60')
  const timerStartTime = ref<number | null>(null)
  const timerFinishTime = ref<number | null>(null)
  const lang = ref('en')

  // ACTIONS
  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('tota11y-game', JSON.stringify({
        selectedPages: selectedPages.value,
        categoriesRestantes: categoriesRestantes.value,
      }))
    }
  }

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('tota11y-game')
      if (saved) {
        const data = JSON.parse(saved)
        selectedPages.value = data.selectedPages || []
        categoriesRestantes.value = data.categoriesRestantes || []
      }
    }
  }

  const removeDeficiencyFromCategories = (deficiencyName: string) => {
    categoriesRestantes.value = categoriesRestantes.value.filter(
      cat => cat !== deficiencyName,
    )

    // Enlever aussi les pages de cette catégorie de selectedPages
    const pagesInCategory = deficiency.value[deficiencyName] || []
    selectedPages.value = selectedPages.value.filter((page) => {
      return !pagesInCategory.some(pageNum => pageRoutes.value[pageNum] === page)
    })

    const limits: Record<'15' | '30' | '60', number> = { 15: 3, 30: 7, 60: 11 }
    const limit = limits[version.value]

      for (const category of categoriesRestantes.value) {
        if (selectedPages.value.length >= limit) break

        while (selectedPages.value.length < limit) {
          const page = pickRandomPageFromCategory(category)
          if (page && !selectedPages.value.includes(page)) {
            selectedPages.value.push(page)
          }
 else {
            break // Pas de page dispo dans cette catégorie
          }
        }
      }
    saveToLocalStorage()
  }

  const addDeficiencyToCategories = (deficiencyName: string) => {
  if (!categoriesRestantes.value.includes(deficiencyName)) {
    categoriesRestantes.value.push(deficiencyName)

    const limits: Record<'15' | '30' | '60', number> = { 15: 3, 30: 7, 60: 11 }
    const limit = limits[version.value]

    // Ajouter une page seulement si on n'a pas atteint la limite
    if (selectedPages.value.length < limit) {
      const randomPage = pickRandomPageFromCategory(deficiencyName)
      if (randomPage && !selectedPages.value.includes(randomPage)) {
        selectedPages.value.push(randomPage)
      }
    }

    // Remplir jusqu'à la limite avec les catégories disponibles
    for (const category of categoriesRestantes.value) {
      if (selectedPages.value.length >= limit) break

      while (selectedPages.value.length < limit) {
        const page = pickRandomPageFromCategory(category)
        if (page && !selectedPages.value.includes(page)) {
          selectedPages.value.push(page)
        }
 else {
          break
        }
      }
    }
  }

  saveToLocalStorage()
}

  const resetAll = () => {
    selectedPages.value = []
    categoriesRestantes.value = ['visual', 'physical', 'hearing', 'cognitive']
    saveToLocalStorage()
  }

  const pickRandomPageFromCategory = (categoryName: string): string => {
    const pagesInCategory = deficiency.value[categoryName]

    if (!pagesInCategory || pagesInCategory.length === 0) {
      return ''
    }

    const randomIndex = Math.floor(Math.random() * pagesInCategory.length)
    const pageNumber = pagesInCategory[randomIndex]
    if (pageNumber === undefined) return ''
    return pageRoutes.value[pageNumber] || ''
  }

const moveToNextPage = (): string | null => {
    saveToLocalStorage()

    if (selectedPages.value.length === 0) {
      return null
    }

    selectedPages.value.shift()

    return selectedPages.value[0] || null
  }

  const setPseudo = (newPseudo: string) => {
    pseudo.value = newPseudo
  }

const setVersion = (newVersion: '15' | '30' | '60') => {
  version.value = newVersion
  selectedPages.value = []

  const nonRandomPages = [18, 2, 9]
  const randomCategories = ['visual', 'physical', 'hearing', 'cognitive']

  if (newVersion === '15') {
    for (const page of nonRandomPages) {
      const route = pageRoutes.value[page]
      if (route) {
        selectedPages.value.push(route)
      }
    }
  }
 else if (newVersion === '30') {
    for (const page of nonRandomPages) {
      const route = pageRoutes.value[page]
      if (route) {
        selectedPages.value.push(route)
      }
    }

    for (const category of randomCategories) {
      const page = pickRandomPageFromCategory(category)
      if (page && !selectedPages.value.includes(page)) {
        selectedPages.value.push(page)
    }
  }
  }
 else if (newVersion === '60') {
    for (const page of nonRandomPages) {
      const route = pageRoutes.value[page]
      if (route) {
        selectedPages.value.push(route)
      }
    }

    for (const category of randomCategories) {
        for (let i = 0; i < 2; i++) {
        const page = pickRandomPageFromCategory(category)
        if (page && !selectedPages.value.includes(page)) {
          selectedPages.value.push(page)
        }
 else {
        break
      }
  }
}
}

  saveToLocalStorage()
}

  const startTimer = () => {
    timerStartTime.value = Date.now()
    timerFinishTime.value = null
  }

  const finishTimer = () => {
    if (!timerFinishTime.value) {
      timerFinishTime.value = Date.now()
    }
  }

  const addTimePenalty = (seconds: number) => {
    if (timerStartTime.value) {
      timerStartTime.value -= seconds * 1000
    }
  }

  const getElapsedTime = (): number => {
    if (!timerStartTime.value) return 0
    const end = timerFinishTime.value ?? Date.now()
    return end - timerStartTime.value
  }

  const restartTimer = () => {
    timerStartTime.value = Date.now()
    timerFinishTime.value = null
  }

  // GETTERS
  const nextRandomPage = () => selectedPages.value.length > 0 ? selectedPages.value[0] : null
  const is15Version = () => version.value === '15'
  const is30Version = () => version.value === '30'
  const is60Version = () => version.value === '60'

  // RETURN
  return {
    pageRoutes,
    deficiency,
    selectedPages,
    categoriesRestantes,
    pseudo,
    version,
    timerStartTime,
    timerFinishTime,
    lang,
    saveToLocalStorage,
    loadFromLocalStorage,
    removeDeficiencyFromCategories,
    addDeficiencyToCategories,
    resetAll,
    pickRandomPageFromCategory,
    moveToNextPage,
    nextRandomPage,
    setPseudo,
    setVersion,
    startTimer,
    finishTimer,
    addTimePenalty,
    getElapsedTime,
    restartTimer,
    is15Version,
    is30Version,
    is60Version,
  }
})
