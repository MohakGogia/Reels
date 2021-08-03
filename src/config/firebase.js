import firebase from "firebase";

let firebaseConfig = {
    apiKey: "AIzaSyC8fa7d6XGaVtu_ixBdx0LddkSf6SKMkrA",
    authDomain: "reels-409f2.firebaseapp.com",
    projectId: "reels-409f2",
    storageBucket: "reels-409f2.appspot.com",
    messagingSenderId: "399990480985",
    appId: "1:399990480985:web:3e06105bd775b43f519148"
  };

let firebaseApp = firebase.initializeApp(firebaseConfig);
export let firebaseAuth = firebaseApp.auth();
export let firebaseStorage = firebaseApp.storage();
export let firebaseDB = firebaseApp.firestore();
export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;