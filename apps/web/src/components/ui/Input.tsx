import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className = "", ...props }: InputProps) => {
  return (
    <label className="theme-heading flex flex-col gap-2 text-sm font-medium">
      <span>{label}</span>
      <input
        className={`theme-input rounded-2xl border px-4 py-3 outline-none transition focus:border-teal ${className}`}
        {...props}
      />
    </label>
  );
};
