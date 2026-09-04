import type { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}>;

export function Button({ children, onClick, disabled = false, className = "" }: ButtonProps) {
  return <button type="button" className={`tc-button ${className}`} disabled={disabled} onClick={onClick}>{children}</button>;
}
