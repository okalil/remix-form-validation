import type {
  ActionFunction,
  LinksFunction,
  MetaFunction,
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

import styles from '~/styles/anunciar.css';

export const meta: MetaFunction = () => ({
  title: 'Anunciar',
});

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export const action: ActionFunction = async a => {
  const formData = await a.request.formData();
  const errors: AnnounceFormErrors = {};

  const data = Object.fromEntries(formData);

  if (!data.title) errors.title = 'Campo obrigatório';

  if (Object.values(errors).some(Boolean)) {
    return errors;
  }

  return {};
};

export default function AnnounceFormExample() {
  const actionErrors = useActionData<AnnounceFormErrors>();
  const [errors, setErrors] = useState<AnnounceFormErrors>(actionErrors || {});

  // Sync action errors with client state
  useEffect(() => actionErrors && setErrors(actionErrors), [actionErrors]);

  const setError = (name: string, value: string) => {
    const prevError = errors[name];
    if (prevError !== value) setErrors(state => ({ ...state, [name]: value }));
  };

  const validate: FocusEventHandler<FormControl> = e => {
    const input = e.currentTarget;
    const message = getErrorMessage(input, {
      tooShort: 'Você não atingiu o número de caracteres mínimo requisitados.',
      tooLong: 'Você ultrapassou o número de caracteres máximo requisitados.',
    });
    setError(input.name, message);
  };

  const validateAll = (inputs: FormControl[]) => {
    let messages: AnnounceFormErrors = {};
    inputs
      .filter(input => !input.checkValidity())
      .forEach((input, i) => {
        if (i === 0) input.focus();
        messages[input.name] = getErrorMessage(input, {
          tooShort:
            'Você não atingiu o número de caracteres mínimo requisitados.',
          tooLong:
            'Você ultrapassou o número de caracteres máximo requisitados.',
        });
      });
    setErrors(messages);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      validateAll(Array.from(form) as FormControl[]);
      e.preventDefault();
    }
  };

  return (
    <div>
      <Form method="post" className="form" onSubmit={onSubmit} noValidate>
        <h1>Anunciar</h1>

        <section>
          <h2>Dados do produto</h2>
          <Input
            name="title"
            label="Título"
            required
            error={errors.title}
            onBlur={validate}
          />
          <Textarea
            name="description"
            label="Descrição"
            minLength={20}
            maxLength={200}
            required
            error={errors.description}
            onBlur={validate}
          />

          <Fieldset legend="Condição" error={errors.condition}>
            <Radio name="condition" label="Novo" value="novo" required />
            <Radio name="condition" label="Usado" value="usado" />
          </Fieldset>

          <Select
            name="state"
            label="Estado"
            required
            error={errors.state}
            onBlur={validate}
          />
        </section>

        <section>
          <h2>Dados para contato</h2>
          <Input
            name="name"
            label="Nome"
            required
            error={errors.name}
            onBlur={validate}
          />
          <Input
            name="email"
            type="email"
            label="Email"
            required
            error={errors.email}
            onBlur={validate}
          />
          <Input
            name="phone"
            type="tel"
            label="Telefone"
            required
            error={errors.phone}
            onBlur={validate}
          />
          <Checkbox name="hide_phone" label="Ocultar telefone neste anúncio" />
        </section>

        <button>Publicar</button>
      </Form>
    </div>
  );
}

function getErrorMessage(input: FormControl, map: ValidityStateMap): string {
  const { validity, validationMessage } = input;
  let state = '';
  for (let key in validity) {
    if (validity[key as keyof ValidityState]) {
      state = key;
      break;
    }
  }
  return (state && map[state as keyof ValidityState]) || validationMessage;
}

interface AnnounceForm {
  title: string;
  description: string;
  condition: 'novo' | 'usado';
  images: File[];
  state: string;
  city: string;

  name: string;
  email: string;
  phone: string;
  hide_phone: boolean;
}

type AnnounceFormErrors = { [K in keyof AnnounceForm]?: string } & {
  [key: string]: string;
};

type ValidityStateMap = { [K in keyof ValidityState]?: string };

type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;
