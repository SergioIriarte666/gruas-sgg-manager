
import React from "react"
import { useSafeToast } from "@/hooks/use-safe-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

function SafeToasterComponent() {
  console.log("SafeToasterComponent: Starting render...");
  
  try {
    const { toasts } = useSafeToast();
    console.log("SafeToasterComponent: Got toasts:", toasts);

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
    console.error('SafeToasterComponent: Error rendering:', error);
    // Retornar un ToastProvider vacío en caso de error
    return (
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
  }
}

export const SafeToaster = SafeToasterComponent;
