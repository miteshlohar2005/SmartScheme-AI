import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyReplaceMeThisIsForLocalApp",
    authDomain: "smartscheme-ai.firebaseapp.com",
    projectId: "smartscheme-ai",
    storageBucket: "smartscheme-ai.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
