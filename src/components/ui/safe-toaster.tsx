
import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { SafeToastProvider } from "@/components/ui/safe-toast-provider"

// Comprehensive React readiness check
function isReactFullyInitialized(): boolean {
  try {
    // Basic environment check
    if (typeof window === 'undefined' || typeof React === 'undefined') {
      return false;
    }

    // Check React internals exist
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!ReactInternals) {
      return false;
    }

    // Check current dispatcher
    const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
    if (!dispatcher || dispatcher === null) {
      return false;
    }

    // Verify essential hooks are available on dispatcher
    const requiredHooks = ['useState', 'useEffect', 'useContext', 'useReducer'];
    for (const hook of requiredHooks) {
      if (typeof dispatcher[hook] !== 'function') {
        return false;
      }
    }

    // Check batch config exists
    if (ReactInternals?.ReactCurrentBatchConfig === undefined) {
      return false;
    }

    // Verify React version is available
    if (!React.version) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn('React initialization check failed:', error);
    return false;
  }
}

// Simple component that only renders when React is completely ready
function SafeToasterComponent() {
  console.log("SafeToasterComponent: Checking React readiness...");
  
  // Do not use any React hooks until we're certain React is ready
  if (!isReactFullyInitialized()) {
    console.log("SafeToasterComponent: React not ready, returning null");
    return null;
  }

  console.log("SafeToasterComponent: React is ready, rendering toast system");
  
  try {
    return (
      <SafeToastProvider>
        <Toaster />
      </SafeToastProvider>
    );
  } catch (error) {
    console.error('SafeToasterComponent: Error rendering toast system:', error);
    return null;
  }
}

export const SafeToaster = SafeToasterComponent;
