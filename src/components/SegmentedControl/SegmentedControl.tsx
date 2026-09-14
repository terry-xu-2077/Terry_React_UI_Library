import type { ReactNode } from "react";

export type SegmentedControlOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps<T extends string = string> = {
  value: T;
  options: readonly SegmentedControlOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  disabled?: boolean;
  fluid?: boolean;
  compact?: boolean;
  className?: string;
};

/**
 * Compact grouped labels for mutually-exclusive choices.
 *
 * Visual contract:
 * - Two or more labels read as one grouped control.
 * - Adjacent edges stay square; only the outer left/right edges are rounded.
 * - The active label uses the shared Terry accent treatment.
 * - Products own placement/width, not the internal geometry.
 */
export function SegmentedControl<T extends string = string>({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  fluid = false,
  compact = false,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`tc-segmented ${fluid ? "is-fluid" : ""} ${compact ? "is-compact" : ""} ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const itemDisabled = disabled || option.disabled === true;
        return (
          <button
            key={option.value}
            type="button"
            className={`tc-segmented-item ${selected ? "is-active" : ""}`}
            aria-pressed={selected}
            disabled={itemDisabled}
            onClick={() => onChange(option.value)}
          >
            {option.icon ? <span className="tc-segmented-icon" aria-hidden="true">{option.icon}</span> : null}
            <span className="tc-segmented-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
