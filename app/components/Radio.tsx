import { InputHTMLAttributes, useId } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Radio({ label, style, className, ...props }: Props) {
  const id = useId();

  return (
    <div style={style} className={className}>
      <input {...props} id={id} type="radio" />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
