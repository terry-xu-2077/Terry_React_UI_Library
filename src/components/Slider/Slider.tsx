import { ResetButton } from "../ResetButton";

export type SliderProps = {
  value: number;
  rawValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function Slider({ value, rawValue, min = 0, max = 100, step = 1, onChange, disabled }: SliderProps) {
  const changed = rawValue !== undefined && value !== rawValue;
  return <div className="tc-control-wrap"><div className="tc-control tc-slider"><input className="tc-range" disabled={disabled} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))}/><input className="tc-number" disabled={disabled} type="number" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))}/></div>{rawValue !== undefined && <ResetButton visible={changed} onClick={() => onChange(rawValue)}/>}</div>;
}
