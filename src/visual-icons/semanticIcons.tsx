import type { ReactNode } from "react";
import {
  Bomb,
  Box,
  Building2,
  Crosshair,
  Flag,
  Plane,
  Radio,
  Rocket,
  Sparkles,
  Truck,
  Users,
  Volume2,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type SemanticIconKind =
  | "generic"
  | "technology"
  | "people"
  | "power"
  | "factory"
  | "refinery"
  | "radar"
  | "flag"
  | "infantry"
  | "vehicle"
  | "aircraft"
  | "building"
  | "superweapon"
  | "weapon"
  | "warhead"
  | "projectile"
  | "audio"
  | "debris";

export type SemanticIconProps = {
  kind: SemanticIconKind;
  size?: number;
  className?: string;
  surface?: boolean;
  title?: string;
};

const ICONS: Record<SemanticIconKind, LucideIcon> = {
  generic: Box,
  technology: Sparkles,
  people: Users,
  power: Zap,
  factory: Building2,
  refinery: Building2,
  radar: Radio,
  flag: Flag,
  infantry: Users,
  vehicle: Truck,
  aircraft: Plane,
  building: Building2,
  superweapon: Sparkles,
  weapon: Crosshair,
  warhead: Bomb,
  projectile: Rocket,
  audio: Volume2,
  debris: Sparkles,
};

export function SemanticIcon({ kind, size = 15, className = "", surface = true, title }: SemanticIconProps) {
  const Icon = ICONS[kind] ?? ICONS.generic;
  return <span className={`tc-visual-semantic-icon ${surface ? "surface" : "bare"} ${className}`.trim()} title={title}>
    <Icon size={size} aria-hidden="true"/>
  </span>;
}

/** Factory form for consumers building option descriptors rather than JSX. */
export function createOpenIcon(kind: SemanticIconKind, size = 15, className = "", options: { surface?: boolean; title?: string } = {}): ReactNode {
  return <SemanticIcon kind={kind} size={size} className={className} surface={options.surface ?? true} title={options.title}/>;
}

export type OpenIconKind = SemanticIconKind;
