// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Correct import for Firebase 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLp4cliTAnmV-jFQOY0Il15tRw2Vo-vK0",
  authDomain: "mnemo-hft.firebaseapp.com",
  projectId: "mnemo-hft",
  storageBucket: "mnemo-hft.firebasestorage.app",
  messagingSenderId: "281026490715",
  appId: "1:281026490715:web:8b1430e8c845d00edc2a7e",
  measurementId: "G-YG8469HC57"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); // Correct initialization for storage

// Export required Firebase functionalities
export { db, auth, provider, doc, setDoc, storage };