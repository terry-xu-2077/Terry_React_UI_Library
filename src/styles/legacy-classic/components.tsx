import React, { CSSProperties, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, RotateCcw, X } from "lucide-react";
import "./theme.css";

export type OptionItem = { value: string; label?: string; group?: string };
export type AccentTone = "accent" | "blue" | "red" | "purple" | "neutral";

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
  const on = value.toLowerCase() === trueValue.toLowerCase();
  const changed = rawValue !== undefined && value !== rawValue;
  return <div className="tc-control-wrap"><button type="button" disabled={disabled} className={`tc-control tc-bool ${on ? "is-on" : ""}`} onClick={()=>onChange(on ? falseValue : trueValue)}><span className="tc-bool-knob">{on ? "ON 开" : "OFF 关"}</span></button>{rawValue !== undefined && <ResetButton visible={changed} onClick={()=>onChange(rawValue)}/>}</div>;
}

function useOutsideClose(open: boolean, close: ()=>void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{ if (!open) return; const fn=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))close()}; document.addEventListener("mousedown",fn); return()=>document.removeEventListener("mousedown",fn); },[open,close]);
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

export function MultiSelect({ values, rawValues, options, onChange, title="选择项目", disabled }: { values:string[]; rawValues?:string[]; options:OptionItem[]; onChange:(v:string[])=>void; title?:string; disabled?:boolean }) {
  const [open,setOpen]=useState(false); const ref=useOutsideClose(open,()=>setOpen(false)); const changed=rawValues!==undefined&&rawValues.join(",")!==values.join(","); const labels=useMemo(()=>values.map(v=>options.find(o=>o.value===v)?.label??v).join(", "),[values,options]); const toggle=(v:string)=>onChange(values.includes(v)?values.filter(x=>x!==v):[...values,v]);
  return <div className="tc-control-wrap" ref={ref}><div className={`tc-control tc-multi ${open?"is-open":""}`}><button disabled={disabled} type="button" className="tc-select-button" onClick={()=>setOpen(v=>!v)}><span>{labels||"未选择"}</span><ChevronDown size={20}/></button>{open&&<div className="tc-pop tc-picker tc-pop-in"><div className="tc-picker-title">{title}</div><div className="tc-picker-body">{options.map(o=><label className="tc-check-row" key={o.value}><input type="checkbox" checked={values.includes(o.value)} onChange={()=>toggle(o.value)}/><span className="tc-check-box">{values.includes(o.value)&&<Check size={13}/>}</span><span>{o.label??o.value}</span>{o.group&&<em>{o.group}</em>}</label>)}</div><div className="tc-picker-actions"><button type="button" onClick={()=>setOpen(false)}><Check size={15}/>确定</button><button type="button" onClick={()=>setOpen(false)}><X size={15}/>关闭</button></div></div>}</div>{rawValues&&<ResetButton visible={changed} onClick={()=>onChange(rawValues)}/>}</div>;
}

export type EntityHeaderProps={tone?:AccentTone;icon?:ReactNode;title:string;subtitle?:string;watermark?:string;pinned?:boolean;onPin?:()=>void;className?:string;style?:CSSProperties};
export function EntityHeader({tone="accent",icon,title,subtitle,watermark,pinned=false,onPin,className="",style}:EntityHeaderProps){return <header className={`tc-entity-header tone-${tone} ${className}`.trim()} style={style}><div className="tc-entity-watermark">{watermark??title}</div><div className="tc-entity-icon">{icon??<span>?</span>}</div><div className="tc-entity-title"><strong>{title}</strong>{subtitle&&<span>{subtitle}</span>}</div>{onPin&&<button className={`tc-pin ${pinned?"is-pinned":""}`} type="button" onClick={onPin} aria-label="固定"><span>📌</span></button>}</header>}

export function PropertyRow({label,description,changed,children,onCopy}:{label:string;description?:string;changed?:boolean;children:ReactNode;onCopy?:()=>void}){const rowId=useId();return <div id={rowId} className={`tc-property-row ${changed?"is-changed":""}`}><div className="tc-property-label">{onCopy&&<button type="button" className="tc-copy" onClick={onCopy}>↩</button>}<div><strong>{label}</strong>{description&&<span>{description}</span>}</div></div><div className="tc-property-value">{children}</div>{changed&&<span className="tc-changed">已修改</span>}</div>}

export function Dialog({open,title,children,onClose}:{open:boolean;title:string;children:ReactNode;onClose:()=>void}){if(!open)return null;return <div className="tc-dialog-layer" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><section className="tc-dialog tc-dialog-in" role="dialog" aria-modal="true"><header><strong>{title}</strong><button type="button" onClick={onClose}><X size={18}/></button></header><div className="tc-dialog-body">{children}</div></section></div>}
export function Button({children,onClick,disabled=false,className=""}:React.PropsWithChildren<{onClick?:()=>void;disabled?:boolean;className?:string}>){return <button type="button" className={`tc-button ${className}`} disabled={disabled} onClick={onClick}>{children}</button>}
export function StatusPill({children,tone="normal"}:React.PropsWithChildren<{tone?:"normal"|"active"|"warning"|"danger"}>){return <span className={`tc-status-pill tone-${tone}`}>{children}</span>}
