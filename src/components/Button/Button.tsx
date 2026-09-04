import type { PropsWithChildren } from "react";

export type ButtonVariant = "default" | "accent";

export type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
}>;

export function Button({ children, onClick, disabled = false, className = "", variant = "default" }: ButtonProps) {
  return <button type="button" className={`tc-button variant-${variant} ${className}`.trim()} disabled={disabled} onClick={onClick}>{children}</button>;
}
