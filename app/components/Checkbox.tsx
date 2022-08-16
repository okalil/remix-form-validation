import { InputHTMLAttributes, useId } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Checkbox({ label, style, className, error, ...props }: Props) {
  const id = useId();

  let labelText = label;

  if (props.required) {
    labelText += ' *';
  }

  return (
    <div style={style} className={className}>
      <input
        {...props}
        id={id}
        className={`${error && 'error'}`}
        type="checkbox"
      />
      <label htmlFor={id}>{labelText}</label>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
