import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO5ApFEmBrs703djrvLzIwL8AvfXmw7HY",
  authDomain: "listing-agent-d989c.firebaseapp.com",
  projectId: "listing-agent-d989c",
  storageBucket: "listing-agent-d989c.firebasestorage.app",
  messagingSenderId: "874949065167",
  appId: "1:874949065167:web:c65b1ece8175da6c807aba",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
