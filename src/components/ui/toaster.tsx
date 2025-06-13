
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { withReactReady } from "@/hooks/useSafeHooks"

function ToasterComponent() {
  // Safe hook calls with error boundaries
  let toasts: any[] = [];

  try {
    const { toasts: toastList } = useToast();
    toasts = toastList;
  } catch (error) {
    console.error('Error in Toaster hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

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
}

export const Toaster = withReactReady(ToasterComponent);
