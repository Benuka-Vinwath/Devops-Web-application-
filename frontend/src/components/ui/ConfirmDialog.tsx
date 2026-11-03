import { useEffect, useId, useRef } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** red confirm button for things that can't be undone */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Themed replacement for window.confirm. Built on <dialog>, so focus is trapped, Esc closes it and the page behind is inert.
export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = "Not now", danger, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault(); // Esc: let the parent decide, so its state stays the source of truth
        onCancel();
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-ink-900/10 bg-parchment-50 p-0 text-ink-900 shadow-elevate backdrop:bg-pine-950/50"
    >
      <div className="p-6">
        <h2 id={titleId} className="font-display text-xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "primary" : "secondary"} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
