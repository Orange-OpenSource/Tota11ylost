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
  apiKey: "AIzaSyAjQ_xuPbBkFn3w-yk9EqxWwk6AN762v88",
  authDomain: "tota11y-lost.firebaseapp.com",
  projectId: "tota11y-lost",
  storageBucket: "tota11y-lost.appspot.com",
  messagingSenderId: "696348049651",
  appId: "1:696348049651:web:f4b7aab8c7e393e8b1f786",
  measurementId: "G-07KXED87T2"
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
