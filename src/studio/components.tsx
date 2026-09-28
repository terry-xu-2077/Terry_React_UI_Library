import { useId, type CSSProperties, type ReactNode } from "react";
import { Film, FolderOpen } from "lucide-react";

export type StudioOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type StudioStatus = "idle" | "running" | "completed" | "failed" | "warning";

export function StudioDark({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tsd-studio-dark ${className}`.trim()}>{children}</div>;
}

export function ProjectFolderCard({
  title,
  description,
  coverUrl,
  date,
  meta = [],
  status = "idle",
  selected = false,
  onClick,
  className = "",
}: {
  title: string;
  description?: string;
  coverUrl?: string;
  date?: string;
  meta?: ReactNode[];
  status?: StudioStatus;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const clipId = `tsd-folder-${useId().replace(/:/g, "")}`;
  const style = { "--tsd-folder-clip": `url(#${clipId})` } as CSSProperties;
  return (
    <div className={`tsd-project-folder-item is-${status} ${selected ? "is-selected" : ""} ${className}`.trim()} style={style}>
      <svg width="0" height="0" aria-hidden="true" className="tsd-folder-clip-def">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M0 .15 Q0 0 .06 0 H.32 C.36 0 .36 .13 .42 .13 H.94 Q1 .13 1 .27 V.87 Q1 1 .94 1 H.06 Q0 1 0 .87 Z" />
          </clipPath>
        </defs>
      </svg>
      <button type="button" className={`tsd-project-folder-card ${coverUrl ? "has-cover" : "is-empty"}`} onClick={onClick}>
        {coverUrl ? (
          <>
            <div className="tsd-project-folder-sheet tsd-project-folder-paper" aria-hidden="true" />
            <div className="tsd-project-folder-sheet tsd-project-folder-paper-middle" aria-hidden="true" />
          </>
        ) : null}
        <div
          className="tsd-project-folder-sheet tsd-project-folder-cover"
          style={coverUrl ? { backgroundImage: `url("${coverUrl}")` } : undefined}
        >
          {!coverUrl ? <FolderOpen size={54} strokeWidth={1.3} aria-hidden="true" /> : null}
        </div>
        <div className="tsd-project-folder-front">
          <div className="tsd-project-folder-tab">
            <time>{date ?? ""}</time>
            <i aria-hidden="true" />
          </div>
          <h3>{title}</h3>
          <p>{description || "暂无项目简介"}</p>
          <footer>{meta.map((item, index) => <span key={index}>{item}</span>)}</footer>
        </div>
      </button>
    </div>
  );
}

export function TaskCard({
  title,
  summary,
  previewUrl,
  status = "idle",
  statusLabel,
  meta,
  footer,
  selected = false,
  onClick,
  className = "",
}: {
  title: string;
  summary?: string;
  previewUrl?: string;
  status?: StudioStatus;
  statusLabel?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`tsd-task-card is-${status} ${selected ? "is-selected" : ""} ${className}`.trim()}
      onClick={onClick}
    >
      <div className="tsd-task-card-preview">
        {previewUrl ? <img src={previewUrl} alt="" /> : <Film size={42} strokeWidth={1.3} aria-hidden="true" />}
        {statusLabel ? <span className="tsd-task-card-status"><i aria-hidden="true" />{statusLabel}</span> : null}
      </div>
      <div className="tsd-task-card-heading"><strong>{title}</strong>{meta ? <span>{meta}</span> : null}</div>
      <p>{summary || "暂无提示词内容"}</p>
      {footer ? <footer>{footer}</footer> : null}
    </button>
  );
}

export function PromptTag({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "info" | "success" | "warning" | "danger" | "section" | "camera" | "time" | "dialogue";
  className?: string;
}) {
  return <span className={`tsd-prompt-tag tone-${tone} ${className}`.trim()}>{children}</span>;
}

export function ParameterRow({
  label,
  hint,
  children,
  className = "",
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tsd-parameter-row ${className}`.trim()}>
      <div className="tsd-parameter-copy"><strong>{label}</strong>{hint ? <span>{hint}</span> : null}</div>
      <div className="tsd-parameter-control">{children}</div>
    </div>
  );
}

export function StudioSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  fluid = false,
  compact = false,
}: {
  value: T;
  options: readonly StudioOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  fluid?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`tsd-segmented ${fluid ? "is-fluid" : ""} ${compact ? "is-compact" : ""}`.trim()} role="group" aria-label={ariaLabel}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            type="button"
            key={option.value}
            className={`tsd-segmented-item ${active ? "is-active" : ""}`}
            aria-pressed={active}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
          >
            {option.icon ? <span className="tsd-control-icon" aria-hidden="true">{option.icon}</span> : null}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StudioSlidingTabs<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  fluid = false,
  compact = false,
}: {
  value: T;
  options: readonly StudioOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  fluid?: boolean;
  compact?: boolean;
}) {
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value));
  const style = {
    "--tsd-tab-count": String(Math.max(1, options.length)),
    "--tsd-tab-index": String(selectedIndex),
  } as CSSProperties;
  return (
    <div className={`tsd-sliding-tabs ${fluid ? "is-fluid" : ""} ${compact ? "is-compact" : ""}`.trim()} role="tablist" aria-label={ariaLabel} style={style}>
      <span className="tsd-sliding-track" aria-hidden="true" />
      <span className="tsd-sliding-indicator" aria-hidden="true" />
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            type="button"
            key={option.value}
            role="tab"
            className={`tsd-sliding-tab ${active ? "is-active" : ""}`}
            aria-selected={active}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
          >
            {option.icon ? <span className="tsd-control-icon" aria-hidden="true">{option.icon}</span> : null}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StudioSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}) {
  return (
    <select className="tsd-select" value={value} aria-label={ariaLabel} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}

export function StudioNumberField({
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  ariaLabel,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: ReactNode;
  onChange: (value: number) => void;
  ariaLabel?: string;
}) {
  return (
    <label className="tsd-number-field">
      <input type="number" value={value} min={min} max={max} step={step} aria-label={ariaLabel} onChange={event => onChange(Number(event.target.value))} />
      {suffix ? <span>{suffix}</span> : null}
    </label>
  );
}

export function StudioSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button type="button" className={`tsd-switch ${checked ? "is-on" : ""}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <span className="tsd-switch-knob" />
    </button>
  );
}
