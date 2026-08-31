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
    visual: [2, 1, 10, 11, 13, 14, 15],
    physical: [5, 6, 12],
    hearing: [7, 8],
    cognitive: [9, 3, 4, 16],
  })

  const selectedPages = ref<string[]>([])
  const categoriesRestantes = ref(['visual', 'physical', 'hearing', 'cognitive'])

  const pseudo = ref('')
  const version = ref<'15' | '30' | '60'>('60')
  const sessionCode = ref('')
  const timerStartTime = ref<number | null>(null)
  const timerFinishTime = ref<number | null>(null)
  const lang = ref('en')

  // HELPERS

  // Convertit un texte en nombre (seed) en additionnant les codes de chaque caractère
  function textToSeed(text: string): number {
    let seed = 0
    for (const char of text) {
      seed = seed + char.charCodeAt(0)
    }
    return seed
  }

  // Générateur aléatoire déterministe (LCG) : même seed → même séquence
  function seededRandom(seed: number): () => number {
    let current = seed
    return () => {
      current = (current * 9301 + 49297) % 233280
      return current / 233280
    }
  }

  // Fenêtre de validité d'un code de session : doit rester strictement
  // supérieure à la durée max d'une session (60 min) pour qu'un rafraîchissement
  // ou une reconnexion en cours de session ne change jamais la séquence tirée.
  // Passé ce délai, le même code produit un nouveau tirage (nouvelle session).
  const SESSION_WINDOW_MS = 2 * 60 * 60 * 1000 // 2h

  function getTimeBucket(): number {
    return Math.floor(Date.now() / SESSION_WINDOW_MS)
  }

  const shuffleArray = <T>(arr: T[], randomFn: () => number = Math.random): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1))
      ;[a[i], a[j]] = [a[j]!, a[i]!]
    }
    return a
  }

  // ACTIONS
  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('tota11y-game', JSON.stringify({
        selectedPages: selectedPages.value,
        categoriesRestantes: categoriesRestantes.value,
        sessionCode: sessionCode.value,
        timerStartTime: timerStartTime.value,
        timerFinishTime: timerFinishTime.value,
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
        // On restaure juste la valeur : pas d'appel à setSessionCode/randomizePages
        // ici, car selectedPages vient déjà d'être restauré tel quel ci-dessus.
        sessionCode.value = data.sessionCode || ''
        timerStartTime.value = data.timerStartTime ?? null
        timerFinishTime.value = data.timerFinishTime ?? null
      }
    }
  }

  // Parse le code de session : les 2 derniers caractères = durée (15/30/60), le reste = seed
  // Normalisé en majuscules pour que "form60" et "FORM60" soient équivalents
  const setSessionCode = (code: string) => {
    sessionCode.value = code.trim().toUpperCase()
    if (sessionCode.value) {
      const suffix = sessionCode.value.slice(-2)
      if (['15', '30', '60'].includes(suffix)) {
        version.value = suffix as '15' | '30' | '60'
      }
    }
    randomizePages()
  }

  const randomizePages = () => {
    // Si un code de session est défini, on utilise un générateur seedé,
    // combinant le texte du code et la tranche horaire de 2h en cours
    // (voir SESSION_WINDOW_MS) pour que le même code expire naturellement.
    const randomFn = sessionCode.value
      ? seededRandom(textToSeed(sessionCode.value) + getTimeBucket())
      : Math.random

    // 15 min : fixe — page 18, puis 2 et 9 dans un ordre aléatoire
    if (version.value === '15') {
      const pair = randomFn() < 0.5 ? [2, 9] : [9, 2]
      selectedPages.value = [18, ...pair].map(n => pageRoutes.value[n]!)
      saveToLocalStorage()
      return
    }

    const pageNumbers: number[] = [18]
    const limits = (version.value === '30' ? 6 : 10)

    if (categoriesRestantes.value.length === 0) {
      selectedPages.value = pageNumbers.map(n => pageRoutes.value[n]!)
      saveToLocalStorage()
      return
    }

    // Pool par catégorie : page forcée en tête, puis pool aléatoire
    // visual → 2 en premier, cognitive → 9 en premier
    const FORCED: Partial<Record<string, number>> = { visual: 2, cognitive: 9 }

    // Avec un code de session : on mélange TOUJOURS les 4 catégories complètes,
    // même si l'utilisateur a filtré certaines d'entre elles. Ça garantit que le
    // nombre de tirages aléatoires consommés est identique pour tout le monde,
    // et donc que l'ordre relatif des catégories communes reste le même pour
    // tous les participants du même code, peu importe leur filtre.
    // Sans code de session, comportement inchangé : on mélange directement les catégories actives.
    const categoriesToShuffle = sessionCode.value
      ? ['visual', 'physical', 'hearing', 'cognitive']
      : categoriesRestantes.value
    const allShuffledCategories = shuffleArray(categoriesToShuffle, randomFn)
    const allAvailablePages: number[][] = allShuffledCategories.map((cat) => {
      const forced = FORCED[cat]
      const pool = shuffleArray((deficiency.value[cat] ?? []).filter(p => p !== forced), randomFn)
      return forced !== undefined ? [forced, ...pool] : pool
    })

    // On ne garde que les catégories actives de CET utilisateur, sans re-mélanger
    const kept = allShuffledCategories
      .map((cat, i) => ({ cat, i }))
      .filter(({ cat }) => categoriesRestantes.value.includes(cat))
    const shuffledCategories = kept.map(k => k.cat)
    const availablePages = kept.map(k => allAvailablePages[k.i]!)

    // Distribution équitable avec redistribution si un pool est épuisé
    const counts = availablePages.map(() => 0)
    let left = limits

    while (left > 0) {
      // Buckets ayant encore des pages disponibles
      const eligible = availablePages
        .map((b, i) => ({ i, avail: b.length - counts[i]! }))
        .filter(x => x.avail > 0)

      // Plus aucun bucket dispo : on arrête
      if (eligible.length === 0) break

      const n = eligible.length
      // Quota de base par bucket + les slots restants donnés aux premiers buckets
      const base = Math.floor(left / n)
      const extra = left % n
      let distributed = 0

      for (let j = 0; j < eligible.length; j++) {
        const { i } = eligible[j]!
        // On ne dépasse pas ce que le bucket peut fournir
        const canTake = Math.min(base + (j < extra ? 1 : 0), availablePages[i]!.length - counts[i]!)
        counts[i]! += canTake
        distributed += canTake
      }

      left -= distributed
      // Si rien n'a pu être distribué malgré des buckets éligibles, on sort
      if (distributed === 0) break
    }

    // Assembler les groupes dans l'ordre des catégories mélangées
    for (let i = 0; i < shuffledCategories.length; i++) {
      pageNumbers.push(...availablePages[i]!.slice(0, counts[i]))
    }

    selectedPages.value = pageNumbers.map(n => pageRoutes.value[n]!)
    saveToLocalStorage()
  }

  const removeDeficiencyFromCategories = (deficiencyName: string) => {
    categoriesRestantes.value = categoriesRestantes.value.filter(
      cat => cat !== deficiencyName,
    )
    randomizePages()
  }

  const addDeficiencyToCategories = (deficiencyName: string) => {
    if (!categoriesRestantes.value.includes(deficiencyName)) {
      categoriesRestantes.value.push(deficiencyName)
    }
    randomizePages()
  }

  const resetAll = () => {
    categoriesRestantes.value = ['visual', 'physical', 'hearing', 'cognitive']
    randomizePages()
  }

const moveToNextPage = (currentRoute: string): string | null => {
    if (selectedPages.value.length === 0) {
      return null
    }

    // Only shift if the current page is the one at the head of the queue
    if (selectedPages.value[0] === currentRoute) {
      selectedPages.value.shift()
      saveToLocalStorage()
    }

    return selectedPages.value[0] || null
  }

  const setPseudo = (newPseudo: string) => {
    pseudo.value = newPseudo
  }

const setVersion = (newVersion: '15' | '30' | '60') => {
    version.value = newVersion
    randomizePages()
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
    sessionCode,
    saveToLocalStorage,
    loadFromLocalStorage,
    removeDeficiencyFromCategories,
    addDeficiencyToCategories,
    randomizePages,
    resetAll,
    moveToNextPage,
    nextRandomPage,
    setPseudo,
    setVersion,
    setSessionCode,
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
