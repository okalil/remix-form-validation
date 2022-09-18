import { ChangeEvent } from 'react';
import IMask from 'imask';

type Masker = (params: {
  masked: IMask.AnyMasked | IMask.AnyMaskedOptions;
}) => {
  onChange: (e: any) => string;
  mask: (target: string) => string;
  unmask: (target: string) => string;
};

const masker: Masker = ({ masked }) => {
  const mask = IMask.createPipe(
    masked,
    IMask.PIPE_TYPE.UNMASKED,
    IMask.PIPE_TYPE.MASKED
  );

  const unmask = IMask.createPipe(
    masked,
    IMask.PIPE_TYPE.MASKED,
    IMask.PIPE_TYPE.UNMASKED
  );

  function onChange(e: ChangeEvent<any>) {
    const unmasked = unmask(e.target.value);
    const newValue = mask(unmasked);
    e.target.value = newValue;
    return newValue;
  }

  return { mask, unmask, onChange };
};

export const phoneMask = masker({
  masked: { mask: '(00) 00000-0000' },
});
