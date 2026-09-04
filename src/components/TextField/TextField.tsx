import { ResetButton } from "../ResetButton";
import { Tooltip } from "../Tooltip";

export type TextFieldProps = {
  value: string;
  rawValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
};

export function TextField({ value, rawValue, onChange, placeholder, tooltip, disabled }: TextFieldProps) {
  const changed = rawValue !== undefined && value !== rawValue;
  return <div className="tc-control-wrap"><Tooltip text={tooltip}><div className="tc-control tc-text"><input value={value} disabled={disabled} placeholder={placeholder} onChange={event => onChange(event.target.value)}/></div></Tooltip>{rawValue !== undefined && <ResetButton visible={changed} onClick={() => onChange(rawValue)}/>}</div>;
}
