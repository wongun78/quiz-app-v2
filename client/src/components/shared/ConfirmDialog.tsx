import { create } from "zustand";
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

interface ConfirmDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

const useConfirmDialogStore = create<ConfirmDialogState>(() => ({
  open: false,
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "default",
  onConfirm: () => {},
  onCancel: () => {},
}));

export function ConfirmDialog() {
  const state = useConfirmDialogStore();

  return (
    <AlertDialog
      open={state.open}
      onOpenChange={(open) => !open && state.onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={state.onCancel}>
            {state.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={state.onConfirm}
            className={
              state.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {state.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function confirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirmDialogStore.setState({
      open: true,
      title,
      description,
      confirmText,
      cancelText,
      variant,
      onConfirm: () => {
        useConfirmDialogStore.setState({ open: false });
        resolve(true);
      },
      onCancel: () => {
        useConfirmDialogStore.setState({ open: false });
        resolve(false);
      },
    });
  });
}
