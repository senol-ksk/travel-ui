'use client'

import {
  useForm,
  UseFormProps,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'

import data from './dummy.data.json'

import FlightPassengers from '@/components/checkout/flight/passengers'
import { Button, Checkbox, Input, TextInput, Title } from '@mantine/core'
import { validTCKN } from '@/libs/tckn-validate'
import { ProductPassengerApiResponseModel } from '@/@types/passengerViewModel'
import { request } from '@/network'
import { useQuery } from '@tanstack/react-query'
import cookies from 'js-cookie'
import clsx from 'clsx'

enum PassengerTypesEnum {
  Adult,
  Child,
  Infant,
  Senior,
  Soldier,
}

// The Yolcu tipi 0.Adult 1. Child 2.Infant 3.Senior 4.Soldier field is required.

export type PassengerValidationType = {
  type: z.ZodReadonly<z.ZodNativeEnum<typeof PassengerTypesEnum>>
  firstName: z.ZodString
  lastName: z.ZodString
  gender: z.ZodString
  birthDate: z.ZodString
  birthDate_day: z.ZodString
  birthDate_month: z.ZodString
  birthDate_year: z.ZodString
  citizenNo: z.ZodOptional<z.ZodString>
  nationality_Check: z.ZodBoolean
}

export type ContactFieldSchemaTypes = {
  ContactEmail: z.ZodString
  ContactGSM: z.ZodEffects<z.ZodOptional<z.ZodString>>
}

const passengerValidation = z.object({
  passengers: z.array(
    z
      .object<PassengerValidationType>({
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
        birthDate: z.string().date(),
        gender: z.string().min(1),
        birthDate_day: z.string().min(1).max(2),
        birthDate_month: z.string().min(2).max(2),
        birthDate_year: z.string().min(4).max(4),
        type: z.nativeEnum(PassengerTypesEnum).readonly(),
        citizenNo: z.string().optional(),
        nationality_Check: z.boolean(),
      })
      .superRefine((value, ctx) => {
        if (!value.nationality_Check && !validTCKN(value.citizenNo!)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['citizenNo'],
            message: 'Gecerli tc giriniz',
          })
        }

        return z.NEVER
      })
  ),
})

let isPhoneNumberValid = false
const contactFieldSchema = z.object<ContactFieldSchemaTypes>({
  ContactEmail: z.string().email(),
  ContactGSM: z
    .string()
    .optional()
    .refine(() => {
      return isPhoneNumberValid
    }),
})

export type PassengerSchemaType = z.infer<typeof passengerValidation>
// export type PassengerFieldsSchemaTypes = z.infer<
//   typeof passengerValidation
// >['passengers'][number]

const checkoutSchemaMerged = contactFieldSchema.merge(passengerValidation)

type CheckoutSchemaMergedFieldTypes = z.infer<typeof checkoutSchemaMerged>

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

export default function CheckoutPage() {
  const formMethods = useZodForm({
    schema: checkoutSchemaMerged,
    // defaultValues: {
    //   passengers: data.treeContainer.childNodes,
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
        })
      })

      formMethods.setValue('ContactEmail', response.contactEmail || '')
      formMethods.setValue('ContactEmail', response.contactGSM || '')

      return response
    },
    enabled: !!cookies.get('searchToken'),
  })

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          console.log('Data submitted:', data)
        })}
        className='grid gap-3 md:gap-5'
      >
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
          <div className='flex justify-end'>
            <Button
              type='submit'
              // disabled={!isSubmittable}
            >
              Devam et
            </Button>
          </div>
        </CheckoutCard>
      </form>
    </FormProvider>
  )
}

const CheckoutCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className='grid gap-3 rounded-md border bg-white p-2 shadow-sm md:gap-6 md:p-6'>
    {children}
  </div>
)
