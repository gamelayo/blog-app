import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize the Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyAIrNNX7uT5ZLNU2v2hAQQOA9kHcvLiKXk",
  authDomain: "recipe-app-68b28.firebaseapp.com",
  projectId: "recipe-app-68b28",
  storageBucket: "recipe-app-68b28.appspot.com",
  messagingSenderId: "511521402713",
  appId: "1:511521402713:web:0d5bf0a64ec7e0fae66648",
};
const app = initializeApp(firebaseConfig);
// Get a reference to the Firebase Storage bucket
const storage = getStorage(app);

export default storage;
