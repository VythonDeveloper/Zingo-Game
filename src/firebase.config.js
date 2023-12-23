// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add these imports for authentication


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATeXMy5rr4wnIgY13onzUQCOBZ7pc_CKI",
  authDomain: "zingo-7c171.firebaseapp.com",
  databaseURL: "https://zingo-7c171-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zingo-7c171",
  storageBucket: "zingo-7c171.appspot.com",
  messagingSenderId: "933340993540",
  appId: "1:933340993540:web:736a516d4589688ede3d51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize the authentication instance
const provider = new GoogleAuthProvider(); // Create Google authentication provider instance

export { app, database, auth, provider };
