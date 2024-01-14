// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtmpc63FcwoQo4DSw9rpYRE9iceNUvxxg",
  authDomain: "ez-realtor.firebaseapp.com",
  projectId: "ez-realtor",
  storageBucket: "ez-realtor.appspot.com",
  messagingSenderId: "892769291744",
  appId: "1:892769291744:web:16d7c209a57efe6c3eaf85"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();