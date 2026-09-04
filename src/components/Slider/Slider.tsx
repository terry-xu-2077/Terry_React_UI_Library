import { ResetButton } from "../ResetButton";

export type SliderProps = {
  value: number;
  rawValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /**
   * The slider track is an editing aid, not necessarily a hard validation range.
   * When enabled, the numeric input may contain values below `min` or above `max`.
   * The range thumb stays pinned to the nearest end while the numeric value remains exact.
   */
  allowOutOfRangeInput?: boolean;
};

function clampToTrack(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function Slider({
  value,
  rawValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled,
  allowOutOfRangeInput = false,
}: SliderProps) {
  const changed = rawValue !== undefined && value !== rawValue;
  const trackValue = Number.isFinite(value) ? clampToTrack(value, min, max) : min;

  return <div className="tc-control-wrap"><div className="tc-control tc-slider"><input className="tc-range" disabled={disabled} type="range" min={min} max={max} step={step} value={trackValue} onChange={event => onChange(Number(event.target.value))}/><input className="tc-number" disabled={disabled} type="number" min={allowOutOfRangeInput ? undefined : min} max={allowOutOfRangeInput ? undefined : max} step={step} value={value} onChange={event => onChange(Number(event.target.value))}/></div>{rawValue !== undefined && <ResetButton visible={changed} onClick={() => onChange(rawValue)}/>}</div>;
}
