import { object, SafeParseError, z } from 'zod';

function recursive(obj: any, path: (string | number)[]) {
  let count = 0;
  let source = obj;
  while (count < path.length) {
    source = source[path[count]];
    count++;
  }
}

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
  // images: z.array(z.instanceof(File)),
  // state: z.string(),
  // city: z.string(),

  name: z.string().refine(Boolean, { message: 'Preencha seu nome' }),
  email: z.string().email(),
  // phone: z.string(),
  hide_phone: z.boolean().optional(),
});

export type AnnounceForm = z.infer<typeof validationSchema>;

export function getErrorsMessages(safeParse: SafeParseError<AnnounceForm>) {
  const errors: AnnounceFormErrors = {};
  return safeParse.error.issues.reduce((res, e) => {
    res[e.path[0]] = e.message;
    return res;
  }, errors);
}

export type AnnounceFormErrors = { [K in keyof AnnounceForm]?: string } & {
  [key: string]: string;
};
