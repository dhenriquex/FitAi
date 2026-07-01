// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyA_2Nn_-AnLmGYnw87Gt9nGnfFgJ39NqFQ",
  authDomain: "fitai-1af0a.firebaseapp.com",
  projectId: "fitai-1af0a",
  storageBucket: "fitai-1af0a.firebasestorage.app",
  messagingSenderId: "468911580666",
  appId: "1:468911580666:web:eda158a925a4fb5fd3b043",
  measurementId: "G-XCF7R8B2KK",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
