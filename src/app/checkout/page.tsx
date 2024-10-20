'use client'

import {
  useForm,
  UseFormProps,
  useFieldArray,
  FormProvider,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import FlightPassengers from '@/components/checkout/flight/passengers'
import { Button, Title } from '@mantine/core'
import { validTCKN } from '@/libs/tckn-validate'
import { ProductPassengerApiResponseModel } from '@/@types/passengerViewModel'
import { request } from '@/network'
import { useQuery } from '@tanstack/react-query'
import cookies from 'js-cookie'

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

export type PassengerSchemaType = z.infer<typeof passengerValidation>
export type Passenger = z.infer<
  typeof passengerValidation
>['passengers'][number]

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
    schema: passengerValidation,
    // defaultValues: {
    //   passengers: passengersData,
    // },
    // mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })

  const isSubmittable =
    !!formMethods.formState.isDirty && !!formMethods.formState.isValid

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

      return response
    },
    enabled: !!cookies.get('searchToken'),
  })

  return (
    <div className=''>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((data) => {
            console.log('Data submitted:', data)
          })}
        >
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

          <Button
            type='submit'
            // disabled={!isSubmittable}
          >
            Devam et
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}

const CheckoutCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className='gap:3 grid rounded-md border bg-white p-2 shadow-sm md:gap-6 md:p-6'>
    {children}
  </div>
)
