
import React, { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

// Check if React dispatcher is available
function isReactDispatcherReady(): boolean {
  try {
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return ReactInternals?.ReactCurrentDispatcher?.current !== null;
  } catch {
    return false;
  }
}

export function useIsMobile() {
  // If React dispatcher is not ready, return false immediately without calling hooks
  if (!isReactDispatcherReady()) {
    console.log('useIsMobile: React dispatcher not ready, returning default value');
    return false;
  }

  // Only call useState when React is properly initialized
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
