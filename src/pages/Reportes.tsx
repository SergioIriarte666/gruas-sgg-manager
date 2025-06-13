
import { useEffect, useState } from "react";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";
import { ReportesContent } from "@/components/reportes/ReportesContent";

export default function Reportes() {
  const [isContextReady, setIsContextReady] = useState(false);
  
  useEffect(() => {
    // Simple delay to ensure QueryClient context is ready
    const timer = setTimeout(() => {
      console.log('Context should be ready now');
      setIsContextReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isContextReady) {
    return <ReportesLoadingSkeleton />;
  }

  return <ReportesContent />;
}
