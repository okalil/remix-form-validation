import { FieldsetHTMLAttributes } from 'react';

interface Props extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string;
  error?: string;
}

export function Fieldset({ legend, error, ...props }: Props) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {props.children}
      {error && <span className="error-message">{error}</span>}
    </fieldset>
  );
}
