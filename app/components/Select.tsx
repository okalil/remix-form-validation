import { SelectHTMLAttributes, useId } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function Select({ label, style, className, error, ...props }: Props) {
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
      <select {...props} id={id} className="field" />
      {error && <span>{error}</span>}
    </div>
  );
}
