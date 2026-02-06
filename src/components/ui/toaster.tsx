// toaster.tsx
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  // Since TOAST_LIMIT = 1, we just read the first toast
  const isBottomLeft = !!toasts[0]?.bottomLeft;

  return (
    <ToastProvider duration={3000}>
      {toasts.map(
        ({ id, title, description, action, bottomLeft, ...props }) => (
          <Toast
            key={id}
            data-side={isBottomLeft ? "left" : "right"}
            {...props}
          >
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
      )}

      <ToastViewport
        className={
          isBottomLeft ? "sm:left-0 sm:right-auto" : "sm:right-0 sm:left-auto"
        }
      />
    </ToastProvider>
  );
}

// import { useToast } from "@/hooks/use-toast";
// import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

// export function Toaster() {
//   const { toasts } = useToast();

//   return (
//     <ToastProvider>
//       {toasts.map(function ({ id, title, description, action, ...props }) {
//         return (
//           <Toast key={id} {...props}>
//             <div className="grid gap-1">
//               {title && <ToastTitle>{title}</ToastTitle>}
//               {description && <ToastDescription>{description}</ToastDescription>}
//             </div>
//             {action}
//             <ToastClose />
//           </Toast>
//         );
//       })}
//       <ToastViewport />
//     </ToastProvider>
//   );
// }
