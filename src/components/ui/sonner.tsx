
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

function ToasterComponent({ ...props }: ToasterProps) {
  console.log("SonnerToaster: Attempting to render...");
  
  try {
    // Use static theme to avoid hook issues during initialization
    const theme = "system";

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
  } catch (error) {
    console.error('SonnerToaster: Error during render:', error);
    return null;
  }
}

export const Toaster = ToasterComponent;
export { toast }
