// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  

const firebaseConfig = {
  apiKey: "AIzaSyCRFiojzvhHPu12duKRE-jev5toTbtXNFQ",
  authDomain: "bill-project-c4876.firebaseapp.com",
  projectId: "bill-project-c4876",
  storageBucket: "bill-project-c4876.appspot.com", 
  messagingSenderId: "299173875763",
  appId: "1:299173875763:web:e98b8e92c6a8579da75346",
  measurementId: "G-10VD2ZB0RC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { auth };
