
import { Suspense } from "react";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";
import { ReportesContent } from "@/components/reportes/ReportesContent";

export default function Reportes() {
  return (
    <Suspense fallback={<ReportesLoadingSkeleton />}>
      <ReportesContent />
    </Suspense>
  );
}
