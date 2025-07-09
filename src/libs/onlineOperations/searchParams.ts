import { createLoader, parseAsString, type inferParserType } from 'nuqs/server'
import { z } from '@/libs/zod'

export const operationResultParams = {
  bookingCode: parseAsString,
  firstName: parseAsString,
  lastName: parseAsString,
  partialPaymentError: parseAsString,
}

export const operationResultFormSchema = z.object({
  firstName: z.string().min(3).nonempty(),
  lastName: z.string().min(3).nonempty(),
  bookingCode: z.string().nonempty().min(3),
})
export const loadOperationResultSearchParams = createLoader(
  operationResultParams
)

export type OperationResultFormSchemaType = z.infer<
  typeof operationResultFormSchema
>
export type OperationResultParamTypes = inferParserType<
  typeof operationResultParams
>

export const flightRefundParams = {
  bookingCode: parseAsString,
  surname: parseAsString,
}

export const loadFlightRefundParams = createLoader(flightRefundParams)
