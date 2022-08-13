import { InputHTMLAttributes, useId } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, style, className, error, ...props }: Props) {
  const id = useId();

  let labelText = label;

  if (props.required) {
    labelText += ' *';
  }

  return (
    <div style={style} className={className}>
      <label htmlFor={id} className="label">
        {labelText}
      </label>
      <input {...props} id={id} className={`field ${error && 'error'}`} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
