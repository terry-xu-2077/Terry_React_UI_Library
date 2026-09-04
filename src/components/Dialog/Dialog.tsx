import type { ReactNode } from "react";
import { X } from "lucide-react";

export type DialogSize = "default" | "wide";

export type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: DialogSize;
  icon?: ReactNode;
  closeOnBackdrop?: boolean;
};

export function Dialog({ open, title, children, onClose, size = "default", icon, closeOnBackdrop = false }: DialogProps) {
  if (!open) return null;
  return <div className="tc-dialog-layer" onMouseDown={event => {
    if (closeOnBackdrop && event.currentTarget === event.target) onClose();
  }}>
    <section className={`tc-dialog tc-dialog-in size-${size}`} role="dialog" aria-modal="true" aria-label={title}>
      <header>
        <div className="tc-dialog-title">{icon && <span className="tc-dialog-title-icon" aria-hidden="true">{icon}</span>}<strong>{title}</strong></div>
        <button type="button" onClick={onClose} aria-label="关闭"><X size={18}/></button>
      </header>
      <div className="tc-dialog-body">{children}</div>
    </section>
  </div>;
}
