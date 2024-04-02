// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7f-0SJelACRjR-wHRFkkl7UxLeV9bRRg",
  authDomain: "testnextjs-3db03.firebaseapp.com",
  projectId: "testnextjs-3db03",
  storageBucket: "testnextjs-3db03.appspot.com",
  messagingSenderId: "98726052546",
  appId: "1:98726052546:web:08142411e7eab39700315b",
  measurementId: "G-XNCYVP09QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};