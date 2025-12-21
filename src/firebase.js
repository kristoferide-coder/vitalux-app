// src/firebase.js

// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 👇 Deja aquí tal cual los datos que te dio Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVdPrM2vkZPrnhVGx2diAkl6W1m6Vv41s",
  authDomain: "vitaluxfit-app.firebaseapp.com",
  projectId: "vitaluxfit-app",
  storageBucket: "vitaluxfit-app.firebasestorage.app",
  messagingSenderId: "401439609686",
  appId: "1:401439609686:web:3a0ae345c8a9b1545f3cf7",
  measurementId: "G-0LSTT7DXJ7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usaremos en la app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
