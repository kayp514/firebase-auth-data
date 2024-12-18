// src/auth/errorHandling.ts

import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';


type AuthErrorResponse = {
  success: false;
  message: string;
  code: string;
};

export function handleAuthError(error: unknown): AuthErrorResponse {
  console.error('Authentication error:', error);
  
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Invalid Credentials
      case AuthErrorCodes.INVALID_EMAIL:
        return { success: false, message: 'Invalid email format', code: error.code };
      case AuthErrorCodes.INVALID_PASSWORD:
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      case 'auth/invalid-credential':
        return { success: false, message: 'Invalid email or password', code: error.code };
        
      // Account Status
      case 'auth/user-disabled':
        return { success: false, message: 'This account has been disabled', code: error.code };
      case 'auth/user-token-expired':
        return { success: false, message: 'Your session has expired. Please login again', code: error.code };
        
      // Rate Limiting
      case 'auth/too-many-requests':
        return { success: false, message: 'Too many attempts. Please try again later', code: error.code };
        
      // Network Issues
      case 'auth/network-request-failed':
        return { success: false, message: 'Network error. Please check your connection', code: error.code };
        
      // Authentication Method Issues
      case 'auth/operation-not-allowed':
        return { success: false, message: 'This login method is not enabled', code: error.code };
      case 'auth/popup-blocked':
        return { success: false, message: 'Login popup was blocked. Please enable popups', code: error.code };
      case 'auth/popup-closed-by-user':
        return { success: false, message: 'Login popup was closed before completion', code: error.code };
        
      // Account Conflicts
      case 'auth/account-exists-with-different-credential':
        return { success: false, message: 'An account already exists with a different sign-in method', code: error.code };
      case 'auth/email-already-exists':
        return { success: false, message: 'This email is already in use', code: error.code };
      case 'auth/phone-number-already-exists':
        return { success: false, message: 'This phone number is already in use', code: error.code };
        
      // Invalid Parameters
      case 'auth/invalid-phone-number':
        return { success: false, message: 'Invalid phone number format', code: error.code };
      case 'auth/invalid-verification-code':
        return { success: false, message: 'Invalid verification code', code: error.code };
      case 'auth/invalid-verification-id':
        return { success: false, message: 'Invalid verification ID', code: error.code };
      case 'auth/missing-verification-code':
        return { success: false, message: 'Please enter the verification code', code: error.code };
      case 'auth/missing-verification-id':
        return { success: false, message: 'Missing verification ID', code: error.code };
        
      // Session/Token Issues
      case 'auth/id-token-expired':
        return { success: false, message: 'Authentication token expired', code: error.code };
      case 'auth/id-token-revoked':
        return { success: false, message: 'Authentication token has been revoked', code: error.code };
      case 'auth/invalid-id-token':
        return { success: false, message: 'Invalid authentication token', code: error.code };
      case 'auth/session-cookie-expired':
        return { success: false, message: 'Session cookie expired', code: error.code };
        
      // Project Configuration
      case 'auth/project-not-found':
        return { success: false, message: 'Project configuration error', code: error.code };
      case 'auth/insufficient-permission':
        return { success: false, message: 'Authorization error', code: error.code };
        
      // Internal Errors
      case 'auth/internal-error':
        return { success: false, message: 'An internal error occurred. Please try again', code: error.code };
        
      default:
        return { success: false, message: `Authentication error: ${error.message}`, code: error.code };
    }
  }
  
  return { success: false, message: 'An unexpected error occurred. Please try again later', code: 'unknown' };
}