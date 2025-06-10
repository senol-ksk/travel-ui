'use client'

import { Fragment, Suspense, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  Skeleton,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSerializer, useQueryStates } from 'nuqs'
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormProps,
} from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import { serviceRequest } from '@/network'
import {
  ExtraServicesType,
  TransferExtraApiResponseData,
} from '@/app/transfer/extras/types'
import { formatCurrency } from '@/libs/util'
import { TransferSearchEngineSchemaInfer } from '@/modules/transfer/searchParams.client'
import { transferExtraPageParams } from '@/modules/transfer/searchParams.extras'
import { reservationParsers } from '@/app/reservation/searchParams'

const transferExtraRequeireFields = z.object({
  PickupInfo: z.string().nonempty(),
  PickupDescription: z.optional(z.string()),
  DropInfo: z.string().nonempty(),
  DropDescription: z.optional(z.string()),
  Extras: z.array(
    z
      .object({
        isSelected: z.boolean().default(false).optional(),
        description: z.string().optional(),
        id: z.string().or(z.number()).optional(),
      })
      .optional()
      .superRefine((field, ctx) => {
        if (field?.isSelected && !field?.description?.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lütfen bir açıklama girin.',
            path: ['description'],
          })
        }
      })
  ),
})

type TransferExtrasSchmeType = z.infer<typeof transferExtraRequeireFields>

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

export default function Page() {
  const router = useRouter()
  const formActions = useForm({
    resolver: zodResolver(transferExtraRequeireFields),
  })

  useFieldArray({
    control: formActions.control,
    name: 'Extras',
  })

  const [searchParams] = useQueryStates(transferExtraPageParams)
  const [transferSearchLocalStorage, setTransferSearchLocalStroge] =
    useLocalStorage<TransferSearchEngineSchemaInfer>({
      key: 'transfer-search-engine',
    })

  const extraDataQuery = useQuery({
    enabled: !!(searchParams && transferSearchLocalStorage),
    // enabled: false,
    queryKey: ['extraData', searchParams, transferSearchLocalStorage],
    queryFn: async () => {
      const response = await serviceRequest<TransferExtraApiResponseData>({
        axiosOptions: {
          url: 'api/transfer/extras',
          method: 'post',
          // headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded',
          // },
          params: {
            PickupPointName: transferSearchLocalStorage.origin.PointName,
            PickupLocationName: transferSearchLocalStorage.origin.LocationName,
            PickupPointType: transferSearchLocalStorage.origin.Type,
            DropPointName: transferSearchLocalStorage.destination.PointName,
            DropLocationName:
              transferSearchLocalStorage.destination.LocationName,
            DropPointType: transferSearchLocalStorage.destination.Type,
            AppName: process.env.NEXT_PUBLIC_APP_NAME,
            ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            ProductKey: searchParams.productKey,
            SessionToken: searchParams.sessionToken,
            SearchToken: searchParams.searchToken,
          },
        },
      })

      return response
    },
  })

  const reservationPageMutation = useMutation({
    mutationKey: ['transfer-reservation'],
    mutationFn: async (data: TransferExtrasSchmeType) => {
      const params = {
        PickupPointName: transferSearchLocalStorage.origin.PointName,
        PickupLocationName: transferSearchLocalStorage.origin.LocationName,
        PickupPointType: transferSearchLocalStorage.origin.Type,
        DropPointName: transferSearchLocalStorage.destination.PointName,
        DropLocationName: transferSearchLocalStorage.destination.LocationName,
        DropPointType: transferSearchLocalStorage.destination.Type,
        AppName: process.env.NEXT_PUBLIC_APP_NAME,
        ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
        ProductKey: transferData?.selectResponse.transferVehicle.productKey,
        SessionToken: searchParams.sessionToken,
        SearchToken: searchParams.searchToken,
        PickupInfo: data.DropInfo,
        PickupDescription: data.PickupDescription,
        DropInfo: data.DropInfo,
        DropDescription: data.DropDescription,
        ExtraServiceIds: data.Extras.filter((extra) => {
          return extra?.isSelected
        }).map((extra) => extra?.id),
        ExtraServiceInfo: data.Extras.filter((extra) => {
          return extra?.isSelected
        }).map((extra) => {
          return extra && extra.id ? { [extra?.id]: extra?.description } : null
        }),
      }

      const response = await serviceRequest<TransferExtraApiResponseData>({
        axiosOptions: {
          url: 'api/transfer/reservation',
          method: 'post',
          params,
        },
      })

      return response
    },
    onSuccess: (query) => {
      const resParams = createSerializer(reservationParsers)

      const url = resParams('/reservation', {
        productKey: query?.data?.selectResponse.transferVehicle.productKey,
        sessionToken: searchParams.sessionToken,
        searchToken: searchParams.searchToken,
      })
      router.push(url)
    },
  })

  const transferData = extraDataQuery.data?.data
  const [totalPriceState, setTotalPrice] = useState<number>(0)

  const handleExtraSelect = (extra: ExtraServicesType, fieldState: boolean) => {
    const nextState = totalPriceState
    if (fieldState) {
      setTotalPrice(nextState + extra.priceWithMarkup.amount)
    } else {
      setTotalPrice(nextState - extra.priceWithMarkup.amount)
    }
  }

  const handleSubmit = (data: TransferExtrasSchmeType) => {
    reservationPageMutation.mutateAsync(data)
  }

  useEffect(() => {
    if (
      extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
        .bookDetail.priceWithMarkup.amount
    ) {
      setTotalPrice(
        extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
          .bookDetail.priceWithMarkup.amount
      )
    }
  }, [
    extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
      .bookDetail.priceWithMarkup.amount,
  ])

  if (extraDataQuery.isLoading || !extraDataQuery.data)
    return (
      <div className='container grid gap-3 p-6'>
        <Skeleton radius={'lg'} className='w-full md:w-5/6' h={28} />
        <Skeleton radius={'lg'} className='w-full md:w-2/3' h={20} />
        <Skeleton radius={'lg'} className='w-full md:w-1/3' h={16} />
      </div>
    )

  if (
    !extraDataQuery.isLoading &&
    !(extraDataQuery?.data.data || extraDataQuery.data.success)
  )
    return (
      <div className='container max-w-2xl p-5'>
        <Alert variant='light' color='red' title='Data Alınmadı'>
          Ekstra verisi alınırkan bir hata oluştu.
        </Alert>
      </div>
    )

  return (
    <Suspense>
      <form onSubmit={formActions.handleSubmit(handleSubmit)}>
        <div className='@container'>
          <Container>
            <div className='grid grid-cols-12 items-baseline gap-4 p-5'>
              <div className='col-span-12 rounded-md border p-3 md:col-span-8'>
                <div>
                  <Title className='text-md @lg:text-xl' order={3}>
                    Alınış Yeri - {transferData?.selectResponse.pickupPointName}
                  </Title>
                  <div className='grid gap-4 py-4'>
                    <div>
                      <Controller
                        control={formActions.control}
                        name='PickupInfo'
                        defaultValue=''
                        render={({ field, fieldState }) => {
                          return (
                            <TextInput
                              {...field}
                              label='Uçuş Numarası'
                              error={fieldState.error?.message}
                              description='Sürücünüz uçuşunuzun durumunu inceleyecektir'
                              inputWrapperOrder={[
                                'label',
                                'input',
                                'error',
                                'description',
                              ]}
                            />
                          )
                        }}
                      />
                    </div>
                    <div>
                      <Controller
                        control={formActions.control}
                        name='PickupDescription'
                        defaultValue=''
                        render={({ field, fieldState }) => {
                          return (
                            <Textarea
                              {...field}
                              error={fieldState.error?.message}
                              label='Not'
                              description='İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
                              inputWrapperOrder={[
                                'label',
                                'input',
                                'error',
                                'description',
                              ]}
                            />
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Title className='text-md @lg:text-xl' order={3}>
                    Bırakılış Yeri -{' '}
                    {transferData?.selectResponse.dropPointName}
                  </Title>
                  <div className='grid gap-4 py-4'>
                    <div>
                      <Controller
                        control={formActions.control}
                        name='DropInfo'
                        defaultValue=''
                        render={({ field, fieldState }) => (
                          <TextInput
                            {...field}
                            label='Alınış Yeri Bilgisi'
                            error={fieldState.error?.message}
                            description='Adres Bilgisi'
                            inputWrapperOrder={[
                              'label',
                              'error',
                              'input',
                              'description',
                            ]}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={formActions.control}
                        name='DropDescription'
                        defaultValue=''
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            label='Not'
                            description='İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
                            inputWrapperOrder={[
                              'label',
                              'error',
                              'input',
                              'description',
                            ]}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Title order={5}>
                    Aşağıda istediğiniz ek hizmeti seçebilirsiniz.
                  </Title>

                  <div className='py-5'>
                    {transferData?.selectResponse.transferVehicle.transferData.bookDetail.extraServices.map(
                      (extra, extraIndex, extraData) => {
                        const lastItem = extraData.length - 1 === extraIndex
                        return (
                          <Fragment key={extra.id}>
                            <div>
                              <div className='flex justify-between'>
                                <div>
                                  <Controller
                                    control={formActions.control}
                                    name={`Extras.${extraIndex}.isSelected`}
                                    disabled={
                                      extra.priceWithMarkup.amount === 0
                                    }
                                    render={({
                                      field: { onChange },
                                      fieldState,
                                    }) => (
                                      <Checkbox
                                        onChange={(event) => {
                                          handleExtraSelect(
                                            extra,
                                            event.target.checked
                                          )
                                          onChange(event)
                                        }}
                                        label={extra.title}
                                        value={'' + extra.id}
                                      />
                                    )}
                                  />
                                  <input
                                    type='hidden'
                                    {...formActions.register(
                                      `Extras.${extraIndex}.id`
                                    )}
                                    value={extra.id}
                                  />
                                </div>
                                <div>
                                  {formatCurrency(extra.priceWithMarkup.amount)}
                                </div>
                              </div>
                              <div
                                className='pt-3'
                                hidden={
                                  !formActions.watch(`Extras.${extraIndex}`)
                                    ?.isSelected
                                }
                              >
                                <Controller
                                  control={formActions.control}
                                  name={`Extras.${extraIndex}.description`}
                                  defaultValue=''
                                  render={({ field, fieldState }) => (
                                    <TextInput
                                      {...field}
                                      error={fieldState.error?.message}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            {!lastItem ? <Divider my={'md'} /> : null}
                          </Fragment>
                        )
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className='col-span-12 rounded-md border p-3 md:col-span-4'>
                <div className='flex justify-between'>
                  <div>Toplam Tutar</div>
                  <div className='text-end text-lg font-semibold'>
                    {formatCurrency(totalPriceState)}
                  </div>
                </div>
                <div className='pt-2'>
                  <Button
                    type='submit'
                    fullWidth
                    loading={reservationPageMutation.isPending}
                  >
                    Devam et
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </form>
    </Suspense>
  )
}
