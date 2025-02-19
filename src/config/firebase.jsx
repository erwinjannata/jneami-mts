import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APP_DEBUG_TOKEN;
firebase.initializeApp(firebaseConfig);
firebase.appCheck().activate(import.meta.env.VITE_SITE_KEY, true);

export default firebase;
