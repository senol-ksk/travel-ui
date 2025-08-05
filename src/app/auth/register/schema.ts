import { z } from '@/libs/zod'
import { phoneSchema } from '@/libs/util'

export const registerSchema = z
  .object({
    name: z.string().nonempty().min(3),
    surname: z.string().nonempty(),
    email: z.string().email(),
    phone: phoneSchema,
    password: z
      .string()
      .max(15)
      .min(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/, {
        message: 'En az 8 karakter, küçük, büyük harf ve rakam içermeli',
      }),
    passwordRepeat: z.string(),
    confirmAgreement: z.literal(true),
    confirmKVKK: z.literal(true),
  })
  .superRefine(({ password, passwordRepeat }, ctx) => {
    if (password !== passwordRepeat) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Şifre aynı değil.',
        path: ['passwordRepeat'],
      })
    }
  })

export type RegisterSchemaTypes = z.infer<typeof registerSchema>
