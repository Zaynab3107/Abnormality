import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCow9fhax7VVcUdPUmTfFLsqZEWhYb2zxM",
  authDomain: "abnormalities-app.firebaseapp.com",
  databaseURL: "https://abnormalities-app-default-rtdb.firebaseio.com",
  projectId: "abnormalities-app",
  storageBucket: "abnormalities-app.firebasestorage.app",
  messagingSenderId: "544019710199",
  appId: "1:544019710199:web:af07fb3e1dd89bd6c693f2",
  measurementId: "G-3YTRDHG6BZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore and Export
export const db = getFirestore(app);