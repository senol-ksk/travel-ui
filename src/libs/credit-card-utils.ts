import cardValidation from 'card-validator'
import { z } from '@/libs/zod'

let cardCvvLength = 3

export const creditCardSchema = z.object({
  cardOwner: z.string().min(3).max(50),
  cardNumber: z
    .string()
    .optional()
    .refine((value) => {
      cardCvvLength = cardValidation.number(value).card?.code.size || 3

      return cardValidation.number(value).isValid
    }, 'Gecersiz Kart Numarası'),
  cardExpiredMonth: z.string().nonempty(),
  cardExpiredYear: z.string().nonempty(),
  cardCvv: z.string().refine((val) => {
    return val.length === cardCvvLength && typeof Number(val) === 'number'
  }),
})

export const paymentValidationSchema = creditCardSchema.merge(
  z.object({
    installment: z.number().default(1),
  })
)

export type PaymentValidationSchemaTypes = z.infer<
  typeof paymentValidationSchema
>
export type CreditCardSchemaType = z.infer<typeof creditCardSchema>
