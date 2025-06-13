
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";
import { ReportesContent } from "@/components/reportes/ReportesContent";

export default function Reportes() {
  const [isContextReady, setIsContextReady] = useState(false);
  
  useEffect(() => {
    // Check if QueryClient context is available
    let retryCount = 0;
    const maxRetries = 10;
    
    const checkContext = () => {
      try {
        // Try to access QueryClient - if it throws, context isn't ready
        const queryClient = useQueryClient();
        if (queryClient) {
          console.log('QueryClient context is ready');
          setIsContextReady(true);
          return;
        }
      } catch (error) {
        console.log('QueryClient context not ready, retrying...', retryCount);
      }
      
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(checkContext, 100);
      } else {
        console.error('Failed to initialize QueryClient context after maximum retries');
        // Force render anyway to avoid infinite loading
        setIsContextReady(true);
      }
    };
    
    // Start checking after a small delay
    setTimeout(checkContext, 50);
  }, []);

  if (!isContextReady) {
    return <ReportesLoadingSkeleton />;
  }

  return <ReportesContent />;
}
