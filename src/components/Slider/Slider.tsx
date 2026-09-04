import { useEffect, useRef, useState } from "react";
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

// Keep the physical control responsive even when its consumer renders a large editor.
// Parent notifications are bounded to ~20 Hz while dragging, and pointer/key/blur commit
// the final value immediately. The numeric field and thumb themselves update locally on
// every native input event.
const EMIT_WINDOW_MS = 48;

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
  const [draftValue, setDraftValue] = useState(value);
  const latestValue = useRef(value);
  const lastEmittedValue = useRef(value);
  const emitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setDraftValue(value);
    latestValue.current = value;
    lastEmittedValue.current = value;
  }, [value]);

  useEffect(() => () => {
    if (emitTimer.current) clearTimeout(emitTimer.current);
  }, []);

  const emitLatest = () => {
    if (emitTimer.current) {
      clearTimeout(emitTimer.current);
      emitTimer.current = null;
    }
    const next = latestValue.current;
    if (Object.is(next, lastEmittedValue.current)) return;
    lastEmittedValue.current = next;
    onChangeRef.current(next);
  };

  const scheduleEmit = () => {
    if (emitTimer.current) return;
    emitTimer.current = setTimeout(() => {
      emitTimer.current = null;
      const next = latestValue.current;
      if (Object.is(next, lastEmittedValue.current)) return;
      lastEmittedValue.current = next;
      onChangeRef.current(next);
    }, EMIT_WINDOW_MS);
  };

  const updateDraft = (next: number) => {
    if (!Number.isFinite(next)) return;
    latestValue.current = next;
    setDraftValue(next);
    scheduleEmit();
  };

  const changed = rawValue !== undefined && draftValue !== rawValue;
  const trackValue = Number.isFinite(draftValue) ? clampToTrack(draftValue, min, max) : min;

  return <div className="tc-control-wrap" onPointerUp={emitLatest} onKeyUp={emitLatest} onBlur={emitLatest}>
    <div className="tc-control tc-slider">
      <input className="tc-range" disabled={disabled} type="range" min={min} max={max} step={step} value={trackValue} onChange={event => updateDraft(Number(event.target.value))}/>
      <input className="tc-number" disabled={disabled} type="number" min={allowOutOfRangeInput ? undefined : min} max={allowOutOfRangeInput ? undefined : max} step={step} value={draftValue} onChange={event => updateDraft(Number(event.target.value))}/>
    </div>
    {rawValue !== undefined && <ResetButton visible={changed} onClick={() => updateDraft(rawValue)}/>} 
  </div>;
}
