import { z } from 'zod';
import { useState } from 'react';
import type { FocusEvent, ChangeEvent, FormEventHandler } from 'react';

export function useErrors<S extends z.ZodObject<any>>(
  schema: S,
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
    const input = e.currentTarget!;

    const name = input.name as keyof z.infer<typeof schema>;
    const parseResult = schema.shape[name]?.safeParse(input.value);

    let message = '';
    if (!parseResult.success) {
      message = parseResult.error.issues[0].message;
    }
    setErrorByName(input.name, message);
  };

  const validateForm: (
    parser: (formData: FormData) => { data: any; errors?: any }
  ) => FormEventHandler<HTMLFormElement> = parser => e => {
    const form = e.currentTarget;
    const formData = new FormData(form);

    const parseResult = parser(formData);

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
