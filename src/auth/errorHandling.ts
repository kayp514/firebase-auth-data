// src/auth/errorHandling.ts

import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';


type AuthErrorResponse = {
  success: false;
  message: string;
};

export function handleAuthError(error: unknown): AuthErrorResponse {
  console.error('Authentication error:', error);
  
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Invalid Credentials
      case AuthErrorCodes.INVALID_EMAIL:
        return { success: false, message: 'Invalid email format' };
      case AuthErrorCodes.INVALID_PASSWORD:
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      case 'auth/invalid-credential':
        return { success: false, message: 'Invalid email or password' };
        
      // Account Status
      case 'auth/user-disabled':
        return { success: false, message: 'This account has been disabled' };
      case 'auth/user-token-expired':
        return { success: false, message: 'Your session has expired. Please login again' };
        
      // Rate Limiting
      case 'auth/too-many-requests':
        return { success: false, message: 'Too many attempts. Please try again later' };
        
      // Network Issues
      case 'auth/network-request-failed':
        return { success: false, message: 'Network error. Please check your connection' };
        
      // Authentication Method Issues
      case 'auth/operation-not-allowed':
        return { success: false, message: 'This login method is not enabled' };
      case 'auth/popup-blocked':
        return { success: false, message: 'Login popup was blocked. Please enable popups' };
      case 'auth/popup-closed-by-user':
        return { success: false, message: 'Login popup was closed before completion' };
        
      // Account Conflicts
      case 'auth/account-exists-with-different-credential':
        return { success: false, message: 'An account already exists with a different sign-in method' };
      case 'auth/email-already-exists':
        return { success: false, message: 'This email is already in use' };
      case 'auth/phone-number-already-exists':
        return { success: false, message: 'This phone number is already in use' };
        
      // Invalid Parameters
      case 'auth/invalid-phone-number':
        return { success: false, message: 'Invalid phone number format' };
      case 'auth/invalid-verification-code':
        return { success: false, message: 'Invalid verification code' };
      case 'auth/invalid-verification-id':
        return { success: false, message: 'Invalid verification ID' };
      case 'auth/missing-verification-code':
        return { success: false, message: 'Please enter the verification code' };
      case 'auth/missing-verification-id':
        return { success: false, message: 'Missing verification ID' };
        
      // Session/Token Issues
      case 'auth/id-token-expired':
        return { success: false, message: 'Authentication token expired' };
      case 'auth/id-token-revoked':
        return { success: false, message: 'Authentication token has been revoked' };
      case 'auth/invalid-id-token':
        return { success: false, message: 'Invalid authentication token' };
      case 'auth/session-cookie-expired':
        return { success: false, message: 'Session cookie expired' };
        
      // Project Configuration
      case 'auth/project-not-found':
        return { success: false, message: 'Project configuration error' };
      case 'auth/insufficient-permission':
        return { success: false, message: 'Authorization error' };
        
      // Internal Errors
      case 'auth/internal-error':
        return { success: false, message: 'An internal error occurred. Please try again' };
        
      default:
        return { success: false, message: `Authentication error: ${error.message}` };
    }
  }
  
  return { success: false, message: 'An unexpected error occurred. Please try again later' };
}