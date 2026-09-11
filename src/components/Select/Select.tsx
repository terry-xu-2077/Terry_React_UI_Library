import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { resolveOptionIconDescriptor } from "../../visual-icons";
import { ResetButton } from "../ResetButton";
import { Tooltip } from "../Tooltip";
import { measurePopupPlacement } from "../internal/popupPlacement";
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

function resolvedIcon(option: OptionItem) {
  if (option.icon) return option.icon;
  const descriptor = resolveOptionIconDescriptor(option.value);
  if (!descriptor) return null;
  if (descriptor.node) return descriptor.node;
  return <span className={`tc-resolved-option-icon ${descriptor.className || ""}`.trim()} style={descriptor.style}/>;
}

export function Select({ value, rawValue, options, onChange, tooltip, disabled, searchable = false, searchPlaceholder = "搜索" }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"down" | "up">("down");
  const [menuMaxHeight, setMenuMaxHeight] = useState(280);
  const close = () => { setOpen(false); setQuery(""); };
  const ref = useOutsideClose(open, close);
  const selected = options.find(option => option.value === value);
  const selectedIcon = selected ? resolvedIcon(selected) : null;
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
    const scroll = ref.current.querySelector<HTMLElement>(".tc-select-scroll");
    if (!host || !popup || !scroll) return;

    const popupRect = popup.getBoundingClientRect();
    const scrollRect = scroll.getBoundingClientRect();
    const chromeHeight = Math.max(0, popupRect.height - scrollRect.height);
    const desiredBodyHeight = Math.min(scroll.scrollHeight, 280);
    const desiredPopupHeight = chromeHeight + desiredBodyHeight;
    const measured = measurePopupPlacement(host, desiredPopupHeight, 8);
    const availableBodyHeight = Math.max(0, measured.available - chromeHeight);

    setPlacement(measured.placement);
    setMenuMaxHeight(Math.floor(Math.min(desiredBodyHeight, availableBodyHeight)));
  }, [open, filtered.length, searchable]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen(current => !current);
    setQuery("");
  };

  const popupStyle = { "--tc-pop-body-max-height": `${menuMaxHeight}px` } as CSSProperties;

  return <div className="tc-control-wrap" ref={ref}><Tooltip text={tooltip}><div className={`tc-control tc-select ${open ? "is-open" : ""} ${open && placement === "up" ? "opens-up" : ""}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={toggleOpen}><span className="tc-select-current">{selectedIcon && <span className="tc-option-icon">{selectedIcon}</span>}<span>{selected ? optionDisplayLabel(selected) : value}</span></span><ChevronDown size={20}/></button>{open && <div className="tc-pop tc-select-list tc-pop-in" style={popupStyle}>{searchable && <label className="tc-select-search"><Search size={14}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder}/></label>}<div className="tc-select-scroll">{filtered.map(option => { const icon = resolvedIcon(option); return <button type="button" key={option.value} className={`tc-select-item ${option.value === value ? "is-selected" : ""}`} onClick={() => { onChange(option.value); close(); }}>{icon && <span className="tc-option-icon">{icon}</span>}<span>{optionDisplayLabel(option)}</span>{option.group && <em>{option.group}</em>}</button>; })}{filtered.length === 0 && <div className="tc-select-empty">没有匹配项</div>}</div></div>}</div></Tooltip>{rawValue !== undefined && <ResetButton visible={changed} onClick={() => onChange(rawValue)}/>}</div>;
}
