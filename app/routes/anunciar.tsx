import {
  ActionFunction,
  LinksFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useRef, useEffect } from 'react';

import { Checkbox } from '~/components/Checkbox';
import { Fieldset } from '~/components/Fieldset';
import { Input } from '~/components/Input';
import { Radio } from '~/components/Radio';
import { Select } from '~/components/Select';
import { Textarea } from '~/components/Textarea';

import { useFilesState } from '~/hooks/useFilesState';
import { useErrors } from '~/hooks/useErrors';
import { announceFormSchema, parseAnnounceForm } from '~/services/validation';
import { phoneMask } from '~/utils/masks';

import styles from '~/styles/anunciar.css';

export const meta: MetaFunction = () => ({
  title: 'Anunciar',
});

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export default function AnnounceFormExample() {
  const actionData = useActionData();

  const { errors, validateInput, validateForm } = useErrors(
    announceFormSchema,
    actionData?.errors
  );

  const { files, appendFiles, deleteFile } = useFilesState();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    /* append controlled files to form data */
    formRef.current!.onformdata = e => {
      e.formData.delete('images[]');
      files.forEach(file => e.formData.append('images[]', file));
    };
  });

  const handleSubmit = validateForm(parseAnnounceForm);

  return (
    <Form
      ref={formRef}
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="form"
    >
      <h1>Anunciar</h1>

      <section>
        <h2>Dados do produto</h2>
        <Input
          name="title"
          label="Título"
          error={errors?.title}
          onBlur={validateInput}
          defaultValue={actionData?.values.title}
        />
        <Textarea
          name="description"
          label="Descrição"
          error={errors?.description}
          onBlur={validateInput}
          defaultValue={actionData?.values.description}
        />

        <Fieldset legend="Condição" error={errors?.condition}>
          <Radio
            name="condition"
            label="Novo"
            value="novo"
            defaultChecked={actionData?.values.condition === 'novo'}
            onBlur={validateInput}
          />
          <Radio
            name="condition"
            label="Usado"
            value="usado"
            defaultChecked={actionData?.values.condition === 'usado'}
            onBlur={validateInput}
          />
        </Fieldset>

        {Boolean(files.length) && (
          <ul>
            {files.map(file => (
              <li>
                <img src={URL.createObjectURL(file)} style={{ height: 40 }} />
                <button type="button" onClick={() => deleteFile(file.id)}>
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          name="images[]"
          id="upload"
          multiple
          onChange={e => appendFiles(e.target.files)}
        />
        {errors?.images && <span>{errors.images}</span>}

        <Select
          name="state"
          label="Estado"
          error={errors?.state}
          onBlur={validateInput}
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
        onBlur={validateInput}
        defaultValue={actionData?.values.city}
      />

      <section>
        <h2>Dados para contato</h2>
        <Input
          name="name"
          label="Nome"
          error={errors?.name}
          onBlur={validateInput}
          defaultValue={actionData?.values.name}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          error={errors?.email}
          onBlur={validateInput}
          defaultValue={actionData?.values.email}
        />
        <Input
          name="phone"
          type="tel"
          label="Telefone"
          onChange={phoneMask.onChange}
          onBlur={validateInput}
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

  const { data, errors } = parseAnnounceForm(formData);

  if (errors) {
    return { values: data, errors };
  }

  // DO SOMETHING WITH DATA

  return redirect('/sucesso');
};
