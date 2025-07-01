import cardValidation from 'card-validator'
import { z } from '@/libs/zod'

let cardCvvLength = 3

export const paymentValidationSchema = z.object({
  cardOwner: z.string().min(3).max(50),
  cardNumber: z
    .string()
    .optional()
    .refine((value) => {
      cardCvvLength = cardValidation.number(value).card?.code.size || 3

      return cardValidation.number(value).isValid
    }, 'Gecersiz Kart Numarası'),
  cardExpiredMonth: z.string(),
  cardExpiredYear: z.string(),
  cardCvv: z.string().refine((val) => {
    return val.length === cardCvvLength
  }),
  installment: z.string().default('1'),
})
export type CardValidationSchemaTypes = z.infer<typeof paymentValidationSchema>
