
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

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
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
  }
>(({ className, children, asChild = false, ...props }, ref) => {
  console.log('TooltipTrigger: Rendering as simple element');
  const Comp = asChild ? Slot : "div"
  
  return (
    <Comp
      ref={ref as any}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sideOffset?: number
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
  }
>(({ className, sideOffset = 4, side, align, children, ...props }, ref) => {
  console.log('TooltipContent: Not rendering tooltip content to prevent errors');
  // Return null to prevent rendering tooltip content
  return null;
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
