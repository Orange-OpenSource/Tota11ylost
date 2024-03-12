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

const firebaseConfig = {
  apiKey: "AIzaSyBjDpcVw4WU99yMhPZLd2H3aXZJtBZye3U",
  authDomain: "tota11y-test-fccb5.firebaseapp.com",
  projectId: "tota11y-test-fccb5",
  storageBucket: "tota11y-test-fccb5.appspot.com",
  messagingSenderId: "241660499588",
  appId: "1:241660499588:web:a02ce4fdc2231bc0a554d1",
  measurementId: "G-H5ES6WTY4N"
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
  if (table === 'allTimeTable') {
    return getAlltimeBestScores(duration);
  } else {
    return getTodayBestScores(duration);
  }
}

async function getAlltimeBestScores(duration) {
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
