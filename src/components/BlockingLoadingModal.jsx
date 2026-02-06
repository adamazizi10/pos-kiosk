import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";

const BlockingLoadingModal = ({ open, text }) => (
  <Dialog open={open}>
    <DialogPortal>
      <DialogOverlay className="bg-black/15" />
      <DialogPrimitive.Content
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className="fixed left-[50%] top-[50%] z-50 w-[320px] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border bg-background p-6 shadow-lg"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground/30 border-t-primary" />
          <p className="text-sm font-medium text-foreground">{text}</p>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  </Dialog>
);

export default BlockingLoadingModal;
