"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Are you sure want to logout?",
  confirmText = "Logout",
  cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Logout
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 mt-2">{title}</p>

        <DialogFooter className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-6"
          >
            {cancelText}
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={loading}
            className="px-6"
          >
            {loading ? `${confirmText}...` : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
