import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { ResetButton } from "../ResetButton";

export type VisualOptionItem = { value: string; label?: string; group?: string; icon?: ReactNode };
export type MultiSelectMode = "menu" | "confirm";
export type VisualMultiSelectMode = MultiSelectMode;
export type VisualOptionIconDescriptor = { className?: string; style?: CSSProperties };
export type MultiSelectProps = {
  values: string[];
  rawValues?: string[];
  options: VisualOptionItem[];
  onChange: (values: string[]) => void;
  title?: string;
  disabled?: boolean;
  mode?: MultiSelectMode;
  confirmLabel?: string;
  closeLabel?: string;
};
export type VisualMultiSelectProps = MultiSelectProps;

declare global {
  var __tcOptionIconResolver: undefined | ((value: string) => VisualOptionIconDescriptor | undefined);
}

function displayLabel(option: VisualOptionItem) {
  const label = option.label?.trim();
  if (!label) return option.value;
  const suffix = ` · ${option.value}`;
  return label.endsWith(suffix) ? label.slice(0, -suffix.length).trim() || option.value : label;
}

function resolvedIcon(option: VisualOptionItem) {
  if (option.icon) return option.icon;
  const descriptor = globalThis.__tcOptionIconResolver?.(option.value);
  if (!descriptor) return null;
  return <span className={`tc-resolved-option-icon ${descriptor.className || ""}`.trim()} style={descriptor.style}/>;
}

export function MultiSelect({ values, rawValues, options, onChange, title = "选择项目", disabled, mode = "menu", confirmLabel = "确定", closeLabel = "关闭" }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(values);
  const ref = useRef<HTMLDivElement>(null);
  const isConfirm = mode === "confirm";
  const shownValues = isConfirm && open ? draft : values;
  const changed = rawValues !== undefined && rawValues.join(",") !== values.join(",");
  const labels = useMemo(() => shownValues.map(value => {
    const option = options.find(item => item.value === value);
    return option ? displayLabel(option) : value;
  }).join(", "), [shownValues, options]);

  useEffect(() => {
    if (!open || isConfirm) return;
    const closePicker = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, [open, isConfirm]);

  const openPicker = () => {
    if (disabled) return;
    if (!open && isConfirm) setDraft(values);
    setOpen(current => !current);
  };
  const toggle = (value: string) => {
    const current = isConfirm ? draft : values;
    const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    if (isConfirm) setDraft(next); else onChange(next);
  };
  const confirm = () => { onChange(draft); setOpen(false); };
  const close = () => { setDraft(values); setOpen(false); };

  return <div className="tc-control-wrap tc-visual-multi-wrap" ref={ref}><div className={`tc-control tc-multi tc-visual-multi ${open ? "is-open" : ""} mode-${mode}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={openPicker}><span>{labels || "未选择"}</span><ChevronDown size={20}/></button>{open && <div className="tc-pop tc-picker tc-pop-in tc-visual-picker"><div className="tc-picker-title">{title}</div><div className="tc-picker-body tc-visual-picker-body">{options.map(option => {
    const checked = shownValues.includes(option.value);
    const icon = resolvedIcon(option);
    return <label className={`tc-check-row tc-visual-check-row ${icon ? "has-icon" : ""}`} key={option.value}><input type="checkbox" value={option.value} checked={checked} onChange={() => toggle(option.value)}/><span className="tc-check-box">{checked && <Check size={13}/>}</span>{icon && <span className="tc-option-icon">{icon}</span>}<span className="tc-option-label">{displayLabel(option)}</span>{option.group && <em>{option.group}</em>}</label>;
  })}</div>{isConfirm && <div className="tc-picker-actions"><button type="button" onClick={confirm}><Check size={15}/>{confirmLabel}</button><button type="button" onClick={close}><X size={15}/>{closeLabel}</button></div>}</div>}</div>{rawValues && <ResetButton visible={changed} onClick={() => onChange(rawValues)}/>}</div>;
}

export const VisualMultiSelect = MultiSelect;
