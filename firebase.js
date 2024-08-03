// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore' //Access to the firestore database

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //apiKey: "AIzaSyAPjZ-vo145nh88PM7VKxJMc8oC1PsqEMk",
  authDomain: "pantry-app-1a2d9.firebaseapp.com",
  projectId: "pantry-app-1a2d9",
  storageBucket: "pantry-app-1a2d9.appspot.com",
  messagingSenderId: "880317017437",
  appId: "1:880317017437:web:0ec7b12e5661ad58324cb4",
  measurementId: "G-VVQV94G9GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{app, firestore} //To access firestorm files