/*
Software Name: Tota11ylost
SPDX-FileCopyrightText: Copyright (c) Orange SA
SPDX-License-Identifier: AGPL-3.0-or-later

This software is distributed under the GNU Affero General Public License v3.0 or later,
the text of which is available at https://opensource.org/license/agpl-v3
or see the "LICENSE" file for more details.

Authors: See CONTRIBUTORS.txt file
Software description: Experience in a playful way the challenges faced by people with digital disabilities
*/

import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function getEnvVariable(key) {
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  return '';
}

const firebaseConfig = {
  apiKey: getEnvVariable('FIREBASE_API_KEY'),
  authDomain: getEnvVariable('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVariable('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVariable('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVariable('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVariable('FIREBASE_APP_ID'),
  measurementId: getEnvVariable('FIREBASE_MEASUREMENT_ID')
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function storePseudo(pseudo, duration) {
  const timer = getTime();

  const scoresRef = collection(db, "scores" + duration);
  const q = query(scoresRef, where("pseudo", "==", pseudo), where("timer", "==", timer));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const docRef = await addDoc(scoresRef, {
        pseudo: pseudo,
        timer: timer,
        date: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
    } else {
      console.log("Combinaison de pseudo et timer déjà enregistrée.");
    }
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}


export async function getBestScores(table, duration) {
  if (table === 'generalTable') {
    return getGeneralBestScores(duration);
  } else {
    return getTodayBestScores(duration);
  }
}

async function getGeneralBestScores(duration) {
  const queryDocs = query(collection(db, "scores" + duration), orderBy("timer"));
  const querySnapshot = await getDocs(queryDocs);
  const scores = [];
  querySnapshot.forEach((doc) => {
    scores.push(doc.data());
  });
  return scores;
}

async function getTodayBestScores(duration) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const scoresCol = collection(db, 'scores' + duration);
  const q = query(scoresCol, where('date', '>=', today), where('date', '<', tomorrow), orderBy('date'));

  const querySnapshot = await getDocs(q);
  const scores = [];
  querySnapshot.forEach((doc) => {
    scores.push(doc.data());
  });

  scores.sort((a, b) => a.timer - b.timer);
  return scores;
}
