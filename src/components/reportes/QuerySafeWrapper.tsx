
import { useEffect, useState } from "react";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";

interface QuerySafeWrapperProps {
  children: React.ReactNode;
}

export function QuerySafeWrapper({ children }: QuerySafeWrapperProps) {
  const [isContextReady, setIsContextReady] = useState(false);
  
  useEffect(() => {
    // Use a small delay to ensure React Query context is fully initialized
    const timer = setTimeout(() => {
      setIsContextReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isContextReady) {
    console.log('QuerySafeWrapper: Context not ready yet');
    return <ReportesLoadingSkeleton />;
  }
  
  console.log('QuerySafeWrapper: Context ready, rendering children');
  return <>{children}</>;
}
