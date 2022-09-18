import { SafeParseError, z } from 'zod';

export const validationSchema = z.object({
  title: z.string().refine(Boolean, { message: 'Preencha esse campo' }),
  description: z
    .string()
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
  state: z.string().refine(Boolean, { message: 'Preencha seu estado' }),
  city: z.string().refine(Boolean, { message: 'Preencha sua cidade' }),

  name: z.string().refine(Boolean, { message: 'Preencha seu nome' }),
  email: z.string().email({ message: 'Insira um email válido' }),
  phone: z.string().refine(Boolean, { message: 'Preencha seu telefone' }),
  hide_phone: z.boolean().nullable().optional(),
});

export type AnnounceForm = z.infer<typeof validationSchema>;

export function getAnnounceFormData(formData: FormData) {
  let payload: Record<string, unknown> = Object.fromEntries(formData.entries());
  payload.hide_phone = payload.hide_phone === 'on';
  payload.images = formData.getAll('images[]').filter(Boolean) as File[];
  return payload;
}

export type AnnounceFormErrors = { [K in keyof AnnounceForm]?: string } & {
  [key: string]: string;
};

export function getAnnounceFormErrors(safeParse: SafeParseError<AnnounceForm>) {
  const errors: AnnounceFormErrors = {};
  return safeParse.error.issues.reduce((res, e) => {
    res[e.path[0]] = e.message;
    return res;
  }, errors);
}
