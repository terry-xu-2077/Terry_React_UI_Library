import { Check } from "lucide-react";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  className?: string;
};

export function Checkbox({ checked, onChange, disabled = false, title, ariaLabel, className = "" }: CheckboxProps) {
  return <label className={`tc-checkbox ${className}`.trim()} title={title}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={event => onChange(event.target.checked)}
    />
    <span className="tc-check-box" aria-hidden="true">{checked && <Check size={13}/>}</span>
  </label>;
}
