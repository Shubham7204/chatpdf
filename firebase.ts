import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChBUY_vvCfCL9mF5rFcuXmsex9zEKW7wE",
  authDomain: "chatpdf-65464.firebaseapp.com",
  projectId: "chatpdf-65464",
  storageBucket: "chatpdf-65464.appspot.com",
  messagingSenderId: "348813183467",
  appId: "1:348813183467:web:3264d7045b512f153af1ae",
  measurementId: "G-Q556P5HLKQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
