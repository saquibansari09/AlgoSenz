// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcHFqz282fCBZcTUNVrpVRBf0szhvWV0k",
  authDomain: "app-vehicle.firebaseapp.com",
  projectId: "app-vehicle",
  storageBucket: "app-vehicle.firebasestorage.app",
  messagingSenderId: "1066947324029",
  appId: "1:1066947324029:web:0bc6d2301cc77ab7692914",
  measurementId: "G-EJY4W4NWXF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);