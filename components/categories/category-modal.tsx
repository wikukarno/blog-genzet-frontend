"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { extractApiValidationError } from "@/lib/handle-api-error";

type CategoryModalProps = {
  open: boolean;
  mode?: "create" | "edit";
  defaultValue?: string;
  onClose: () => void;
  onSave: (value: string) => void | Promise<unknown>;
};

export default function CategoryModal({
  open,
  onClose,
  onSave,
  defaultValue = "",
  mode = "create",
}: CategoryModalProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        setValue("");
      } else {
        setValue(defaultValue);
      }

      setError("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open, mode, defaultValue]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(trimmed);
      onClose();
    } catch (error) {
      const message = extractApiValidationError(error, "name");
      if (message) {
        setError(message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Input
            ref={inputRef}
            placeholder="Enter category name..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
