import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import { firebaseConfig } from '../config'

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// this will connect the browser to the local emulator for firestore, avoiding using the quota during development.
// IMPORTANT: when viewing the dev version of the app from a remote device using this dev machines IP, the app will
// connect to the live database.
if (process.env.NODE_ENV === "development" && !process.env.REACT_APP_CONNECT_TO_PROD_FIREBASE) {
  // Note that the Firebase Web SDK must connect to the WebChannel port
  firestore.settings({
    host: "localhost:8080",
    ssl: false
  });
}

const getToken = () => {
  return firebase.auth().currentUser.getIdToken();
}

export { firebase, getToken, firestore };
