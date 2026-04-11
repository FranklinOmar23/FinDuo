import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endAdornment?: ReactNode;
}

export const Input = ({ label, className = "", endAdornment, ...props }: InputProps) => {
  return (
    <label className="theme-heading flex flex-col gap-2 text-sm font-medium">
      <span>{label}</span>
      <div className="relative">
        <input
          className={`theme-input w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-teal ${endAdornment ? "pr-14" : ""} ${className}`}
          {...props}
        />
        {endAdornment ? <div className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</div> : null}
      </div>
    </label>
  );
};
