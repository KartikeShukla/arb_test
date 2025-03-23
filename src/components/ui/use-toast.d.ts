declare module "@/components/ui/use-toast" {
  export interface ToastProps {
    title?: string;
    description?: string;
    status?: "info" | "warning" | "success" | "error";
    duration?: number;
    isClosable?: boolean;
  }

  export function useToast(): (props: ToastProps) => void;
  export const toast: (props: ToastProps) => void;
} 