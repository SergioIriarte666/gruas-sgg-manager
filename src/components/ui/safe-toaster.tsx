
import React, { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { SafeToastProvider } from "@/components/ui/safe-toast-provider"

// Enhanced React readiness check with multiple validations
function isReactFullyStable(): boolean {
  try {
    // Check if we're in browser environment first
    if (typeof window === 'undefined') {
      return false;
    }

    // Check React internals
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!ReactInternals) {
      return false;
    }

    // Check dispatcher
    const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
    if (!dispatcher || dispatcher === null) {
      return false;
    }

    // Check that essential hooks are available on the dispatcher
    if (!dispatcher.useState || !dispatcher.useEffect || !dispatcher.useContext) {
      return false;
    }

    // Check batch config
    const batchConfig = ReactInternals?.ReactCurrentBatchConfig;
    if (batchConfig === undefined) {
      return false;
    }

    // Additional check - try to access React's version
    if (!React.version) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn('React stability check failed:', error);
    return false;
  }
}

function SafeToasterComponent() {
  console.log("SafeToasterComponent: Starting render...");
  
  const [isReactReady, setIsReactReady] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    console.log("SafeToasterComponent: Effect running, checking React stability...");
    
    let mounted = true;
    let checkCount = 0;
    const maxChecks = 50; // Prevent infinite checking
    
    const checkReactStability = () => {
      checkCount++;
      console.log(`SafeToasterComponent: Check ${checkCount}, React stable:`, isReactFullyStable());
      
      if (!mounted) return;
      
      if (isReactFullyStable()) {
        console.log("SafeToasterComponent: React is stable, enabling toaster");
        setIsReactReady(true);
        setHasChecked(true);
      } else if (checkCount < maxChecks) {
        // Check again in next tick
        setTimeout(checkReactStability, 10);
      } else {
        console.warn("SafeToasterComponent: Max checks reached, giving up on toast system");
        setHasChecked(true);
      }
    };

    // Start checking
    checkReactStability();

    return () => {
      mounted = false;
    };
  }, []);

  // Don't render anything until we've checked
  if (!hasChecked) {
    console.log("SafeToasterComponent: Still checking React stability...");
    return null;
  }

  // If React isn't ready after checking, don't render toast system
  if (!isReactReady) {
    console.log("SafeToasterComponent: React not stable, skipping toast system");
    return null;
  }

  try {
    console.log("SafeToasterComponent: Rendering with stable React");
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
