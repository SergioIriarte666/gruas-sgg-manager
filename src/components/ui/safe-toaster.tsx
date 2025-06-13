
import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { SafeToastProvider } from "@/components/ui/safe-toast-provider"

function SafeToasterComponent() {
  console.log("SafeToasterComponent: Starting render...");
  
  try {
    return (
      <SafeToastProvider>
        <Toaster />
      </SafeToastProvider>
    )
  } catch (error) {
    console.error('SafeToasterComponent: Error rendering:', error);
    // Return nothing in case of error to prevent cascading failures
    return null;
  }
}

export const SafeToaster = SafeToasterComponent;
