import type { CSSProperties, ReactNode } from "react";

export * from "./tileIcons";
export * from "./semanticIcons";
export * from "./simpleIcons";

export type VisualOptionIconDescriptor = {
  className?: string;
  style?: CSSProperties;
  node?: ReactNode;
};

export type VisualOptionIconResolver = (value: string) => VisualOptionIconDescriptor | undefined;

declare global {
  var __tcOptionIconResolver: VisualOptionIconResolver | undefined;
}

export function installOptionIconResolver(resolver: VisualOptionIconResolver | undefined) {
  globalThis.__tcOptionIconResolver = resolver;
}

export function resolveOptionIconDescriptor(value: string) {
  return globalThis.__tcOptionIconResolver?.(value);
}
