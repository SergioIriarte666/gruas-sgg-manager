
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Siempre llamar useState - los hooks deben ser incondicionales
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Valor inicial seguro
    if (typeof window === 'undefined') {
      return false
    }
    return window.innerWidth < MOBILE_BREAKPOINT
  })

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
