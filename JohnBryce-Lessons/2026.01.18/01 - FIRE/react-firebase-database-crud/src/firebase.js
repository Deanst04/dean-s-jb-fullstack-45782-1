import firebase from "firebase/app";
import "firebase/database";

let config = {
  apiKey: "AIzaSyAac8rYoG59URLZ8pBbctYBx-3fbkGhYko",
  authDomain: "test-01-36c06.firebaseapp.com",
  databaseURL: "https://test-01-36c06-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-01-36c06",
  storageBucket: "test-01-36c06.firebasestorage.app",
  messagingSenderId: "1003407355420",
  appId: "1:1003407355420:web:9334d281f07de2903b79d9",
  measurementId: "G-W1EBHZX5HK"
};

firebase.initializeApp(config);

export default firebase.database();
