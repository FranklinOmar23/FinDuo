import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({ children, className = "", variant = "primary", ...props }: PropsWithChildren<ButtonProps>) => {
  const variants = {
    primary: "bg-teal text-white hover:bg-pine",
    secondary: "bg-coral text-white hover:opacity-90",
    ghost: "bg-transparent theme-heading hover:bg-black/5 dark:hover:bg-white/5"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
