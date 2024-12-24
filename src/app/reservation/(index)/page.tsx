'use client'

import { PassengerTypesIndexEnum } from '@/types/passengerViewModel'
import { useCheckoutQuery } from '@/app/reservation/checkout-query'
import { useRouter } from 'next/navigation'

import {
  useForm,
  UseFormProps,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  Checkbox,
  Input,
  List,
  LoadingOverlay,
  Skeleton,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import IntlTelInput from 'intl-tel-input/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

import FlightPassengers from '@/components/checkout/flight/passengers'

import { serviceRequest } from '@/network'

import { formatCurrency } from '@/libs/util'
import {
  checkoutSchemaMerged,
  CheckoutSchemaMergedFieldTypes,
  checkPhoneNumberIsValid,
} from './validations'

import { CheckoutCard } from '@/components/card'
import { createSerializer, useQueryStates } from 'nuqs'
import { reservationParsers } from '../searchParams'

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
  const router = useRouter()
  const checkoutQuery = useCheckoutQuery()
  const [queryStrings] = useQueryStates(reservationParsers)

  const formMethods = useZodForm({
    schema: checkoutSchemaMerged,
  })
  useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })

  const checkoutPassengersMutation = useMutation({
    mutationFn: (data: CheckoutSchemaMergedFieldTypes) => {
      return serviceRequest<{
        status: 'error' | 'success'
        success: boolean
      }>({
        axiosOptions: {
          url: `/api/payment/checkoutAssests`,
          method: 'POST',
          data: {
            ...data,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
          },
        },
      })
    },
  })
  const queryClient = useQueryClient()

  if (!checkoutQuery.data || checkoutQuery.isLoading) {
    return (
      <Stack gap={12} className='max-w-[600px]'>
        <Skeleton height={20} radius='xl' />
        <Skeleton height={20} w={'80%'} radius='xl' />
        <Skeleton height={16} radius='xl' w={'75%'} />
        <Skeleton height={10} width='60%' radius='xl' />
      </Stack>
    )
  }

  if (!checkoutQuery.data?.data || !checkoutQuery.data?.success) {
    return (
      <CheckoutCard>
        <Title>Bir hata olustu</Title>
        <div>{checkoutQuery.data?.data?.exceptionAction?.message}</div>
      </CheckoutCard>
    )
  }

  return (
    <div className='relative'>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(async (data) => {
            console.log('Data submitted:', data)
            const requestCheckout =
              await checkoutPassengersMutation.mutateAsync(data)

            const serialize = createSerializer(reservationParsers)
            const url = serialize('/reservation/payment', {
              productKey: queryStrings.productKey,
              searchToken: queryStrings.searchToken,
              sessionToken: queryStrings.sessionToken,
            })

            if (requestCheckout?.success) {
              queryClient.clear()
              router.push(url)
            }
          })}
          className='relative grid gap-3 md:gap-5'
        >
          {checkoutQuery.data && checkoutQuery.data.success ? (
            <>
              <input
                {...formMethods.register('moduleName', {
                  value: checkoutQuery.data?.data?.viewBag.ModuleName,
                })}
                type='hidden'
              />
              <input
                {...formMethods.register('fillBillingInfosCheck', {
                  value: false,
                })}
                type='hidden'
              />
            </>
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
                            checkPhoneNumberIsValid(isValid)
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
                            loadUtils: () =>
                              // @ts-expect-error watch for the package updates
                              import('intl-tel-input/build/js/utils.js'),
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
                    value: !!checkoutQuery.data?.data?.isInPromoList,
                  })}
                />
              </div>
            </div>
          </CheckoutCard>
          <CheckoutCard>
            {checkoutQuery?.data?.data &&
              checkoutQuery.data.data?.treeContainer.childNodes.length &&
              checkoutQuery.data.data?.treeContainer.childNodes.map(
                (item, index) => {
                  const field = item.items[0].value
                  const passengerType = field.type
                  let fieldErrors
                  if (formMethods.formState.errors.passengers?.length) {
                    fieldErrors =
                      formMethods.formState?.errors?.passengers[index]
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
                          registeredPassengerId:
                            field.registeredPassengerId || '',
                          type: field.type,
                          // citizenNo: field.citizenNo || '',
                          citizenNo: '',
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
                }
              )}
          </CheckoutCard>
          <CheckoutCard>
            <div className='text-sm'>
              <Title order={4} pb='md'>
                Seyahatinizi inceleyin ve rezervasyon yapın
              </Title>
              <List type='ordered'>
                <List.Item>
                  Tarihlerin ve saatlerin doğru olduğundan emin olmak için
                  seyahat bilgilerinizi inceleyin.
                </List.Item>
                <List.Item>
                  Yazımınızı kontrol edin. Uçuş yolcularının isimleri, devlet
                  tarafından verilen fotoğraflı kimlikle tam olarak
                  eşleşmelidir.
                </List.Item>
              </List>
            </div>
            <div className='flex justify-center'>
              {checkoutQuery.data.data ? (
                <div className='flex gap-3'>
                  <div>
                    <div className='text-sm'>Toplam Tutar</div>
                    <div className='pt-1 text-lg font-semibold'>
                      {formatCurrency(
                        checkoutQuery.data.data?.viewBag
                          .SummaryViewDataResponser.summaryResponse.totalPrice
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
          </CheckoutCard>
        </form>
      </FormProvider>
      <LoadingOverlay visible={checkoutPassengersMutation.isPending} />
    </div>
  )
}
