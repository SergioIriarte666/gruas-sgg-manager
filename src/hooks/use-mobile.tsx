
import React, { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Check if we're in a safe React context
  try {
    // Check if React's internal dispatcher is available
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!ReactInternals?.ReactCurrentDispatcher?.current) {
      console.log('useIsMobile: React dispatcher not ready, returning default value');
      return false;
    }
  } catch (error) {
    console.log('useIsMobile: React internals not available, returning default value');
    return false;
  }

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
