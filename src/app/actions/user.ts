'use server'

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export async function signUpUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return { success: true, uid: user.uid };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error: "Failed to create account" };
  }
}