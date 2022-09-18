import {
  ActionFunction,
  LinksFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { FormEventHandler, FocusEventHandler } from 'react';
import { useState } from 'react';

import { Checkbox } from '~/components/Checkbox';
import { Fieldset } from '~/components/Fieldset';
import { Input } from '~/components/Input';
import { Radio } from '~/components/Radio';
import { Select } from '~/components/Select';
import { Textarea } from '~/components/Textarea';
import type { AnnounceForm, AnnounceFormErrors } from '~/services/validation';
import {
  validationSchema,
  getAnnounceFormData,
  getAnnounceFormErrors,
} from '~/services/validation';
import { phoneMask } from '~/utils/masks';

import styles from '~/styles/anunciar.css';

export const meta: MetaFunction = () => ({
  title: 'Anunciar',
});

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export default function AnnounceFormExample() {
  const actionData = useActionData();
  const [errors, setErrors] = useState<AnnounceFormErrors>(actionData?.errors);

  const setErrorByName = (name: string, value: string) => {
    const prevError = errors?.[name];
    if (prevError !== value) setErrors(state => ({ ...state, [name]: value }));
  };

  const validate: FocusEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = e => {
    const input = e.currentTarget;

    const name = input.name as keyof AnnounceForm;
    const parseResult = validationSchema.shape[name]?.safeParse(input.value);

    let message = '';
    if (!parseResult.success) {
      message = parseResult.error.issues[0].message;
    }
    setErrorByName(input.name, message);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getAnnounceFormData(formData);

    const parseResult = validationSchema.safeParse(values);

    if (!parseResult.success) {
      // Prevent Submit And Set Errors
      e.preventDefault();
      const parseErrors = getAnnounceFormErrors(parseResult);
      setErrors(parseErrors);

      // Focus First Input With Error
      const [firstInputName] = Object.keys(parseErrors);
      const firstInput = form[firstInputName];

      if (firstInput instanceof HTMLElement) {
        firstInput.focus();
      }
    }
  };

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="form"
      onSubmit={handleSubmit}
    >
      <h1>Anunciar</h1>

      <section>
        <h2>Dados do produto</h2>
        <Input
          name="title"
          label="Título"
          error={errors?.title}
          onBlur={validate}
          defaultValue={actionData?.values.title}
        />
        <Textarea
          name="description"
          label="Descrição"
          error={errors?.description}
          onBlur={validate}
          defaultValue={actionData?.values.description}
        />

        <Fieldset legend="Condição" error={errors?.condition}>
          <Radio
            name="condition"
            label="Novo"
            value="novo"
            defaultChecked={actionData?.values.condition === 'novo'}
            onBlur={validate}
          />
          <Radio
            name="condition"
            label="Usado"
            value="usado"
            defaultChecked={actionData?.values.condition === 'usado'}
            onBlur={validate}
          />
        </Fieldset>

        <input type="file" name="images[]" id="upload" multiple />
        {errors?.images && <span>{errors.images}</span>}

        <Select
          name="state"
          label="Estado"
          error={errors?.state}
          onBlur={validate}
          defaultValue={actionData?.values.state}
        >
          <option value="to">Tocantins</option>
          <option value="sp">São Paulo</option>
        </Select>
      </section>

      <Input
        name="city"
        label="Cidade"
        error={errors?.city}
        onBlur={validate}
        defaultValue={actionData?.values.city}
      />

      <section>
        <h2>Dados para contato</h2>
        <Input
          name="name"
          label="Nome"
          error={errors?.name}
          onBlur={validate}
          defaultValue={actionData?.values.name}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          error={errors?.email}
          onBlur={validate}
          defaultValue={actionData?.values.email}
        />
        <Input
          name="phone"
          type="tel"
          label="Telefone"
          onChange={phoneMask.onChange}
          onBlur={validate}
          error={errors?.phone}
          defaultValue={
            actionData?.values.phone && phoneMask.mask(actionData.values.phone)
          }
        />
        <Checkbox
          name="hide_phone"
          label="Ocultar telefone neste anúncio"
          defaultChecked={actionData?.values.hide_phone == 'on'}
        />
      </section>

      <button type="submit">Publicar</button>
    </Form>
  );
}

export const action: ActionFunction = async a => {
  const formData = await a.request.formData();

  const payload = getAnnounceFormData(formData);

  const validated = validationSchema.safeParse(payload);

  if (!validated.success) {
    const errors = getAnnounceFormErrors(validated);
    return { values: payload, errors };
  }

  return redirect('/sucesso');
};
