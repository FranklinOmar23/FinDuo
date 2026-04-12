import type { PropsWithChildren } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose?: () => void;
}

export const Modal = ({ children, open, title, onClose }: PropsWithChildren<ModalProps>) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="panel w-full max-w-md rounded-[28px] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl text-pine">{title}</h3>
          {onClose ? (
            <button
              aria-label="Cerrar modal"
              className="theme-outline-button inline-flex h-10 w-10 items-center justify-center rounded-full border transition"
              type="button"
              onClick={onClose}
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : null}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
