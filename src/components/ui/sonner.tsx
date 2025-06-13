
import { Toaster as Sonner, toast } from "sonner"
import { withReactReady } from "@/hooks/useSafeHooks"

type ToasterProps = React.ComponentProps<typeof Sonner>

function ToasterComponent({ ...props }: ToasterProps) {
  // Safe theme handling - provide fallback for theme
  let theme = "system";
  
  try {
    // Try to use next-themes only if available
    const { useTheme } = require("next-themes");
    const themeResult = useTheme();
    theme = themeResult?.theme || "system";
  } catch (error) {
    console.warn('next-themes not available, using system theme');
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export const Toaster = withReactReady(ToasterComponent);
export { toast }
