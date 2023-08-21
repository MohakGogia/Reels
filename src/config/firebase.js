import firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyApw-0eVfnxc1FCQXO3SPtPJwVzyhFSV8Y",
  authDomain: "reels-new-a074e.firebaseapp.com",
  projectId: "reels-new-a074e",
  storageBucket: "reels-new-a074e.appspot.com",
  messagingSenderId: "496874890693",
  appId: "1:496874890693:web:bdbfc3c6e7d84b5275d7ac",
  measurementId: "G-VV892P4BPB"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
export let firebaseAuth = firebaseApp.auth();
export let firebaseStorage = firebaseApp.storage();
export let firebaseDB = firebaseApp.firestore();
export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;