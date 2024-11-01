'use server'

import { createUserWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/app/lib/firebaseClient";
import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin";

export async function signUpUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;
    
    return { success: true, uid: user.uid };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function signUpExternalUser(email: string, password: string, appId: string, isAdmin: boolean = false) {
  try {
    // Use admin SDK to create user
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
    });

    // Set custom claims for user role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // Store the user-app association in Firestore
    await adminDb.collection('adminApps').doc(appId).set({
      [userRecord.uid]: {
        email: email,
        createdAt: new Date().toISOString(),
      }
    }, { merge: true });

    return { success: true, uid: userRecord.uid, role: 'admin' };
  } catch (error) {
    console.error("Error signing up external user:", error);
    return { success: false, error: "Failed to create account" };
  }
}