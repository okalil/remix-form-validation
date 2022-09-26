import { z } from 'zod';
import { useState } from 'react';
import type { FocusEvent, ChangeEvent, FormEventHandler } from 'react';
import { FormDataParser } from '~/services/validation';

export function useValidation<S extends z.ZodObject<any>>(
  parseFormData: FormDataParser<S>,
  initialErrors?: { [K in keyof z.infer<S>]?: string } & Record<string, string>
) {
  const [errors, setErrors] = useState(initialErrors);

  const setErrorByName = (name: string, value: string) => {
    const prevError = errors?.[name];

    if (prevError !== value)
      setErrors(state => ({ ...state, [name]: value } as typeof initialErrors));
  };

  type EntryElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;
  const validateInput = (
    e: FocusEvent<EntryElement> | ChangeEvent<EntryElement>
  ) => {
    const input = e.currentTarget;

    const formData = new FormData(input.form!);
    const parseResult = parseFormData(formData);

    let message = '';
    if (parseResult.errors && parseResult.errors[input.name]) {
      message = parseResult.errors[input.name];
    }
    setErrorByName(input.name, message);
  };

  const validateForm: FormEventHandler<HTMLFormElement> = e => {
    const form = e.currentTarget;
    const formData = new FormData(form);

    const parseResult = parseFormData(formData);

    if (parseResult.errors) {
      // Prevent Submit And Set Errors
      e.preventDefault();
      setErrors(parseResult.errors);

      // Focus First Input With Error
      const [firstInputName] = Object.keys(parseResult.errors);
      let firstInput = form[firstInputName];

      if (firstInput instanceof HTMLElement) {
        firstInput.focus();
      }
    }
  };

  return { errors, validateInput, validateForm };
}
