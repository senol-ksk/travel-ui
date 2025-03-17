import { z } from 'zod'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

import { isMobilePhone } from 'validator'

import { type PassengerValidationType } from '@/app/reservation/types'
import {
  AgeCalculationType,
  PassengerTypesEnum,
} from '@/types/passengerViewModel'
import { validTCKN } from '@/libs/tckn-validate'

import intlTelInput from 'intl-tel-input/react'

export type GeneralFormFieldSchemaTypes = {
  contactEmail: z.ZodString
  contactGSM: z.ZodEffects<z.ZodOptional<z.ZodString>>
  // moduleName: z.ZodString
  isInPromoList: z.ZodBoolean
  fillBillingInfosCheck: z.ZodBoolean
}

// let isPhoneNumberValid = false
// export const checkPhoneNumberIsValid = (value: boolean) => {
//   isPhoneNumberValid = value
// }
const baseDateSchema = z.string().date()

const passengerValidation = z.object({
  passengers: z.array(
    z
      .object<PassengerValidationType>({
        declaredAge: z.string().readonly(),
        // declaredAge: z.number().readonly(),
        checkinDate: z.string().readonly(),
        birthDate_day: z.string().min(1).max(2),
        birthDate_month: z.string().min(2).max(2),
        birthDate_year: z.string().min(4).max(4),
        birthDate: z.string().date(),
        calculationYearType: z.nativeEnum(AgeCalculationType).readonly(),
        citizenNo: z.string().optional(),
        firstName: z.string().min(3).max(50),
        gender: z.string().nonempty(),
        hesCode: z.string(),
        lastName: z.string().min(3).max(50),
        model_PassengerId: z.string().or(z.number()),
        nationality_Check: z.boolean().optional(),
        passengerId: z.string().or(z.number()),
        passengerKey: z.string(),
        passportCountry: z.string().optional(),
        passportNo: z.string().optional(),
        passportValidity_1: z.string().optional(),
        passportValidity_2: z.string().optional(),
        passportValidity_3: z.string().optional(),
        passportValidityDate: z.string().optional().nullable(),
        registeredPassengerId: z.string().or(z.number()),
        type: z.nativeEnum(PassengerTypesEnum).readonly(),
        moduleName: z.string().readonly(),
      })
      .superRefine((value, ctx) => {
        console.log(value, ctx)
        const moduleName = value.moduleName.toLowerCase()
        const passengerType = +value.type

        if (!value.nationality_Check && !validTCKN(value.citizenNo!)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['citizenNo'],
            message: 'Gecerli tc giriniz',
          })
        }
        const passportCountry = value.passportCountry!
        const passportNo = value.passportNo!
        const passportDate = value.passportValidityDate!
        if (value.nationality_Check) {
          if (passportCountry?.length < 2) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 2,
              inclusive: true,
              type: 'string',
              path: ['passportCountry'],
            })
          }
          if (passportNo.length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              path: ['passportNo'],
              minimum: 3,
              inclusive: true,
              type: 'string',
            })
          }
          if (!baseDateSchema.safeParse(passportDate).success) {
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_date,
              path: ['passportValidityDate'],
            })
          }
        }

        const birthDayVal = value.birthDate
        if (baseDateSchema.safeParse(birthDayVal).success) {
          const dayjsBirthDay = dayjs(
            birthDayVal,
            {
              utc: true,
            },
            true
          )
          const dayjsToday = dayjs()
          const dateDiff = dayjsToday.diff(dayjsBirthDay, 'day')
          const checkinDate = dayjs(value.checkinDate)
          const declaredAge = +value.declaredAge
          const adultMinBirthDate = dayjs(checkinDate).subtract(18, 'year')
          let minBirthDay
          let maxBirthDay
          if (moduleName === 'hotel' && passengerType === 1) {
            switch (value.calculationYearType) {
              case AgeCalculationType.YearBased:
                minBirthDay = dayjs(checkinDate).subtract(
                  declaredAge * 2 + 1 - declaredAge,
                  'year'
                )
                maxBirthDay = dayjs(minBirthDay).add(1, 'year')

                return (
                  dayjsBirthDay.isSameOrAfter(minBirthDay) &&
                  dayjsBirthDay.isBefore(maxBirthDay)
                )

              case AgeCalculationType.DayBased:
                minBirthDay = dayjs(checkinDate).subtract(
                  declaredAge * 2 + 1 - declaredAge,
                  'year'
                )
                maxBirthDay = dayjs(minBirthDay)
                  .add(1, 'year')
                  .subtract(1, 'day')

                if (
                  !(
                    dayjsBirthDay.isSameOrAfter(minBirthDay) &&
                    dayjsBirthDay.isSameOrBefore(maxBirthDay)
                  )
                ) {
                  {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: `${minBirthDay.format('DD-MM-YYYY')}-${maxBirthDay.format('DD-MM-YYYY')} tarihleri arasında olmalıdır.`,
                      path: ['birthDate'],
                    })
                  }
                }
                break

              case AgeCalculationType.DayOver:
                if (
                  dayjs(
                    checkinDate.millisecond() - dayjsBirthDay.millisecond()
                  ).day() +
                    1 !==
                  declaredAge
                ) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'bebek yasi hatali ',
                    path: ['birthDate'],
                  })
                }
                break
            }
          }

          switch (value.type) {
            case PassengerTypesEnum.Adult:
              if (dateDiff < 4380) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'yetiskin icin kucuk yas',
                  path: ['birthDate'],
                })
              }
              break
            case PassengerTypesEnum.Child:
              if (!(dateDiff >= 730 && dateDiff <= 4380)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'cocuk yasi hatali',
                  path: ['birthDate'],
                })
              }
              break
            case PassengerTypesEnum.Infant:
              if (!(dateDiff >= 0 && dateDiff < 730)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'bebek yasi hatali ',
                  path: ['birthDate'],
                })
              }
              break
            default:
              break
          }
        }

        return z.NEVER
      })
  ),
})

const phoneSchema = z
  .string()
  .optional()
  .refine((value) => isMobilePhone(value ?? ''))
// Define the individual billing schema with required fields
const billingIndividualSchema = z.object({
  billingInfoName: z.string().min(3).max(50),
  name: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  title: z.union([z.literal('Bay'), z.literal('Bayan')]),
  tcKimlikNo: z.string().refine((value) => validTCKN(value)),
  countryCode: z.string(),
  city: z.string().nonempty(),
  district: z.string().nonempty(),
  address: z.string().min(4).max(255),
  email: z.string().email(),
  mobilPhoneNumber: phoneSchema,
})
// Define the corporate billing schema with required fields
const billingCorporateSchema = z.object({
  billingInfoName: z.string().min(3).max(50),
  title: z.string().nonempty(),
  vergiDairesi: z.string().min(3).max(50),
  vergiNo: z.string().min(3).max(50),
  tcKimlikNo: z.string().refine((value) => validTCKN(value)),
  countryCode: z.string(),
  city: z.string().nonempty(),
  district: z.string().nonempty(),
  address: z.string().min(4).max(255),
  email: z.string().email(),
  phoneNumber: phoneSchema,
})

// General form schema
const generalFormSchema = z.object({
  contactEmail: z.string().email(),
  contactGSM: phoneSchema,
  // moduleName: z.string(),
  isInPromoList: z.boolean(),
  fillBillingInfosCheck: z.boolean(),
  invoiceType: z.union([z.literal('0'), z.literal('1')]).optional(),
  // individual is not optional anymore; we'll conditionally handle its validation
  billingIndiviual: z
    .unknown()
    .or(billingIndividualSchema.partial().optional()), // We'll handle the validation conditionally in .refine()
  billingCorporate: z.unknown().or(billingCorporateSchema.partial().optional()), // We'll handle the validation conditionally in .refine()
})

// Merging with passenger validation
const checkoutSchemaBeforeRefine = generalFormSchema.merge(passengerValidation)

// Refine the schema to enforce required fields in `individual` if `fillBillingInfosCheck` is true
export const checkoutSchemaMerged = checkoutSchemaBeforeRefine.superRefine(
  (data, ctx) => {
    // When fillBillingInfosCheck is true, `individual` should match `billingSchemaIndividual`
    if (data.fillBillingInfosCheck) {
      // Check if `individual` exists and validate it with billingSchemaIndividual
      // `0` means this is indivual billing type
      if (data.invoiceType === '0') {
        const results = billingIndividualSchema.safeParse(data.billingIndiviual)

        return results.success
          ? true
          : results?.error?.issues.map((issue) => ctx.addIssue(issue))
      }
      if (data.invoiceType === '1') {
        const corporateResults = billingCorporateSchema.safeParse(
          data.billingCorporate
        )

        return corporateResults.success
          ? true
          : corporateResults?.error?.issues.map((issue) => ctx.addIssue(issue))
      }
    }

    // If fillBillingInfosCheck is false, we don't need to validate `individual` at all
    return true
  }
)

export type PassengerSchemaType = z.infer<typeof passengerValidation>
export type CheckoutSchemaMergedFieldTypes = z.infer<
  typeof checkoutSchemaMerged
>
