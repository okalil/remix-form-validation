import { ActionFunction, LinksFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';

import { Input } from '~/components/Input';
import { Select } from '~/components/Select';
import styles from '~/styles/global.css';

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

interface FlightForm {
  name: string;
  email?: string;
  from: string;
  to: string;
  travelClass: string;
  date: string;
  journeyType: string;
}

type FlightFormErrors = { [K in keyof FlightForm]?: string };

export const action: ActionFunction = async a => {
  const formData = await a.request.formData();
  const errors: FlightFormErrors = {};

  const data = Object.fromEntries(formData);

  if (!data.name) errors.name = 'Nome é obrigatório';
  if (!data.from) errors.from = 'De é obrigatório';
  if (!data.to) errors.to = 'Para é obrigatório';

  if (Object.entries(errors).length) {
    return errors;
  }

  return {};
};

function getError(
  input: HTMLInputElement,
  map: { [K in keyof ValidityState]?: string }
): string {
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

export default function Index() {
  const actionErrors = useActionData<FlightFormErrors>();
  const [errorsState, setErrors] = useState<FlightFormErrors>({});
  const errors = actionErrors || errorsState;

  const setError = (name: string, value: string) => {
    if (errors[name as keyof FlightFormErrors] !== value)
      setErrors(state => ({ ...state, [name]: value }));
  };

  const validate = (e: any) => {
    const input = e.currentTarget as HTMLInputElement;
    console.log('VAL', input.validity, input.validationMessage);
    setError(
      input.name,
      getError(input, {
        valueMissing: 'Preencha este campo',
        tooShort:
          'Você não atingiu o número de caracteres mínimo requisitados.',
        tooLong: 'Você ultrapassou o número de caracteres máximo requisitados.',
      })
    );
  };

  return (
    <div>
      <Form method="post" className="form">
        <h1>Flights</h1>

        <div className="fields-container">
          <Input
            onBlur={validate}
            name="name"
            label="Nome"
            placeholder="Seu nome"
            // required
            // minLength={10}
            // maxLength={50}
            error={errors.name}
          />

          <Input
            onBlur={validate}
            name="email"
            label="E-mail"
            pattern=""
            placeholder="ex: seuemail@gmail.com"
            error={errors.email}
          />

          <div className="field-row">
            <Select
              name="from"
              label="De"
              className="field-row-item"
              required
              onBlur={validate}
            >
              <option value="au">Austrália</option>
              <option value="br">Brasil</option>
            </Select>
            <Select name="to" label="Para" className="field-row-item" required>
              <option value="us">Estados Unidos</option>
              <option value="uk">Reino Unido</option>
            </Select>
          </div>

          <Select name="travelClass" label="Classe" required>
            <option value="economy">Classe Econônmica</option>
            <option value="first">Primeira Classe</option>
          </Select>

          <div className="field-row">
            <Input
              type="date"
              max={'2002-08-13'}
              name="date"
              label="Data"
              className="field-row-item"
              required
              error={errors.date}
              onBlur={validate}
            />
            <Select
              name="journeyType"
              label="Tipo de jornada"
              className="field-row-item"
              required
            >
              <option value="one">Ida apenas</option>
              <option value="two">Ida e volta</option>
            </Select>
          </div>
        </div>

        <button>Enviar</button>
      </Form>
    </div>
  );
}
