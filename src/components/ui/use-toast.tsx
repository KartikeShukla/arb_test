import { createContext, useContext } from "react"

interface ToastProps {
  title?: string
  description?: string
  status?: "info" | "warning" | "success" | "error"
  duration?: number
  isClosable?: boolean
}

interface ToastContextType {
  (props: ToastProps): void
}

// Create a Toast Context
const ToastContext = createContext<ToastContextType | null>(null)

// Simple console-based toast implementation for now
export const toast = (props: ToastProps) => {
  // Log for debugging only, no visual display
  console.log(`[Toast] ${props.status?.toUpperCase() || 'INFO'}: ${props.title || ''}`);
  console.log(`[Toast] ${props.description || ''}`);
  
  // No visual toast implementation - completely silent to the user
}; 