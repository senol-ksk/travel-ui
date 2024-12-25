import { z } from 'zod'

import type {
  GenderEnums,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'

export type PassengerValidationType = {
  birthDate_day: z.ZodString
  birthDate_month: z.ZodString
  birthDate_year: z.ZodString
  birthDate: z.ZodString
  citizenNo: z.ZodOptional<z.ZodString>
  firstName: z.ZodString
  gender: z.ZodNativeEnum<typeof GenderEnums>
  lastName: z.ZodString
  passengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  model_PassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  nationality_Check: z.ZodOptional<z.ZodBoolean>
  passengerKey: z.ZodString
  passportCountry: z.ZodOptional<z.ZodString>
  passportNo: z.ZodOptional<z.ZodString>
  passportValidityDate: z.ZodNullable<z.ZodOptional<z.ZodString>>
  passportValidity_1: z.ZodOptional<z.ZodString>
  passportValidity_2: z.ZodOptional<z.ZodString>
  passportValidity_3: z.ZodOptional<z.ZodString>
  registeredPassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  type: z.ZodReadonly<z.ZodNativeEnum<typeof PassengerTypesEnum>>
  hesCode: z.ZodString
}

export enum ResponseStatus {
  Success,
  Warning,
  Fatal,
  Error,
  BadRequest,
  NotFound,
  Unauthorized,
  Forbidden,
}

export type PaymentResponeType = {
  okUrl: string
  callbackUrl: string
  failUrl: string
  mode: string
  secure3dsecuritylevel: string
  apiversion: string
  terminalprovuserid: string
  terminaluserid: string
  terminalmerchantid: string
  txntype: string
  txnamount: string
  txncurrencycode: string
  txninstallmentcount: string
  orderid: string
  terminalid: string
  successurl: string
  errorurl: string
  customeremailaddress: string
  customeripaddress: string
  secure3dhash: string
  cardnumber: string
  cardexpiredatemonth: string
  cardexpiredateyear: string
  cardcvv2: string
  action: string
}
