import type { PropsWithChildren } from "react";

interface CardProps {
  className?: string;
}

export const Card = ({ children, className = "" }: PropsWithChildren<CardProps>) => {
  return <section className={`panel p-5 ${className}`}>{children}</section>;
};
