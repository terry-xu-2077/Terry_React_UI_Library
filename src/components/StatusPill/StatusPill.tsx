import type { PropsWithChildren } from "react";

export type StatusPillTone = "normal" | "active" | "warning" | "danger";
export type StatusPillProps = PropsWithChildren<{ tone?: StatusPillTone }>;

export function StatusPill({ children, tone = "normal" }: StatusPillProps) {
  return <span className={`tc-status-pill tone-${tone}`}>{children}</span>;
}
