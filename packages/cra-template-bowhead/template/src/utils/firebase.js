import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAW3V551b53_Q4MIuWbhv_2c8dX4xnjraY",
  authDomain: "bowhead-d9522.firebaseapp.com",
  databaseURL: "https://bowhead-d9522.firebaseio.com",
  projectId: "bowhead-d9522",
  storageBucket: "bowhead-d9522.appspot.com",
  messagingSenderId: "839446933691",
  appId: "1:839446933691:web:6a1f97543a66c0dee8f99e"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// this will connect the browser to the local emulator for firestore, avoiding using the quota during development.
// IMPORTANT: when viewing the dev version of the app from a remote device using this dev machines IP, the app will
// connect to the live database.
if (process.env.NODE_ENV === "development") {
  // Note that the Firebase Web SDK must connect to the WebChannel port
  firestore.settings({
    host: "localhost:8080",
    ssl: false
  });
}

const getToken = () => {
  return firebase.auth().currentUser.getIdToken();
}

export { firebase, firestore, getToken };
