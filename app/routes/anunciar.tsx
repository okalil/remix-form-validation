import {
  ActionFunction,
  LinksFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { FormEventHandler, FocusEventHandler } from 'react';
import { useEffect, useState } from 'react';

import { Checkbox } from '~/components/Checkbox';
import { Fieldset } from '~/components/Fieldset';
import { Input } from '~/components/Input';
import { Radio } from '~/components/Radio';
import { Select } from '~/components/Select';
import { Textarea } from '~/components/Textarea';
import {
  type AnnounceForm,
  validationSchema,
  getErrorsMessages,
} from '~/services/validation';

import styles from '~/styles/anunciar.css';

export const meta: MetaFunction = () => ({
  title: 'Anunciar',
});

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export default function AnnounceFormExample() {
  const actionData = useActionData();
  const [errors, setErrors] = useState<AnnounceFormErrors>(actionData?.errors);

  // // Sync action errors with client state
  // useEffect(
  //   () => actionData?.errors && setErrors(actionData.errors),
  //   [actionData?.errors]
  // );

  const setErrorByName = (name: string, value: string) => {
    const prevError = errors?.[name];
    if (prevError !== value) setErrors(state => ({ ...state, [name]: value }));
  };

  const validate: FocusEventHandler<FormControl> = e => {
    const input = e.currentTarget;

    const name = input.name as keyof AnnounceForm;
    const parseResult = validationSchema.shape[name]?.safeParse(input.value);

    let message = '';
    if (!parseResult.success) {
      message = parseResult.error.issues[0].message;
    }
    setErrorByName(input.name, message);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    const form = e.currentTarget;
    const formData = new FormData(form);

    let values: Record<string, any> = {};
    for (let element of Array.from<any>(form)) {
      if (!element.name) continue;
      values[element.name] = formData.get(element.name);
    }
    const parseResult = validationSchema.safeParse(values);

    if (!parseResult.success) {
      const parseErrors = getErrorsMessages(parseResult);
      setErrors(parseErrors);

      e.preventDefault();
    }
  };

  return (
    <div>
      <Form
        method="post"
        encType="multipart/form-data"
        className="form"
        onSubmit={onSubmit}
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
            />
            <Radio
              name="condition"
              label="Usado"
              value="usado"
              defaultChecked={actionData?.values.condition === 'usado'}
            />
          </Fieldset>

          <input type="file" name="images" multiple />

          <Select
            name="state"
            label="Estado"
            error={errors?.state}
            onBlur={validate}
            defaultValue={actionData?.values.state}
          />
        </section>

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
            onBlur={validate}
            error={errors?.phone}
            defaultValue={actionData?.values.phone}
          />
          <Checkbox
            name="hide_phone"
            label="Ocultar telefone neste anúncio"
            defaultChecked={actionData?.values.hide_phone === 'on'}
          />
        </section>

        <button>Publicar</button>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async a => {
  const formData = await a.request.formData();

  const payload = Object.fromEntries(
    formData.entries()
  ) as Partial<AnnounceForm>;
  // payload.images = formData.getAll('images') as File[];

  const validated = validationSchema.safeParse(payload);

  if (!validated.success) {
    const errors = getErrorsMessages(validated);
    return { values: payload, errors };
  }

  return redirect('/sucesso');
};

type AnnounceFormErrors = { [K in keyof AnnounceForm]?: string } & {
  [key: string]: string;
};

type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;
