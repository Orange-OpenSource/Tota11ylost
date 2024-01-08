import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBU-qFh8AT8amoWZZpJ658_DmLMb-yp5w",
  authDomain: "testescapea11y.firebaseapp.com",
  projectId: "testescapea11y",
  storageBucket: "testescapea11y.appspot.com",
  messagingSenderId: "486048904670",
  appId: "1:486048904670:web:41313a49c854387269594f",
  measurementId: "G-TLDCPF9GNX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function savePseudo(pseudo, timer = "00:00") {
  try {
    const docRef = await addDoc(collection(db, "score"), {
      pseudo: pseudo,
      timer: timer,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function bestScore() {
  const queryDocs = query(collection(db, "score"), orderBy("timer"));

  const querySnapshot = await getDocs(queryDocs);

  querySnapshot.forEach((doc) => {
    console.log(doc.data());
  });
}
