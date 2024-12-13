//lib/firebaseClient.ts

import { initializeApp } from 'firebase/app'
import {  getAuth, setPersistence, browserSessionPersistence, inMemoryPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}


const clientApp = initializeApp(clientConfig)
export const clientAuth = getAuth(clientApp)
setPersistence(clientAuth, browserLocalPersistence)
export const db = getFirestore(clientApp)