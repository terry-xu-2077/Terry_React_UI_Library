import type { CSSProperties, ReactNode } from "react";

export type AccentTone = "accent" | "blue" | "red" | "purple" | "neutral";

export type EntityHeaderProps = {
  tone?: AccentTone;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  watermark?: string;
  pinned?: boolean;
  onPin?: () => void;
  className?: string;
  style?: CSSProperties;
};

export function EntityHeader({ tone = "accent", icon, title, subtitle, watermark, pinned = false, onPin, className = "", style }: EntityHeaderProps) {
  return <header className={`tc-entity-header tone-${tone} ${className}`.trim()} style={style}><div className="tc-entity-watermark">{watermark ?? title}</div><div className="tc-entity-icon">{icon ?? <span>?</span>}</div><div className="tc-entity-title"><strong>{title}</strong>{subtitle && <span>{subtitle}</span>}</div>{onPin && <button className={`tc-pin ${pinned ? "is-pinned" : ""}`} type="button" onClick={onPin} aria-label="固定"><span>📌</span></button>}</header>;
}
