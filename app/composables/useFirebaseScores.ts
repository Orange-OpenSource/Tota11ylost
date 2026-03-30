// Tota11y Lost - Firebase Scores Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

import type { Firestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'

export interface ScoreEntry {
  pseudo: string
  timer: number
  date: Date
}

export function useFirebaseScores() {
  const config = useRuntimeConfig()
  const gameStore = useGameStore()

  let db: Firestore | null = null

  async function initFirebase() {
    if (db)
      return db

    try {
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey as string,
        authDomain: config.public.firebaseAuthDomain as string,
        projectId: config.public.firebaseProjectId as string,
        storageBucket: config.public.firebaseStorageBucket as string,
        messagingSenderId: config.public.firebaseMessagingSenderId as string,
        appId: config.public.firebaseAppId as string,
        measurementId: config.public.firebaseMeasurementId as string,
      }

      console.log('Initializing Firebase with config:', firebaseConfig)
      const app = initializeApp(firebaseConfig)
      db = getFirestore(app)
      return db
    }
    catch (error) {
      console.error('Firebase initialization failed:', error)
      return null
    }
  }

  async function storeScore(pseudo: string, duration: string) {
    const firestore = await initFirebase()
    if (!firestore)
      return

    const timer = gameStore.getElapsedTime()
    const scoresRef = collection(firestore, `scores${duration}`)
    const q = query(scoresRef, where('pseudo', '==', pseudo), where('timer', '==', timer))

    try {
      const snapshot = await getDocs(q)
      if (snapshot.empty)
        await addDoc(scoresRef, { pseudo, timer, date: new Date() })
    }
    catch (error) {
      console.error('Error storing score:', error)
    }
  }

  async function getGeneralScores(duration: string): Promise<ScoreEntry[]> {
    const firestore = await initFirebase()
    if (!firestore)
      return []

    const q = query(collection(firestore, `scores${duration}`), orderBy('timer'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as ScoreEntry)
  }

  async function getTodayScores(duration: string): Promise<ScoreEntry[]> {
    const firestore = await initFirebase()
    if (!firestore)
      return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const q = query(
      collection(firestore, `scores${duration}`),
      where('date', '>=', today),
      where('date', '<', tomorrow),
      orderBy('date'),
    )

    const snapshot = await getDocs(q)
    const scores = snapshot.docs.map(doc => doc.data() as ScoreEntry)
    return scores.sort((a, b) => a.timer - b.timer)
  }

  return {
    storeScore,
    getGeneralScores,
    getTodayScores,
  }
}
