
import React from "react"
import { useToast } from "@/hooks/use-safe-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { SafeToastProvider } from "./safe-toast-provider"

export function Toaster() {
  console.log("Toaster: Starting render with SafeToastProvider...");
  
  try {
    const { toasts } = useToast();
    console.log("Toaster: Got toasts:", toasts);

    return (
      <SafeToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </SafeToastProvider>
    )
  } catch (error) {
    console.error('Toaster: Error rendering:', error);
    // Return empty SafeToastProvider in case of error
    return (
      <SafeToastProvider>
        <ToastViewport />
      </SafeToastProvider>
    );
  }
}
