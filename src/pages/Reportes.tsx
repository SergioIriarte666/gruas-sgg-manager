
import { Suspense } from "react";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";
import { ReportesContent } from "@/components/reportes/ReportesContent";
import { QuerySafeWrapper } from "@/components/reportes/QuerySafeWrapper";

export default function Reportes() {
  console.log('Reportes page: Rendering with QuerySafeWrapper and Suspense...');
  
  return (
    <QuerySafeWrapper>
      <Suspense fallback={<ReportesLoadingSkeleton />}>
        <ReportesContent />
      </Suspense>
    </QuerySafeWrapper>
  );
}
