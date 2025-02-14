import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCYHOo1j0qQW2ljOfYBt0lD7VGSRwQyH6U",
  authDomain: "clinikk-b434d.firebaseapp.com",
  projectId: "clinikk-b434d",
  storageBucket: "clinikk-b434d.firebasestorage.app",
  messagingSenderId: "633604302386",
  appId: "1:633604302386:web:81c01db4c7fd1ad846be2b",
  measurementId: "G-BE9HRZ1X8Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {auth};
