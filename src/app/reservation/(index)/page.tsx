'use client'
import 'intl-tel-input/styles'

import { useRouter } from 'next/navigation'
import {
  useForm,
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
  TextInput,
  Title,
} from '@mantine/core'
import IntlTelInput from 'intl-tel-input/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { createSerializer, useQueryStates } from 'nuqs'
import dayjs from 'dayjs'

import PassengerInformationForm from '@/components/checkout/flight/passengers'
import { serviceRequest } from '@/network'
import {
  checkoutSchemaMerged,
  type CheckoutSchemaMergedFieldTypes,
} from '../validations'
import {
  FlightAdditionalDataSubGroup,
  type FlightReservationSummary,
  GenderEnums,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { useCheckoutMethods } from '@/app/reservation/checkout-query'

import { CheckoutCard } from '@/components/card'
import { reservationParsers } from '../searchParams'
import { HotelPassengerInformationForm } from '@/components/checkout/hotel/passengers'

import { BillingForm } from '../components/billing'

import { useMemo } from 'react'
import NumberFlow from '@number-flow/react'

import { FlightOptionalServices } from '@/app/reservation/(index)/flight-optional-services'
import { TravelInsurancePackages } from './travel-insurance'
import { EarlyReservationInsurance } from './hotel/insurance-options'
import { TourExtraServices } from './tour/extras'
import { MdContactPhone } from 'react-icons/md'
import { RiAccountCircleFill } from 'react-icons/ri'

// function useZodForm<TSchema extends z.ZodType>(
//   props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
//     schema: TSchema
//   }
// ) {
//   const form = useForm<TSchema['_input']>({
//     ...props,
//     resolver: zodResolver(props.schema, undefined, {
//       raw: true,
//     }),
//   })

//   return form
// }

export default function CheckoutPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [queryStrings] = useQueryStates(reservationParsers)

  const { checkoutDataQuery } = useCheckoutMethods()

  const checkQueryData = useMemo(
    () => checkoutDataQuery?.data,
    [checkoutDataQuery?.data]
  )

  const formMethods = useForm({
    resolver: zodResolver(checkoutSchemaMerged),
  })

  useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })

  const moduleName = useMemo(
    () => checkoutDataQuery.data?.data?.viewBag.ModuleName,
    [checkoutDataQuery.data?.data?.viewBag.ModuleName]
  ) as ProductPassengerApiResponseModel['viewBag']['ModuleName']

  const initCheckoutMutation = useMutation({
    mutationFn: (data: CheckoutSchemaMergedFieldTypes) => {
      return serviceRequest<{
        status: 'error' | 'success'
        success: boolean
      }>({
        axiosOptions: {
          url: `/api/payment/checkoutAssets`,
          method: 'POST',
          data: {
            ...data,
            moduleName,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
          },
        },
      })
    },
  })

  const passengerData = useMemo(
    () => checkQueryData?.data?.treeContainer.childNodes,
    [checkQueryData?.data?.treeContainer.childNodes]
  )

  if (checkoutDataQuery.isLoading) {
    return (
      <div className='grid gap-3'>
        <Skeleton height={20} radius='md' />
        <Skeleton height={18} w={'80%'} radius='lg' />
        <Skeleton height={16} radius='xl' w={'75%'} />
        <Skeleton height={10} width='60%' radius='xl' />
      </div>
    )
  }

  if (!checkQueryData?.data || !checkoutDataQuery.data?.success) {
    return (
      <CheckoutCard>
        <Title>Bir hata olustu</Title>
      </CheckoutCard>
    )
  }

  return (
    <div className='relative'>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(async (data) => {
            const requestCheckout = await initCheckoutMutation.mutateAsync(data)

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
          <CheckoutCard>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <MdContactPhone size={20} className='text-blue-800' />
              <span className='text-xl font-bold'>İletişim Bilgileri</span>
            </div>
            <div className='grid grid-cols-2 gap-1 md:gap-3'>
              <div>
                <TextInput
                  label={<span className='font-normal'>E-posta</span>}
                  size='md'
                  type='email'
                  {...formMethods.register('contactEmail')}
                  error={
                    !!formMethods.formState?.errors?.contactEmail
                      ? formMethods.formState?.errors?.contactEmail?.message
                      : null
                  }
                />
              </div>
              <div>
                <Input.Wrapper>
                  <Input.Label htmlFor='contactGSM' className='font-normal'>
                    Telefon Numarası{' '}
                  </Input.Label>
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
                          usePreciseValidation
                          ref={(ref) => field.ref(ref?.getInput())}
                          onChangeNumber={field.onChange}
                          inputProps={{
                            className: clsx(
                              'm_8fb7ebe7 mantine-Input-input py-5',
                              {
                                'border-rose-500':
                                  !!formMethods.formState?.errors?.contactGSM,
                              }
                            ),
                            'data-variant': 'default',
                            name: field.name,
                            id: 'contactGSM',
                          }}
                          initOptions={{
                            strictMode: true,
                            containerClass: 'w-full',
                            separateDialCode: true,
                            initialCountry: 'auto',
                            i18n: {
                              tr: 'Türkiye',
                              searchPlaceholder: 'Ülke adı giriniz',
                            },
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
                    value: !!checkQueryData?.data?.isInPromoList,
                  })}
                />
              </div>
            </div>
          </CheckoutCard>

          <CheckoutCard>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <RiAccountCircleFill size={22} className='text-blue-800' />
              <span className='text-xl font-bold'>Yolcu Bilgileri</span>
            </div>
            <div className='grid gap-3'>
              {(() => {
                switch (moduleName.toLowerCase()) {
                  case 'hotel':
                    return (
                      <div>
                        {passengerData?.map((childNode, childNodeIndex) => {
                          const startPoint = childNodeIndex

                          return (
                            <div key={childNode.orderId}>
                              <Title order={3} size={'sm'} pb={10}>
                                {childNodeIndex + 1}. Oda
                              </Title>
                              {childNode.childNodes.map(
                                (innerChildNode, innerChildNodeIndex, arr) => {
                                  const fields =
                                    innerChildNode.items.at(0)?.value
                                  const nodeIndex =
                                    startPoint +
                                    childNodeIndex +
                                    innerChildNodeIndex

                                  const passengerType =
                                    fields?.type || PassengerTypesEnum.Adult
                                  let fieldErrors
                                  if (formMethods.formState.errors.passengers) {
                                    fieldErrors =
                                      formMethods.formState?.errors?.passengers[
                                        nodeIndex
                                      ]
                                  }

                                  if (!fields) return null

                                  return (
                                    <div key={innerChildNode.orderId}>
                                      <div className='ps-4'>
                                        <Title
                                          order={5}
                                          pb={10}
                                          className='font-semibold'
                                        >
                                          {Number(innerChildNodeIndex) + 1}.{' '}
                                          {(() => {
                                            switch (passengerType) {
                                              case PassengerTypesEnum.Adult:
                                                return 'Yetişkin'
                                              case PassengerTypesEnum.Child:
                                                return 'Çocuk'
                                              case PassengerTypesEnum.Infant:
                                                return 'Bebek'
                                              default:
                                                return innerChildNode.key
                                            }
                                          })()}{' '}
                                          Bilgileri
                                        </Title>
                                        <HotelPassengerInformationForm
                                          moduleName={moduleName}
                                          fieldProps={{
                                            declaredAge:
                                              '' + fields.declaredAge,
                                            checkinDate: fields.checkinDate,
                                            moduleName,
                                            birthDate: new Date(
                                              fields?.birthDate
                                            ),
                                            calculationYearType:
                                              fields.calculationYearType,
                                            birthDate_day: '',
                                            birthDate_month: '',
                                            birthDate_year: '',
                                            citizenNo: '',
                                            firstName: fields.firstName,
                                            gender: '' + fields.gender,
                                            lastName: fields.lastName,
                                            hesCode: fields.hesCode || '',
                                            id:
                                              typeof fields?._passengerId ===
                                              'string'
                                                ? fields._passengerId
                                                : '' + nodeIndex,
                                            model_PassengerId:
                                              fields.model_PassengerId,
                                            passengerId:
                                              fields.model_PassengerId,
                                            passengerKey: fields.passengerKey,
                                            registeredPassengerId:
                                              fields.registeredPassengerId,
                                            type: passengerType,
                                            nationality_Check:
                                              fields.nationality_Check,
                                            passportCountry:
                                              fields.passportCountry
                                                ? fields.passportCountry
                                                : 'NL',
                                            passportNo: 'U412421521521',
                                            passportValidity_1: '',
                                            passportValidity_2: '',
                                            passportValidity_3: '',
                                            passportValidityDate: dayjs()
                                              .add(20, 'y')
                                              .toISOString(),
                                          }}
                                          error={fieldErrors}
                                          index={nodeIndex}
                                        />
                                      </div>
                                      {innerChildNodeIndex < arr.length - 1 && (
                                        <hr className='m-5'></hr>
                                      )}
                                    </div>
                                  )
                                }
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )

                  default:
                    return checkQueryData?.data &&
                      passengerData?.length &&
                      checkQueryData.data?.treeContainer.childNodes?.[0]
                        .childNodes.length > 0 // transfer and flight passengers data have different values
                      ? passengerData?.[0].childNodes.map((item, index) => {
                          const field = item.items[0].value
                          const passengerType =
                            field?.type || PassengerTypesEnum.Adult
                          let fieldErrors
                          if (formMethods.formState.errors.passengers?.length) {
                            fieldErrors =
                              formMethods.formState?.errors?.passengers[index]
                          }

                          return (
                            <div key={index}>
                              <Title order={3} size={'sm'} pb={10}>
                                {/* {PassengerTypesIndexEnum[passengerType]} */}
                                {(() => {
                                  switch (passengerType) {
                                    case 0:
                                      return 'Yetiskin'

                                    default:
                                      return PassengerTypesIndexEnum[
                                        passengerType
                                      ]
                                  }
                                })()}
                              </Title>

                              <PassengerInformationForm
                                moduleName={moduleName}
                                fieldProps={{
                                  declaredAge: '' + field.declaredAge,
                                  moduleName,
                                  checkinDate: field.checkinDate,
                                  calculationYearType:
                                    field.calculationYearType,
                                  firstName: field?.firstName || '',
                                  birthDate: new Date(field?.birthDate || ''),
                                  birthDate_day: '',
                                  birthDate_month: '',
                                  birthDate_year: '',
                                  gender:
                                    '' + (field?.gender ?? GenderEnums.Female),
                                  lastName: field?.lastName || '',
                                  id:
                                    typeof field?._passengerId === 'string'
                                      ? field._passengerId
                                      : '',
                                  passengerId: field?.passengerId ?? 0,
                                  model_PassengerId:
                                    field?.model_PassengerId ?? 0,
                                  nationality_Check: !!field?.nationality_Check,
                                  passengerKey: field?.passengerKey ?? '',
                                  registeredPassengerId:
                                    field?.registeredPassengerId ?? 0,
                                  type: passengerType,
                                  citizenNo: '',
                                  passportCountry:
                                    field?.passportCountry ?? 'tr',
                                  passportNo: field?.passportNo || '',
                                  passportValidity_1: '',
                                  passportValidity_2: '',
                                  passportValidity_3: '',
                                  passportValidityDate:
                                    field?.passportValidityDate,
                                  hesCode: field?.hesCode || '',
                                }}
                                index={index}
                                error={fieldErrors}
                              />
                            </div>
                          )
                        })
                      : passengerData?.map((item, index, arr) => {
                          const field = item.items[0].value
                          const passengerType =
                            field?.type || PassengerTypesEnum.Adult
                          let fieldErrors
                          if (formMethods.formState.errors.passengers?.length) {
                            fieldErrors =
                              formMethods.formState?.errors?.passengers[index]
                          }

                          return (
                            <div key={index}>
                              <div className='mb-3 flex items-center gap-1 font-semibold'>
                                <div className='font-bold'>{index + 1}.</div>
                                <div>
                                  {moduleName.toLowerCase() === 'bus'
                                    ? field?.gender.toString() === '1'
                                      ? 'Kadın'
                                      : 'Erkek'
                                    : (() => {
                                        switch (passengerType) {
                                          case 0:
                                            return 'Yetişkin'
                                          case 1:
                                            return 'Çocuk'
                                          case 2:
                                            return 'Bebek'

                                          default:
                                            return PassengerTypesIndexEnum[
                                              passengerType
                                            ]
                                        }
                                      })()}
                                </div>
                              </div>
                              <PassengerInformationForm
                                moduleName={moduleName}
                                fieldProps={{
                                  declaredAge: '' + field.declaredAge,
                                  checkinDate: field.checkinDate,
                                  moduleName,
                                  calculationYearType:
                                    field.calculationYearType,
                                  firstName: field?.firstName || '',
                                  birthDate: new Date(field?.birthDate || ''),
                                  birthDate_day: '',
                                  birthDate_month: '',
                                  birthDate_year: '',
                                  gender: '' + field?.gender,
                                  lastName: field?.lastName || '',
                                  id:
                                    typeof field?._passengerId === 'string'
                                      ? field._passengerId
                                      : '',
                                  passengerId: field?.passengerId ?? 0,
                                  model_PassengerId:
                                    field?.model_PassengerId ?? 0,
                                  nationality_Check: !!field?.nationality_Check,
                                  passengerKey: field?.passengerKey ?? '',
                                  registeredPassengerId:
                                    field?.registeredPassengerId ?? 0,
                                  type: passengerType,
                                  citizenNo: '',
                                  passportCountry:
                                    field?.passportCountry ?? 'tr',
                                  passportNo: field?.passportNo || '',
                                  passportValidity_1: '',
                                  passportValidity_2: '',
                                  passportValidity_3: '',
                                  passportValidityDate:
                                    field?.passportValidityDate,
                                  hesCode: field?.hesCode || '',
                                }}
                                index={index}
                                error={fieldErrors}
                              />
                              {index < passengerData.length - 1 && (
                                <hr className='m-4'></hr>
                              )}
                            </div>
                          )
                        })
                }
              })()}
            </div>
          </CheckoutCard>

          {/* Tour extra and optional services */}
          {/*  */}
          {moduleName === 'TOUR' &&
            checkQueryData.data.viewBag.AdditionalData &&
            checkQueryData.data.viewBag.AdditionalData.additionalData &&
            checkQueryData.data.viewBag.AdditionalData.additionalData.subGroups.filter(
              (firstSubGroup) =>
                firstSubGroup.subGroups.filter(
                  (secondSubGroup) => secondSubGroup.items.length > 0
                ).length > 0
            ).length > 0 && <TourExtraServices data={checkQueryData.data} />}
          {/*  */}
          {/* Tour extra and optional services */}

          {moduleName.toLowerCase() === 'hotel' &&
            checkQueryData?.data?.viewBag.HotelCancelWarrantyPriceStatusModel &&
            checkQueryData?.data?.viewBag.HotelCancelWarrantyPriceStatusModel
              .cancelWarrantyPrice > 0 && (
              <EarlyReservationInsurance
                data={
                  checkQueryData?.data?.viewBag
                    .HotelCancelWarrantyPriceStatusModel
                }
              />
            )}
          {moduleName === 'Flight' &&
            passengerData &&
            checkQueryData?.data?.viewBag?.AdditionalData &&
            checkQueryData?.data?.viewBag?.AdditionalData.additionalData &&
            checkQueryData?.data?.viewBag?.AdditionalData?.additionalData?.subGroups?.filter(
              (item) =>
                item.subGroups.find((item2) =>
                  item2.items.find(
                    (item3) =>
                      item3.code === 'XBAG' || item3.code === 'FrequentFlyer'
                  )
                )
            ).length > 0 && (
              <FlightOptionalServices
                flightInfos={
                  checkQueryData.data?.viewBag.SummaryViewDataResponser
                    .summaryResponse as FlightReservationSummary
                }
                data={
                  checkQueryData.data?.viewBag.AdditionalData.additionalData
                    .subGroups as FlightAdditionalDataSubGroup[]
                }
                passengers={passengerData}
                isLoading={
                  checkoutDataQuery.isLoading || checkoutDataQuery.isRefetching
                }
              />
            )}

          {moduleName !== 'TRANSFER' && moduleName !== 'TOUR' && (
            <TravelInsurancePackages />
          )}
          <CheckoutCard>
            <BillingForm />
          </CheckoutCard>
          <CheckoutCard>
            <div className='text-sm'>
              {/* <Title order={4} pb='md'>
                Seyahatinizi inceleyin ve rezervasyon yapın
              </Title> */}
              <List type='ordered' className='mt-3'>
                <List.Item className='text-center text-sm'>
                  Tarihlerin ve saatlerin doğru olduğundan emin olmak için
                  seyahat bilgilerinizi inceleyin.
                </List.Item>
                <List.Item className='text-center text-sm'>
                  Yazımınızı kontrol edin. Uçuş yolcularının isimleri, devlet
                  tarafından verilen fotoğraflı kimlikle tam olarak
                  eşleşmelidir.
                </List.Item>
              </List>
            </div>
            <div className='flex justify-center'>
              {checkQueryData.data ? (
                <div>
                  <div className='relative'>
                    <LoadingOverlay
                      overlayProps={{ radius: 'sm', blur: 2 }}
                      loaderProps={{ children: ' ' }}
                      visible={
                        checkoutDataQuery.isLoading ||
                        checkoutDataQuery.isRefetching
                      }
                    />
                    <div className='flex items-center justify-center gap-3'>
                      <div className='text-center text-sm'>Ödenecek Tutar:</div>
                      <div className='text-center'>
                        <NumberFlow
                          className='pt-1 text-center text-xl font-bold'
                          format={{
                            style: 'currency',
                            currency: 'TRY',
                            currencyDisplay: 'narrowSymbol',
                          }}
                          value={
                            checkQueryData.data?.viewBag
                              .SummaryViewDataResponser.summaryResponse
                              .totalPrice ?? 0
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className='my-4 min-w-[200px]'
                    size='md'
                    radius='md'
                    type='submit'
                    disabled={
                      checkoutDataQuery.isLoading ||
                      checkoutDataQuery.isRefetching
                    }
                  >
                    Ödemeye İlerle
                  </Button>
                </div>
              ) : null}
            </div>
          </CheckoutCard>
        </form>
      </FormProvider>
      <LoadingOverlay visible={initCheckoutMutation.isPending} />
    </div>
  )
}
