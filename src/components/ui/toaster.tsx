
import React from "react"
import { useToast } from "@/hooks/use-safe-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  console.log("Toaster: Starting render...");
  
  try {
    const { toasts } = useToast();
    console.log("Toaster: Got toasts:", toasts);

    return (
      <ToastProvider>
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
      </ToastProvider>
    )
  } catch (error) {
    console.error('Toaster: Error rendering:', error);
    // Return empty ToastProvider in case of error
    return (
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
  }
}
