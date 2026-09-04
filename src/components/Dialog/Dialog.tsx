import type { ReactNode } from "react";
import { X } from "lucide-react";

export type DialogSize = "default" | "wide";

export type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: DialogSize;
};

export function Dialog({ open, title, children, onClose, size = "default" }: DialogProps) {
  if (!open) return null;
  return <div className="tc-dialog-layer" onMouseDown={event => { if (event.currentTarget === event.target) onClose(); }}><section className={`tc-dialog tc-dialog-in size-${size}`} role="dialog" aria-modal="true"><header><strong>{title}</strong><button type="button" onClick={onClose}><X size={18}/></button></header><div className="tc-dialog-body">{children}</div></section></div>;
}
