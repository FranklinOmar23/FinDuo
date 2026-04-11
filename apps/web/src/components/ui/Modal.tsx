import type { PropsWithChildren } from "react";

interface ModalProps {
  open: boolean;
  title: string;
}

export const Modal = ({ children, open, title }: PropsWithChildren<ModalProps>) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4">
      <div className="panel w-full max-w-md rounded-[28px] p-5">
        <h3 className="font-display text-xl text-pine">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
