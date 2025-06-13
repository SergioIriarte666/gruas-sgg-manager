
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Check if we're in a safe React context
  let isMobile = false;
  let setIsMobile: (value: boolean) => void = () => {};

  try {
    // Only call useState if React dispatcher is available
    const [isMobileState, setIsMobileState] = useState<boolean>(false);
    isMobile = isMobileState;
    setIsMobile = setIsMobileState;
  } catch (error) {
    console.log('useIsMobile: React dispatcher not ready, returning default value');
    // Return default value when React isn't ready
    return false;
  }

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
  }, [setIsMobile])

  return isMobile
}
