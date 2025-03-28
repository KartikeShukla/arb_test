import { PostgrestError } from "@supabase/supabase-js"

/**
 * Standard error response format
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Process a Supabase PostgrestError into a standardized format
 * 
 * @param error - The Supabase PostgrestError object
 * @param fallbackMessage - Optional fallback message if error doesn't contain a message
 * @returns A standardized error response
 */
export function handleSupabaseError(
  error: PostgrestError | null | undefined,
  fallbackMessage = "An unknown database error occurred"
): ErrorResponse {
  if (!error) {
    return {
      message: fallbackMessage
    };
  }

  return {
    message: error.message || fallbackMessage,
    code: error.code,
    details: error.details,
    hint: error.hint
  };
}

/**
 * Process a generic error into a standardized format
 * 
 * @param error - The error object
 * @param fallbackMessage - Optional fallback message if error isn't an Error instance
 * @returns A standardized error response
 */
export function handleGenericError(
  error: unknown,
  fallbackMessage = "An unknown error occurred"
): ErrorResponse {
  // If it's a Supabase PostgrestError
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return handleSupabaseError(error as PostgrestError, fallbackMessage);
  }
  
  // If it's a standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack
    };
  }
  
  // If it's a string
  if (typeof error === 'string') {
    return {
      message: error
    };
  }
  
  // Default case for unknown error types
  return {
    message: fallbackMessage
  };
}

/**
 * Log an error with consistent formatting
 * 
 * @param context - The context in which the error occurred (e.g., function name)
 * @param error - The error object
 */
export function logError(context: string, error: unknown): void {
  const formattedError = handleGenericError(error);
  
  console.error(`Error in ${context}:`, {
    message: formattedError.message,
    code: formattedError.code,
    details: formattedError.details,
    hint: formattedError.hint
  });
}

/**
 * Create a user-friendly error message from various error types
 * 
 * @param error - The error object
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const formattedError = handleGenericError(error);
  
  // Map specific error codes to user-friendly messages
  if (formattedError.code) {
    switch (formattedError.code) {
      case '23505': // Unique violation in PostgreSQL
        return "This entry already exists. Please try with different information.";
      case '23503': // Foreign key violation in PostgreSQL
        return "This action cannot be completed because it references data that doesn't exist.";
      case '42P01': // Undefined table in PostgreSQL
        return "There was a problem with the database structure. Please contact support.";
      case 'P0001': // Raised exception in PostgreSQL
        return formattedError.message || "A database constraint was violated.";
      case '23502': // Not null violation in PostgreSQL
        return "Required information is missing. Please fill in all required fields.";
      case '42703': // Undefined column in PostgreSQL
        return "There was a problem with the database structure. Please contact support.";
      default:
        break;
    }
  }
  
  // Common authentication error messages
  if (formattedError.message.includes("Invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  
  if (formattedError.message.includes("Email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  
  if (formattedError.message.includes("User already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  
  // Default to the original error message or a generic one
  return formattedError.message || "An unexpected error occurred. Please try again later.";
}

/**
 * Handle API errors and return appropriate status code and message
 * 
 * @param error - The error object
 * @returns Object containing status code and error message
 */
export function handleApiError(error: unknown): { statusCode: number; message: string } {
  const formattedError = handleGenericError(error);
  
  // Map error codes to appropriate HTTP status codes
  if (formattedError.code) {
    switch (formattedError.code) {
      case '23505': // Unique violation
        return { statusCode: 409, message: getUserFriendlyErrorMessage(error) };
      case '23503': // Foreign key violation
        return { statusCode: 404, message: getUserFriendlyErrorMessage(error) };
      case '42P01': // Undefined table
      case '42703': // Undefined column
        return { statusCode: 500, message: getUserFriendlyErrorMessage(error) };
      case '23502': // Not null violation
        return { statusCode: 400, message: getUserFriendlyErrorMessage(error) };
      default:
        break;
    }
  }
  
  // Authentication/Authorization errors
  if (formattedError.message.includes("JWT expired")) {
    return { statusCode: 401, message: "Your session has expired. Please sign in again." };
  }
  
  if (formattedError.message.includes("invalid signature")) {
    return { statusCode: 401, message: "Invalid authentication token. Please sign in again." };
  }
  
  if (formattedError.message.includes("permission denied")) {
    return { statusCode: 403, message: "You don't have permission to perform this action." };
  }
  
  // Default to internal server error
  return { 
    statusCode: 500, 
    message: getUserFriendlyErrorMessage(error)
  };
} 