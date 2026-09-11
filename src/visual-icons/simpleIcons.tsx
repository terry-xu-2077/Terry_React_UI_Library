import type { ReactNode } from "react";
import { SemanticIcon, type SemanticIconKind } from "./semanticIcons";

export type SimpleIconProps = {
  text: string;
  kind?: SemanticIconKind;
  withElement?: boolean;
  className?: string;
  title?: string;
};

export function SimpleIcon({ text, kind = "generic", withElement = false, className = "", title }: SimpleIconProps) {
  const clean = text.trim() || "?";
  return <span className={`tc-visual-simple-icon ${className}`.trim()} title={title ?? clean}>
    {withElement && <SemanticIcon kind={kind} size={11} surface={false} className="tc-visual-simple-icon-element"/>}
    <span>{clean}</span>
  </span>;
}

/** Factory form for option descriptors and non-JSX registries. */
export function createSimpleIcon(text: string, options: Omit<SimpleIconProps, "text"> = {}): ReactNode {
  return <SimpleIcon text={text} {...options}/>;
}
