import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZqfld9ZALSUujJyVqzgkft7MLASGDbTI",
  authDomain: "donatehub-d09f5.firebaseapp.com",
  projectId: "donatehub-d09f5",
  storageBucket: "donatehub-d09f5.appspot.com",
  messagingSenderId: "79263324557",
  appId: "1:79263324557:web:923e19899eb7157635c5c4",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { storage, auth, authProvider, githubProvider };
