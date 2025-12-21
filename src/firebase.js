// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVdPrM2vkZPrnhVGx2diAkl6W1m6Vv41s",
  authDomain: "vitaluxfit-app.firebaseapp.com",
  projectId: "vitaluxfit-app",
  storageBucket: "vitaluxfit-app.firebasestorage.app",
  messagingSenderId: "401439609686",
  appId: "1:401439609686:web:3a0ae345c8a9b1545f3cf7",
  measurementId: "G-0LSTT7DXJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
