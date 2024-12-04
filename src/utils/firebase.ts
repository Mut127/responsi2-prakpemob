// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAS2ib_vLcJj_KliSXHCZqQLLByVN2Av8w",
    authDomain: "responsi-muthia.firebaseapp.com",
    projectId: "responsi-muthia",
    storageBucket: "responsi-muthia.firebasestorage.app",
    messagingSenderId: "672935741400",
    appId: "1:672935741400:web:5da94f5406290dba7794ad"
  };


const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);


export { auth, googleProvider, db };