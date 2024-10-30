'use client'

import dayjs from 'dayjs'
import {
  useForm,
  UseFormProps,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cardValidation from 'card-validator'

import {
  Button,
  Checkbox,
  Input,
  List,
  NativeSelect,
  TextInput,
  Title,
} from '@mantine/core'
import IntlTelInput from 'intl-tel-input/react'
import { useQuery } from '@tanstack/react-query'
import cookies from 'js-cookie'
import clsx from 'clsx'
import { formatCreditCard } from 'cleave-zen'

import FlightPassengers from '@/components/checkout/flight/passengers'
import { validTCKN } from '@/libs/tckn-validate'
import { ProductPassengerApiResponseModel } from '@/@types/passengerViewModel'
import { request } from '@/network'

import { formatCurrency, monthsShortList, yearList } from '@/libs/util'

enum PassengerTypesEnum {
  // The Yolcu tipi 0.Adult 1. Child 2.Infant 3.Senior 4.Soldier field is required.
  Adult,
  Child,
  Infant,
  Senior,
  Soldier,
}

const cardMonths = () =>
  monthsShortList().map((month) => {
    return {
      label: month?.value,
      value: month?.value,
    }
  })

const cardExpiredYearList = () =>
  yearList(dayjs().get('year'), dayjs().get('year') + 10).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

export type PassengerValidationType = {
  birthDate_day: z.ZodString
  birthDate_month: z.ZodString
  birthDate_year: z.ZodString
  birthDate: z.ZodString
  citizenNo: z.ZodOptional<z.ZodString>
  firstName: z.ZodString
  gender: z.ZodString
  lastName: z.ZodString
  model_PassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  nationality_Check: z.ZodBoolean
  PassengerKey: z.ZodString
  PassportCountry: z.ZodOptional<z.ZodString>
  PassportNo: z.ZodOptional<z.ZodString>
  PassportValidityDate: z.ZodOptional<z.ZodString>
  passportValidity_1: z.ZodOptional<z.ZodString>
  passportValidity_2: z.ZodOptional<z.ZodString>
  passportValidity_3: z.ZodOptional<z.ZodString>
  RegisteredPassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  type: z.ZodReadonly<z.ZodNativeEnum<typeof PassengerTypesEnum>>
}

export type GeneralFormFieldSchemaTypes = {
  ContactEmail: z.ZodString
  ContactGSM: z.ZodEffects<z.ZodOptional<z.ZodString>>
  ModuleName: z.ZodString
}

let isPhoneNumberValid = false
const baseDateSchema = z.string().date()
let checkinDate: string | undefined
const passengerValidation = z.object({
  passengers: z.array(
    z
      .object<PassengerValidationType>({
        firstName: z
          .string()
          .min(3)
          .max(50)
          .regex(/^[a-zA-Z a-z A-Z\-]+$/),
        lastName: z
          .string()
          .min(3)
          .max(50)
          .regex(/^[a-zA-Z a-z A-Z\-]+$/),
        birthDate: z.string().date(),
        gender: z.string().min(1),
        birthDate_day: z.string().min(1).max(2),
        birthDate_month: z.string().min(2).max(2),
        birthDate_year: z.string().min(4).max(4),
        type: z.nativeEnum(PassengerTypesEnum).readonly(),
        citizenNo: z.string().optional(),
        nationality_Check: z.boolean(),
        model_PassengerId: z.string().or(z.number()),
        RegisteredPassengerId: z.string().or(z.number()),
        PassengerKey: z.string().min(2),
        PassportCountry: z.string().optional(),
        PassportNo: z.string().optional(),
        passportValidity_1: z.string().optional(),
        passportValidity_2: z.string().optional(),
        passportValidity_3: z.string().optional(),
        PassportValidityDate: z.string().optional(),
      })
      .superRefine((value, ctx) => {
        if (!value.nationality_Check && !validTCKN(value.citizenNo!)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['citizenNo'],
            message: 'Gecerli tc giriniz',
          })
        }
        const passportCountry = value.PassportCountry!
        const passportNo = value.PassportNo!
        const passportDate = value.PassportValidityDate!
        if (value.nationality_Check) {
          if (passportCountry?.length < 2) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 2,
              inclusive: true,
              type: 'string',
              path: ['PassportCountry'],
            })
          }
          if (passportNo.length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              path: ['PassportNo'],
              minimum: 3,
              inclusive: true,
              type: 'string',
            })
          }
          if (!baseDateSchema.safeParse(passportDate).success) {
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_date,
              path: ['PassportValidityDate'],
            })
          }
        }

        const birthDayVal = value.birthDate
        if (baseDateSchema.safeParse(birthDayVal).success) {
          const dayjsBirthDay = dayjs(birthDayVal)
          const dayjsToday = dayjs()
          const dateDiff = dayjsToday.diff(dayjsBirthDay, 'day')
          console.log(checkinDate)
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

const generalFormSchema = z.object<GeneralFormFieldSchemaTypes>({
  ContactEmail: z.string().email(),
  ContactGSM: z
    .string()
    .optional()
    .refine(() => {
      return isPhoneNumberValid
    }),
  ModuleName: z.string(),
})

let cardCvvLength = 3
const cardValidationSchema = z.object({
  CardOwner: z.string().min(3).max(50),
  CardNumber: z
    .string()
    .optional()
    .refine((value) => {
      cardCvvLength = cardValidation.number(value).card?.code.size || 3

      return cardValidation.number(value).isValid
    }, 'Gecersiz Kart Numarası'),
  CardExpiredMonth: z.string(),
  CardExpiredYear: z.string(),
  CardCvv: z.string().refine((val) => {
    return val.length === cardCvvLength
  }),
})

const checkoutSchemaMerged = generalFormSchema
  .merge(passengerValidation)
  .merge(cardValidationSchema)

export type PassengerSchemaType = z.infer<typeof passengerValidation>
export type CheckoutSchemaMergedFieldTypes = z.infer<
  typeof checkoutSchemaMerged
>
export type CardValidationSchemaTypes = z.infer<typeof cardValidationSchema>

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  }
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      raw: true,
    }),
  })

  return form
}

import data from '@/app/checkout/dummy.data.json'

// const passengerFormFields = data.treeContainer.childNodes.map((item) => {
//   const passenger = item.items.at(0)?.value!

//   return {
//     firstName: passenger.firstName || '',
//     lastName: passenger.lastName || '',
//     birthDate: passenger.birthDate || '',
//     birthDate_day: passenger.birthDate || '',
//     birthDate_month: passenger.birthDate || '',
//     birthDate_year: passenger.birthDate || '',
//     gender: passenger.gender ? '' + passenger.gender : '',
//     nationality_Check: passenger.nationality_Check || false,
//     type: passenger.type || 0,
//     citizenNo: passenger.citizenNo || '',
//     model_PassengerId: passenger.model_PassengerId,
//     RegisteredPassengerId: passenger.registeredPassengerId,
//     PassportCountry: passenger.passportCountry || '',
//     PassengerKey: passenger.passengerKey || '',
//     PassportNo: passenger.passportNo || '',
//     PassportValidityDate: passenger.passportValidityDate || '',
//   }
// })

export default function CheckoutPage() {
  const formMethods = useZodForm({
    schema: checkoutSchemaMerged,
    // defaultValues: {
    //   passengers: passengerFormFields,
    //   ModuleName: data.viewBag.ModuleName,
    // },
    // mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })

  // const isSubmittable =
  //   !!formMethods.formState.isDirty && !!formMethods.formState.isValid

  const checkoutQuery = useQuery({
    queryKey: ['checkout', cookies.get('searchToken')],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/Product/ProductPassengerViewWebApi`,
        method: 'get',
        params: {
          sessionToken: cookies.get('sessionToken'),
          searchToken: cookies.get('searchToken'),
        },
      })) as ProductPassengerApiResponseModel
      const passengerFormValue = response.treeContainer.childNodes.map(
        (child) => {
          return child.items.at(0)?.value
        }
      ) as
        | ProductPassengerApiResponseModel['treeContainer']['childNodes']['0']['items']['0']['value'][]
        | null

      passengerFormValue?.forEach((passenger, item) => {
        append({
          firstName: passenger.firstName || '',
          lastName: passenger.lastName || '',
          birthDate: passenger.birthDate || '',
          birthDate_day: passenger.birthDate || '',
          birthDate_month: passenger.birthDate || '',
          birthDate_year: passenger.birthDate || '',
          gender: passenger.gender ? '' + passenger.gender : '',
          nationality_Check: passenger.nationality_Check || false,
          type: passenger.type || 0,
          citizenNo: passenger.citizenNo || '',
          model_PassengerId: passenger.model_PassengerId,
          RegisteredPassengerId: passenger.registeredPassengerId,
          PassportCountry: passenger.passportCountry || '',
          PassengerKey: passenger.passengerKey || '',
          PassportNo: passenger.passportNo || '',
          PassportValidityDate: passenger.passportValidityDate || '',
        })
      })

      formMethods.setValue('ModuleName', response.viewBag.ModuleName)
      formMethods.setValue('ContactEmail', response.contactEmail || '')
      formMethods.setValue('ContactEmail', response.contactGSM || '')
      checkinDate =
        response.treeContainer.childNodes.at(0)?.items[0].value.checkinDate

      return response
    },
    enabled: !!cookies.get('searchToken'),
    retry: false,
  })

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          console.log('Data submitted:', data)
        })}
        className='grid gap-3 md:gap-5'
      >
        <input {...formMethods.register('ModuleName')} type='hidden' />
        <CheckoutCard>
          <Title order={3} size={'lg'}>
            İletişim Bilgileri
          </Title>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Input.Wrapper label='E-Posta'>
                <TextInput
                  type='email'
                  {...formMethods.register('ContactEmail')}
                  error={
                    !!formMethods.formState?.errors?.ContactEmail
                      ? formMethods.formState?.errors?.ContactEmail?.message
                      : null
                  }
                />
              </Input.Wrapper>
            </div>
            <div>
              <Input.Wrapper label='GSM No'>
                <div
                  className='m_6c018570 mantine-Input-wrapper'
                  data-variant='default'
                >
                  <Controller
                    control={formMethods.control}
                    name='ContactGSM'
                    render={({ field }) => {
                      return (
                        <IntlTelInput
                          {...field}
                          initialValue={''}
                          onChangeValidity={(isValid) => {
                            isPhoneNumberValid = isValid
                          }}
                          usePreciseValidation
                          ref={(ref) => {
                            field.ref({
                              focus: ref?.getInput,
                            })
                          }}
                          onChangeNumber={field.onChange}
                          inputProps={{
                            className: clsx('m_8fb7ebe7 mantine-Input-input', {
                              'border-rose-500':
                                !!formMethods.formState?.errors?.ContactGSM,
                            }),
                            'data-variant': 'default',
                            name: field.name,
                          }}
                          initOptions={{
                            containerClass: 'w-full',
                            separateDialCode: true,
                            initialCountry: 'auto',
                            i18n: {
                              tr: 'Türkiye',
                              searchPlaceholder: 'Ülke adı giriniz',
                            },
                            loadUtilsOnInit: '/intl-tel-input/utils.js',
                            geoIpLookup: (callback) => {
                              fetch('https://ipapi.co/json')
                                .then((res) => res.json())
                                .then((data) => callback(data.country_code))
                                .catch(() => callback('tr'))
                            },
                          }}
                        />
                      )
                    }}
                  />
                </div>
                <Input.Error className={'pt-1'}>
                  {!!formMethods.formState?.errors?.ContactGSM
                    ? formMethods.formState?.errors?.ContactGSM?.message
                    : null}
                </Input.Error>
              </Input.Wrapper>
            </div>
            <div className='col-span-2 pt-2'>
              <Checkbox
                label='Fırsat ve kampanyalardan haberdar olmak istiyorum.'
                name='IsInPromoList'
              />
            </div>
          </div>
        </CheckoutCard>
        <CheckoutCard>
          {fields.map((field, index) => {
            let fieldErrors
            if (formMethods.formState.errors.passengers?.length) {
              fieldErrors = formMethods.formState?.errors?.passengers[index]
            }
            return (
              <div key={field.id}>
                <Title order={3} size={'lg'} pb={10}>
                  {PassengerTypesEnum[field.type]}
                </Title>
                <FlightPassengers
                  field={field}
                  index={index}
                  error={fieldErrors}
                />
              </div>
            )
          })}
        </CheckoutCard>
        <CheckoutCard>
          <div className='grid w-full gap-3 md:w-72'>
            <Controller
              control={formMethods.control}
              name='CardOwner'
              defaultValue={''}
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    autoComplete='cc-name'
                    label='Kart Üzerindeki İsim'
                    placeholder='Kart Üzerindeki İsim'
                    error={
                      !!formMethods.formState.errors.CardOwner
                        ? formMethods.formState.errors.CardOwner.message
                        : null
                    }
                  />
                )
              }}
            />
            <Controller
              control={formMethods.control}
              name='CardNumber'
              defaultValue=''
              render={({ field }) => (
                <TextInput
                  {...field}
                  autoComplete='cc-number'
                  label='Kart Numarası'
                  type='tel'
                  error={
                    !!formMethods.formState.errors.CardNumber
                      ? formMethods.formState.errors.CardNumber.message
                      : null
                  }
                  // value={creditCardNumber}
                  onChange={({ currentTarget: { value } }) => {
                    const formatedValue = formatCreditCard(value).trim()
                    field.onChange(formatedValue)
                  }}
                />
              )}
            />
            <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
              <Controller
                control={formMethods.control}
                name='CardExpiredMonth'
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    label='Ay'
                    autoComplete='cc-exp-month'
                    data={[{ label: 'Ay', value: '' }, ...cardMonths()]}
                    error={
                      !!formMethods.formState.errors.CardExpiredMonth
                        ? formMethods.formState.errors.CardExpiredMonth.message
                        : null
                    }
                  />
                )}
              />
              <Controller
                control={formMethods.control}
                name='CardExpiredYear'
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    autoComplete='cc-exp-year'
                    label='Yıl'
                    data={[
                      { label: 'Yıl', value: '' },
                      ...cardExpiredYearList(),
                    ]}
                    error={
                      !!formMethods.formState.errors.CardExpiredYear
                        ? formMethods.formState.errors.CardExpiredYear.message
                        : null
                    }
                  />
                )}
              />

              <Controller
                control={formMethods.control}
                name='CardCvv'
                defaultValue=''
                render={({ field }) => (
                  <TextInput
                    {...field}
                    maxLength={
                      cardValidation.number(formMethods.watch('CardNumber'))
                        .card?.code.size || 3
                    }
                    label='CVV'
                    placeholder='CVV'
                    error={
                      !!formMethods.formState.errors.CardCvv
                        ? formMethods.formState.errors.CardCvv.message
                        : null
                    }
                  />
                )}
              />
            </div>
          </div>
        </CheckoutCard>
        <CheckoutCard>
          <div className='text-sm'>
            <Title order={4} pb='md'>
              Seyahatinizi inceleyin ve rezervasyon yapın
            </Title>
            <List type='ordered'>
              <List.Item>
                Tarihlerin ve saatlerin doğru olduğundan emin olmak için seyahat
                bilgilerinizi inceleyin.
              </List.Item>
              <List.Item>
                Yazımınızı kontrol edin. Uçuş yolcularının isimleri, devlet
                tarafından verilen fotoğraflı kimlikle tam olarak eşleşmelidir.
              </List.Item>
            </List>
          </div>
          <div className='flex justify-center'>
            {checkoutQuery.data ? (
              <div className='flex gap-3'>
                <div>
                  <div className='text-sm'>Toplam Tutar</div>
                  <div className='pt-1 text-lg font-semibold'>
                    {formatCurrency(
                      checkoutQuery.data?.viewBag.SummaryViewDataResponser
                        .summaryResponse.totalPrice
                    )}
                  </div>
                </div>
                <Button
                  size='lg'
                  type='submit'
                  // disabled={!isSubmittable}
                >
                  Devam et
                </Button>
              </div>
            ) : null}
          </div>
          {process.env.NODE_ENV === 'development' ? (
            <Button type='submit'>test button</Button>
          ) : null}
        </CheckoutCard>
      </form>
    </FormProvider>
  )
}

const CheckoutCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className='grid gap-3 rounded-md border bg-white p-2 shadow-sm md:gap-6 md:p-6'>
    {children}
  </div>
)
