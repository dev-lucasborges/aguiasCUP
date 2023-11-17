import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDloh4_3Kn_Y2EySMJEKdiHbnJLy7x2vks",
  authDomain: "aguiascup.firebaseapp.com",
  databaseURL: "https://aguiascup-default-rtdb.firebaseio.com",
  projectId: "aguiascup",
  storageBucket: "aguiascup.appspot.com",
  messagingSenderId: "99517739612",
  appId: "1:99517739612:web:533506ee130858187aac99",
  measurementId: "G-NQBK8M7Z63"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);