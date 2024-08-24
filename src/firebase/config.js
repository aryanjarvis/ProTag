import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB4DdltYjD_lfYmW5HuBOjdLUvPnI580DQ",
  authDomain: "protag-f9d58.firebaseapp.com",
  projectId: "protag-f9d58",
  storageBucket: "protag-f9d58.appspot.com",
  messagingSenderId: "824602613440",
  appId: "1:824602613440:web:c0c20f897491fd442abf25"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp
const array_add=firebase.firestore.FieldValue

export { projectFirestore, projectAuth, timestamp, projectStorage,array_add }