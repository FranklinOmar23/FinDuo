import type { PropsWithChildren } from "react";

export const Badge = ({ children }: PropsWithChildren) => {
  return (
    <span className="inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
      {children}
    </span>
  );
};
