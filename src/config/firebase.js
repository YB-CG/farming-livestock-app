// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCk3Bw1zA4tQmaf9LACBeFopJzMqd1CJnE",
  authDomain: "greenfarm-d2b46.firebaseapp.com",
  projectId: "greenfarm-d2b46",
  storageBucket: "greenfarm-d2b46.appspot.com",
  messagingSenderId: "33413352712",
  appId: "1:33413352712:web:e1e116455f3a14b938b0bd",
  measurementId: "G-8PB6C7TTS3"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };