import { z } from 'zod';

/* REUSABLE VALIDATION FUNCTIONS */
type FormDataToRecord = (formData: FormData) => Record<string, unknown>;

export type FormDataParser<T extends z.ZodObject<any>> = (
  formData: FormData
) =>
  | { data: z.infer<T>; errors: undefined }
  | { data: Record<string, unknown>; errors: Record<string, string> };

function createFormParser<T extends z.ZodObject<any>>(
  schema: T,
  parse: FormDataToRecord
): FormDataParser<T> {
  return formData => {
    const data = parse(formData);
    const safeParse = schema.safeParse(data);

    if (safeParse.success) {
      return { data: safeParse.data };
    }

    return { data, errors: getFormErrors<z.infer<T>>(safeParse) };
  };
}

function getFormErrors<T extends Record<string, any>>(
  safeParse: z.SafeParseError<T>
) {
  type FormErrors = { [K in keyof T]?: string } & { [key: string]: string };

  const errors: Record<string, string> = {};

  return safeParse.error.issues.reduce((res, e) => {
    res[e.path[0]] = e.message;
    return res;
  }, errors) as FormErrors;
}

/* ANNOUNCE FORM */

export const announceFormSchema = z.object({
  title: z.string().min(1, { message: 'Preencha esse campo' }),
  description: z
    .string()
    .min(1, { message: 'Preencha esse campo' })
    .min(20, {
      message: 'Você não preencheu o mínimo de caracteres requisitados',
    })
    .max(200, {
      message: 'Você ultrapassou o número de caracteres máximo requisitados.',
    }),
  condition: z.enum(['novo', 'usado'], {
    errorMap: () => ({ message: 'Selecione uma das opções' }),
  }),
  images: z.array(z.instanceof(File), {
    errorMap: () => ({ message: 'Insira imagens válidas' }),
  }),
  state: z.string().min(1, { message: 'Preencha seu estado' }),
  city: z.string().min(1, { message: 'Preencha sua cidade' }),

  name: z.string().min(1, { message: 'Preencha seu nome' }),
  email: z.string().email({ message: 'Insira um email válido' }),
  phone: z.string().min(1, { message: 'Preencha seu telefone' }),
  hide_phone: z.boolean().nullable().optional(),
});

export const parseAnnounceForm = createFormParser(
  announceFormSchema,
  getAnnounceFromFormData
);

function getAnnounceFromFormData(formData: FormData) {
  let payload: Record<string, unknown> = Object.fromEntries(formData.entries());
  payload.hide_phone = payload.hide_phone === 'on';
  payload.images = formData.getAll('images[]').filter(Boolean);
  return payload;
}
