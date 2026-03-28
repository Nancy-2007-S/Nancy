import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Actual Firebase Web Config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyBzdrz5F9jIOIBgelxf2sq63hFaQRDhp_Q",
  authDomain: "career-mentor-ai-2c7ae.firebaseapp.com",
  projectId: "career-mentor-ai-2c7ae",
  storageBucket: "career-mentor-ai-2c7ae.firebasestorage.app",
  messagingSenderId: "476904803896",
  appId: "1:476904803896:web:2c0e213b2ee6ec0ecea0cd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
