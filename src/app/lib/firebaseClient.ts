//lib/firebaseClient.ts

import { initializeApp } from 'firebase/app'
import {  getAuth, setPersistence, browserSessionPersistence, inMemoryPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

//const clientConfig = {}

const response = await fetch('https://api.ternsecure.com/api/fireconfig')
const clientConfig = await response.json()


const clientApp = initializeApp(clientConfig)
export const clientAuth = getAuth(clientApp)
setPersistence(clientAuth, browserSessionPersistence)
export const db = getFirestore(clientApp)