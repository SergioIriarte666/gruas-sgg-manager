
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

function ToasterComponent() {
  console.log("ToasterComponent: Attempting to render...");
  
  // Simple early return if React isn't ready
  try {
    const { toasts } = useToast();
    console.log("ToasterComponent: useToast successful, toasts:", toasts);

    return (
      <ToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    )
  } catch (error) {
    console.error('ToasterComponent: Error in useToast:', error);
    return null;
  }
}

export const Toaster = ToasterComponent;
