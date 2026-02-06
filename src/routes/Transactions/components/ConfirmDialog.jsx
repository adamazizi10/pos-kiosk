import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText,
  confirmText,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg p-8">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-2xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-lg">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4 mt-6">
          <AlertDialogCancel onClick={onClose} className="h-14 px-8 text-base">{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="h-14 px-8 text-base">{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
