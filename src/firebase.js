// src/firebase.js

// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 👇 Deja aquí tal cual los datos que te dio Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "vitaluxfit-app.firebaseapp.com",
  projectId: "vitaluxfit-app",
  storageBucket: "vitaluxfit-app.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usaremos en la app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
