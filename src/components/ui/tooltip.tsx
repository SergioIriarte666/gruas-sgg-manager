
import * as React from "react"

import { cn } from "@/lib/utils"

// Temporary safe implementations to prevent TooltipProvider errors
const TooltipProvider = ({ children, ...props }: any) => {
  console.log('TooltipProvider: Rendering children without tooltip context to prevent errors');
  return <>{children}</>;
};

const Tooltip = ({ children, ...props }: any) => {
  console.log('Tooltip: Rendering children without tooltip functionality');
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  console.log('TooltipTrigger: Rendering as simple div');
  return (
    <div
      ref={ref as any}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  console.log('TooltipContent: Not rendering tooltip content to prevent errors');
  // Return null to prevent rendering tooltip content
  return null;
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
