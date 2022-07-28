import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyAKPYYeTz8ELJjsE3IawibZSH6todvOw_0",
  authDomain: "cs-poll.firebaseapp.com",
  projectId: "cs-poll",
  storageBucket: "cs-poll.appspot.com",
  messagingSenderId: "146004142608",
  appId: "1:146004142608:web:8eb1b2173711cc1540f895",
  measurementId: "G-QKJFBKNQLN",
});

export const store = getFirestore(app);
