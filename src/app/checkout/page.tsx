'use client'

import { useRouter } from 'next/navigation'
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

import { Button, Checkbox, Input, List, TextInput, Title } from '@mantine/core'
import IntlTelInput from 'intl-tel-input/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import cookies from 'js-cookie'
import clsx from 'clsx'

import FlightPassengers from '@/components/checkout/flight/passengers'
import { validTCKN } from '@/libs/tckn-validate'
import {
  GenderEnums,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
  ProductPassengerApiResponseModel,
} from '@/@types/passengerViewModel'
import { request } from '@/network'

import { formatCurrency } from '@/libs/util'

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

export type GeneralFormFieldSchemaTypes = {
  contactEmail: z.ZodString
  contactGSM: z.ZodEffects<z.ZodOptional<z.ZodString>>
  moduleName: z.ZodString
  isInPromoList: z.ZodBoolean
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
        gender: z.nativeEnum(GenderEnums),
        birthDate_day: z.string().min(1).max(2),
        birthDate_month: z.string().min(2).max(2),
        birthDate_year: z.string().min(4).max(4),
        type: z.nativeEnum(PassengerTypesEnum).readonly(),
        citizenNo: z.string().optional(),
        nationality_Check: z.boolean().optional(),
        passengerId: z.string().or(z.number()),
        registeredPassengerId: z.string().or(z.number()),
        passengerKey: z.string().min(2),
        passportCountry: z.string().optional(),
        passportNo: z.string().optional(),
        passportValidity_1: z.string().optional(),
        passportValidity_2: z.string().optional(),
        passportValidity_3: z.string().optional(),
        passportValidityDate: z.string().optional().nullable(),
        hesCode: z.string(),
      })
      .superRefine((value, ctx) => {
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
  contactEmail: z.string().email(),
  contactGSM: z
    .string()
    .optional()
    .refine(() => {
      return isPhoneNumberValid
    }),
  moduleName: z.string(),
  isInPromoList: z.boolean(),
})

const checkoutSchemaMerged = generalFormSchema.merge(passengerValidation)

export type PassengerSchemaType = z.infer<typeof passengerValidation>
export type CheckoutSchemaMergedFieldTypes = z.infer<
  typeof checkoutSchemaMerged
>

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

// import data from '@/app/checkout/dummy.data.json'

import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ orderId: string }>

export default function CheckoutPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const searchParams = use(props.searchParams)

  const router = useRouter()

  // const isSubmittable =
  //   !!formMethods.formState.isDirty && !!formMethods.formState.isValid

  const checkoutQuery = useQuery({
    queryKey: ['checkout', searchParams.orderId, cookies.get('searchToken')],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/Product/ProductPassengerViewWebApi`,
        method: 'get',
        params: {
          sessionToken: cookies.get('sessionToken'),
          searchToken: cookies.get('searchToken'),
        },
      })) as ProductPassengerApiResponseModel

      checkinDate =
        response.treeContainer.childNodes.at(0)?.items[0].value.checkinDate

      return response
    },
    enabled: !!cookies.get('searchToken'),
  })

  const formMethods = useZodForm({
    schema: checkoutSchemaMerged,
    // defaultValues: {
    //   passengers: checkoutQuery.data?.treeContainer.childNodes.at(0),
    //   ModuleName: checkoutQuery?.data?.viewBag.ModuleName,
    // },
    // mode: 'onChange',
  })
  const { fields, append } = useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })

  const checkoutPassengersMutation = useMutation({
    mutationFn: (data: CheckoutSchemaMergedFieldTypes) => {
      return request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/api/payment/checkoutAssests`,
        method: 'POST',
        data: {
          ...data,
          searchToken: cookies.get('searchToken'),
          sessionToken: cookies.get('sessionToken'),
        },
      })
    },
  })

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(async (data) => {
          console.log('Data submitted:', data)
          const requestCheckout = (await checkoutPassengersMutation.mutateAsync(
            data
          )) as { status: boolean }

          if (requestCheckout.status) {
            router.push(`/checkout/payment?key=${searchParams.orderId}`)
          }
        })}
        className='grid gap-3 md:gap-5'
      >
        {checkoutQuery.data ? (
          <input
            {...formMethods.register('moduleName', {
              value: checkoutQuery.data?.viewBag.ModuleName,
            })}
            type='hidden'
          />
        ) : null}
        <CheckoutCard>
          <Title order={3} size={'lg'}>
            İletişim Bilgileri
          </Title>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Input.Wrapper label='E-Posta'>
                <TextInput
                  type='email'
                  {...formMethods.register('contactEmail')}
                  error={
                    !!formMethods.formState?.errors?.contactEmail
                      ? formMethods.formState?.errors?.contactEmail?.message
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
                    name='contactGSM'
                    render={({ field }) => (
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
                              !!formMethods.formState?.errors?.contactGSM,
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
                    )}
                  />
                </div>
                <Input.Error className={'pt-1'}>
                  {!!formMethods.formState?.errors?.contactGSM
                    ? formMethods.formState?.errors?.contactGSM?.message
                    : null}
                </Input.Error>
              </Input.Wrapper>
            </div>
            <div className='col-span-2 pt-2'>
              <Checkbox
                label='Fırsat ve kampanyalardan haberdar olmak istiyorum.'
                {...formMethods.register('isInPromoList', {
                  value: !!checkoutQuery.data?.isInPromoList,
                })}
              />
            </div>
          </div>
        </CheckoutCard>
        <CheckoutCard>
          {checkoutQuery.data &&
            checkoutQuery.data?.treeContainer.childNodes.length &&
            checkoutQuery.data?.treeContainer.childNodes.map((item, index) => {
              const field = item.items[0].value
              checkinDate = field.checkinDate
              const passengerType = field.type
              let fieldErrors
              if (formMethods.formState.errors.passengers?.length) {
                fieldErrors = formMethods.formState?.errors?.passengers[index]
              }

              return (
                <div key={index}>
                  <Title order={3} size={'lg'} pb={10}>
                    {PassengerTypesIndexEnum[passengerType]}
                  </Title>
                  <FlightPassengers
                    fieldProps={{
                      firstName: field.firstName || '',
                      birthDate: field.birthDate || '',
                      birthDate_day: '',
                      birthDate_month: '',
                      birthDate_year: '',
                      gender: field.gender,
                      lastName: field.lastName || '',
                      id:
                        typeof field._passengerId === 'string'
                          ? field._passengerId
                          : '',
                      passengerId: field.model_PassengerId,
                      nationality_Check: !!field.nationality_Check,
                      passengerKey: field.passengerKey || '',
                      registeredPassengerId: field.registeredPassengerId || '',
                      type: field.type,
                      citizenNo: field.citizenNo || '',
                      passportCountry: field.passportCountry || 'tr',
                      passportNo: field.passportNo || '',
                      passportValidity_1: '',
                      passportValidity_2: '',
                      passportValidity_3: '',
                      passportValidityDate: field.passportValidityDate,
                      hesCode: field.hesCode || '',
                    }}
                    index={index}
                    error={fieldErrors}
                  />
                </div>
              )
            })}
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
          {/* {process.env.NODE_ENV === 'development' ? (
            <Button type='submit'>test button</Button>
          ) : null} */}
        </CheckoutCard>
      </form>
    </FormProvider>
  )
}

const CheckoutCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className='grid gap-3 rounded-md border bg-white p-2 shadow md:gap-6 md:p-6'>
    {children}
  </div>
)
