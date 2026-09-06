import type { ReactNode } from "react";
import { useLayoutEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { ResetButton } from "../ResetButton";
import { Tooltip } from "../Tooltip";
import { useOutsideClose } from "../internal/useOutsideClose";

export type OptionItem = { value: string; label?: string; group?: string; icon?: ReactNode };

export type SelectProps = {
  value: string;
  rawValue?: string;
  options: OptionItem[];
  onChange: (value: string) => void;
  tooltip?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function optionDisplayLabel(option: OptionItem) {
  const label = option.label?.trim();
  if (!label) return option.value;
  const suffix = ` · ${option.value}`;
  return label.endsWith(suffix) ? label.slice(0, -suffix.length).trim() || option.value : label;
}

export function Select({ value, rawValue, options, onChange, tooltip, disabled, searchable = false, searchPlaceholder = "搜索" }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"down" | "up">("down");
  const close = () => { setOpen(false); setQuery(""); };
  const ref = useOutsideClose(open, close);
  const selected = options.find(option => option.value === value);
  const changed = rawValue !== undefined && value !== rawValue;
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(option => `${optionDisplayLabel(option)} ${option.value} ${option.group || ""}`.toLowerCase().includes(normalized));
  }, [options, query]);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const host = ref.current.querySelector<HTMLElement>(".tc-select");
    const popup = ref.current.querySelector<HTMLElement>(".tc-select-list");
    if (!host || !popup) return;
    const rect = host.getBoundingClientRect();
    const popupHeight = Math.min(popup.scrollHeight, popup.getBoundingClientRect().height || 320);
    const gap = 8;
    const below = window.innerHeight - rect.bottom - gap;
    const above = rect.top - gap;
    setPlacement(below < popupHeight && above > below ? "up" : "down");
  }, [open, filtered.length, searchable]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen(current => !current);
    setQuery("");
  };

  return <div className="tc-control-wrap" ref={ref}><Tooltip text={tooltip}><div className={`tc-control tc-select ${open ? "is-open" : ""} ${open && placement === "up" ? "opens-up" : ""}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={toggleOpen}><span className="tc-select-current">{selected?.icon && <span className="tc-option-icon">{selected.icon}</span>}<span>{selected ? optionDisplayLabel(selected) : value}</span></span><ChevronDown size={20}/></button>{open && <div className="tc-pop tc-select-list tc-pop-in">{searchable && <label className="tc-select-search"><Search size={14}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder}/></label>}<div className="tc-select-scroll">{filtered.map(option => <button type="button" key={option.value} className={`tc-select-item ${option.value === value ? "is-selected" : ""}`} onClick={() => { onChange(option.value); close(); }}>{option.icon && <span className="tc-option-icon">{option.icon}</span>}<span>{optionDisplayLabel(option)}</span>{option.group && <em>{option.group}</em>}</button>)}{filtered.length === 0 && <div className="tc-select-empty">没有匹配项</div>}</div></div>}</div></Tooltip>{rawValue !== undefined && <ResetButton visible={changed} onClick={() => onChange(rawValue)}/>}</div>;
}
