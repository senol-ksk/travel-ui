import { z } from '@/libs/zod'

export const passwordRenewSchema = z
  .object({
    password: z
      .string()
      .max(15)
      .min(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/, {
        message: 'En az 8 karakter, küçük, büyük harf ve rakam içermeli',
      }),
    repeatPassword: z.string(),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Şifre aynı değil.',
        path: ['passwordRepeat'],
      })
    }
  })

export type PasswordRenewSchemaTypes = z.infer<typeof passwordRenewSchema>
