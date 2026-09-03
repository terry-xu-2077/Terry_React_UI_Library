import React, { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, RotateCcw, X } from "lucide-react";
import "./theme.css";
import "./theme-system.css";
import "./motion.css";
import "./slider.css";

export type OptionItem = { value: string; label?: string; group?: string };
export type AccentTone = "accent" | "blue" | "red" | "purple" | "neutral";
export type MultiSelectMode = "menu" | "confirm";
export type DialogSize = "default" | "wide";

export function Tooltip({ text, children }: { text?: string; children: ReactNode }) {
  if (!text) return <>{children}</>;
  return <span className="tc-tooltip-host">{children}<span className="tc-tooltip">{text}</span></span>;
}

export function ResetButton({ visible, onClick, label = "还原" }: { visible: boolean; onClick: () => void; label?: string }) {
  return <button type="button" className={`tc-reset ${visible ? "is-visible" : ""}`} onClick={onClick} aria-label={label}><RotateCcw size={16}/><span>{label}</span></button>;
}

export function TextField({ value, rawValue, onChange, placeholder, tooltip, disabled }: { value: string; rawValue?: string; onChange: (v: string) => void; placeholder?: string; tooltip?: string; disabled?: boolean }) {
  const changed = rawValue !== undefined && value !== rawValue;
  return <div className="tc-control-wrap"><Tooltip text={tooltip}><div className="tc-control tc-text"><input value={value} disabled={disabled} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/></div></Tooltip>{rawValue !== undefined && <ResetButton visible={changed} onClick={()=>onChange(rawValue)}/>}</div>;
}

export function BoolSwitch({ value, rawValue, onChange, trueValue = "yes", falseValue = "no", disabled }: { value: string; rawValue?: string; onChange:(v:string)=>void; trueValue?: string; falseValue?: string; disabled?:boolean }) {
  const dialectProbe = (value || rawValue || "").trim().toLowerCase();
  const usesLiteralBoolean = dialectProbe === "true" || dialectProbe === "false";
  const effectiveTrue = usesLiteralBoolean ? "true" : trueValue;
  const effectiveFalse = usesLiteralBoolean ? "false" : falseValue;
  const on = value.trim().toLowerCase() === effectiveTrue.toLowerCase();
  const changed = rawValue !== undefined && value !== rawValue;
  return <div className="tc-control-wrap"><button type="button" disabled={disabled} className={`tc-control tc-bool ${on ? "is-on" : ""}`} onClick={()=>onChange(on ? effectiveFalse : effectiveTrue)}><span className="tc-bool-knob">{on ? "ON 开" : "OFF 关"}</span></button>{rawValue !== undefined && <ResetButton visible={changed} onClick={()=>onChange(rawValue)}/>}</div>;
}

function useOutsideClose(open:boolean, close:()=>void, enabled=true) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ if(!open||!enabled)return; const fn=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))close()}; document.addEventListener("mousedown",fn); return()=>document.removeEventListener("mousedown",fn); },[open,close,enabled]);
  return ref;
}

export function Select({ value, rawValue, options, onChange, tooltip, disabled }: { value:string; rawValue?:string; options:OptionItem[]; onChange:(v:string)=>void; tooltip?:string; disabled?:boolean }) {
  const [open,setOpen]=useState(false); const ref=useOutsideClose(open,()=>setOpen(false)); const selected=options.find(o=>o.value===value); const changed=rawValue!==undefined&&value!==rawValue;
  return <div className="tc-control-wrap" ref={ref}><Tooltip text={tooltip}><div className={`tc-control tc-select ${open?"is-open":""}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={()=>setOpen(v=>!v)}><span>{selected?.label??value}</span><ChevronDown size={20}/></button>{open&&<div className="tc-pop tc-select-list tc-pop-in">{options.map(o=><button type="button" key={o.value} className="tc-select-item" onClick={()=>{onChange(o.value);setOpen(false)}}>{o.label??o.value}</button>)}</div>}</div></Tooltip>{rawValue!==undefined&&<ResetButton visible={changed} onClick={()=>onChange(rawValue)}/>}</div>;
}

export function Slider({ value, rawValue, min=0, max=100, step=1, onChange, disabled }: { value:number; rawValue?:number; min?:number; max?:number; step?:number; onChange:(v:number)=>void; disabled?:boolean }) {
  const changed=rawValue!==undefined&&value!==rawValue;
  return <div className="tc-control-wrap"><div className="tc-control tc-slider"><input className="tc-range" disabled={disabled} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/><input className="tc-number" disabled={disabled} type="number" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></div>{rawValue!==undefined&&<ResetButton visible={changed} onClick={()=>onChange(rawValue)}/>}</div>;
}

export type MultiSelectProps={values:string[];rawValues?:string[];options:OptionItem[];onChange:(v:string[])=>void;title?:string;disabled?:boolean;mode?:MultiSelectMode;confirmLabel?:string;closeLabel?:string};
export function MultiSelect({values,rawValues,options,onChange,title="选择项目",disabled,mode="menu",confirmLabel="确定",closeLabel="关闭"}:MultiSelectProps){
  const [open,setOpen]=useState(false);
  const [draft,setDraft]=useState<string[]>(values);
  const isConfirm=mode==="confirm";
  const shownValues=isConfirm&&open?draft:values;
  const ref=useOutsideClose(open,()=>setOpen(false),!isConfirm);
  const changed=rawValues!==undefined&&rawValues.join(",")!==values.join(",");
  const labels=useMemo(()=>shownValues.map(v=>options.find(o=>o.value===v)?.label??v).join(", "),[shownValues,options]);
  const openPicker=()=>{if(disabled)return; if(!open&&isConfirm)setDraft(values); setOpen(v=>!v)};
  const toggle=(v:string)=>{
    const current=isConfirm?draft:values;
    const next=current.includes(v)?current.filter(x=>x!==v):[...current,v];
    if(isConfirm)setDraft(next); else onChange(next);
  };
  const confirm=()=>{onChange(draft);setOpen(false)};
  const close=()=>{setDraft(values);setOpen(false)};
  return <div className="tc-control-wrap" ref={ref}><div className={`tc-control tc-multi ${open?"is-open":""} mode-${mode}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={openPicker}><span>{labels||"未选择"}</span><ChevronDown size={20}/></button>{open&&<div className="tc-pop tc-picker tc-pop-in"><div className="tc-picker-title">{title}</div><div className="tc-picker-body">{options.map(o=>{const checked=shownValues.includes(o.value);return <label className="tc-check-row" key={o.value}><input type="checkbox" checked={checked} onChange={()=>toggle(o.value)}/><span className="tc-check-box">{checked&&<Check size={13}/>}</span><span>{o.label??o.value}</span>{o.group&&<em>{o.group}</em>}</label>})}</div>{isConfirm&&<div className="tc-picker-actions"><button type="button" onClick={confirm}><Check size={15}/>{confirmLabel}</button><button type="button" onClick={close}><X size={15}/>{closeLabel}</button></div>}</div>}</div>{rawValues&&<ResetButton visible={changed} onClick={()=>onChange(rawValues)}/>}</div>;
}

export type EntityHeaderProps={tone?:AccentTone;icon?:ReactNode;title:string;subtitle?:string;watermark?:string;pinned?:boolean;onPin?:()=>void;className?:string;style?:CSSProperties};
export function EntityHeader({tone="accent",icon,title,subtitle,watermark,pinned=false,onPin,className="",style}:EntityHeaderProps){return <header className={`tc-entity-header tone-${tone} ${className}`.trim()} style={style}><div className="tc-entity-watermark">{watermark??title}</div><div className="tc-entity-icon">{icon??<span>?</span>}</div><div className="tc-entity-title"><strong>{title}</strong>{subtitle&&<span>{subtitle}</span>}</div>{onPin&&<button className={`tc-pin ${pinned?"is-pinned":""}`} type="button" onClick={onPin} aria-label="固定"><span>📌</span></button>}</header>}

export function Dialog({open,title,children,onClose,size="default"}:{open:boolean;title:string;children:ReactNode;onClose:()=>void;size?:DialogSize}){if(!open)return null;return <div className="tc-dialog-layer" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><section className={`tc-dialog tc-dialog-in size-${size}`} role="dialog" aria-modal="true"><header><strong>{title}</strong><button type="button" onClick={onClose}><X size={18}/></button></header><div className="tc-dialog-body">{children}</div></section></div>}
export function Button({children,onClick,disabled=false,className=""}:React.PropsWithChildren<{onClick?:()=>void;disabled?:boolean;className?:string}>){return <button type="button" className={`tc-button ${className}`} disabled={disabled} onClick={onClick}>{children}</button>}
export function StatusPill({children,tone="normal"}:React.PropsWithChildren<{tone?:"normal"|"active"|"warning"|"danger"}>){return <span className={`tc-status-pill tone-${tone}`}>{children}</span>}
