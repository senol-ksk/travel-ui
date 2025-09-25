'use client'

import { useQuery } from '@tanstack/react-query'
import { CyprusHotelDetailSearchParamTypes } from '../searchParams'
import { olRequest } from '@/network'
import {
  Button,
  CheckIcon,
  Grid,
  Group,
  InputLabel,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Radio,
  ScrollArea,
  Skeleton,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { CyprusTransferApiResponse } from '../types'
import { notFound } from 'next/navigation'
import { CyprusFlightSelect } from './_flight-select'
import { useState } from 'react'

import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer } from 'nuqs'
import { reservationParsers } from '@/app/reservation/searchParams'
import { Route } from 'next'
import {
  useSelectedRoomDetailMutation,
  useSelectedRoomDetailQuery,
} from '../useSelectedRoomDetailQuery'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'

import { z } from '@/libs/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formatCurrency } from '@/libs/util'
dayjs.extend(utc)
type IProps = {
  queryParams: CyprusHotelDetailSearchParamTypes
}

const transferInfoSchema = z.object({
  airline: z.string().min(1),
  airport: z.string().min(1),
  arravialHour: z.string().min(1),
  arravialMin: z.string().min(1),
  departureHour: z.string().min(1),
  departureMin: z.string().min(1),
  flightCode: z.string().min(1),
  flightDate: z.date(),
})

const transportFormSchema = z.object({
  departureTransferInformation: transferInfoSchema,
  arrivalTransferInformation: transferInfoSchema,
})
type TransformFormSchemaType = z.infer<typeof transportFormSchema>

const CyprusTransferSelect: React.FC<IProps> = ({ queryParams }) => {
  const form = useForm({
    resolver: zodResolver(transportFormSchema),
  })

  const [selectedDepartureFlightValue, setSelectedDepartureFlightValue] =
    useState<null | string>()
  const [selectedReturnFlightValue, setSelectedReturnFlightValue] = useState<
    null | string
  >()
  const [selectedTransferValue, setSelectedValueTransfer] = useState<
    string | null
  >()

  const router = useTransitionRouter()

  const cyprusTransportDataQuery = useQuery({
    queryKey: ['cyprus-transfer-query', queryParams],
    queryFn: async () => {
      const response = await olRequest<CyprusTransferApiResponse>({
        apiAction: 'api/CyprusPackage/GetTransport',
        apiRoute: 'CyprusPackageService',
        data: {
          params: {
            ...queryParams,
            page: 1,
          },
          requestType:
            'Business.Models.CyprusPackage.TransportApiRequest, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[Business.Models.CyprusPackage.View.TransportViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
        },
      })

      return response
    },
    select: (query) => {
      return query?.data
    },
  })

  const transportData = cyprusTransportDataQuery.data
  const isTransfer = transportData?.hotelInfo?.isTransfer
  const isFlight = transportData?.hotelInfo?.isFlight
  const isTransferOnly = !isFlight && isTransfer

  const departureFlight = transportData?.flights?.flightSegmentList[0]
  const returnFlight = transportData?.flights?.flightSegmentList[1]
  const transferList = transportData?.transfers?.transferSegmentList

  const selectedDepartureFlight = isFlight
    ? (departureFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.flightNo === selectedDepartureFlightValue
        )
      ) ?? departureFlight?.flightList.at(0))
    : null

  const selectedReturnFlight = isFlight
    ? (returnFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.flightNo === selectedReturnFlightValue
        )
      ) ?? returnFlight?.flightList.at(0))
    : null

  const selectedTransfer = isTransfer
    ? (transferList?.find(
        (transfer) => transfer.priceCode === selectedTransferValue
      ) ?? transferList?.at(0))
    : null

  const cyprusAddRemoveTransportQuery = useSelectedRoomDetailQuery({
    queryParams,
    selectedDepartureFlight,
    selectedReturnFlight,
    selectedTransfer,
    transportData,
    roomKey: queryParams.roomGroupKey,
  })

  const addRemoveMutation = useSelectedRoomDetailMutation()

  if (!cyprusTransportDataQuery.data && cyprusTransportDataQuery.isLoading)
    return <Skeleton h={20} />

  if (!cyprusTransportDataQuery.data) {
    // TODO: we may redirect homepage, or hotel search results
    notFound()
  }

  const handleReservation = async (data?: TransformFormSchemaType | null) => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey: queryParams.roomGroupKey,
      searchToken: queryParams.searchToken,
      sessionToken: queryParams.sessionToken,
    }) as Route

    if (isTransferOnly) {
      await form.trigger()

      if (form.formState.isValid) {
        addRemoveMutation.mutate(
          {
            queryParams,
            roomKey: queryParams.roomGroupKey,
            selectedTransfer,
            transportData,
            arrivalTransferInformation: form.getValues(
              'arrivalTransferInformation'
            ),
            departureTransferInformation: form.getValues(
              'departureTransferInformation'
            ),
          },
          {
            onSuccess: (query) => {
              if (!!query?.data) {
                // router.push(url)
              }
            },
          }
        )
      }

      return
    }

    router.push(url)
  }

  return (
    <form onSubmit={form.handleSubmit(handleReservation)}>
      <div className='relative'>
        <LoadingOverlay
          visible={
            cyprusAddRemoveTransportQuery.isLoading ||
            cyprusAddRemoveTransportQuery.isFetching
          }
        />
        <Stack gap={'xl'}>
          {departureFlight && isFlight && (
            <div>
              <Title order={3}>Gidiş Uçuşu </Title>
              <div>
                {departureFlight.origin} {departureFlight.destination}
              </div>
              <div>
                <CyprusFlightSelect
                  selectedValue={
                    selectedDepartureFlight?.flightDetails.at(0)?.flightNo ?? ''
                  }
                  onChange={setSelectedDepartureFlightValue}
                  flightData={departureFlight}
                />
              </div>
            </div>
          )}
          {returnFlight && isFlight && (
            <div>
              <Title order={3}>Dönüş Uçuşu</Title>
              <div>
                {returnFlight.origin} {returnFlight.destination}
              </div>
              <div>
                <CyprusFlightSelect
                  selectedValue={
                    selectedReturnFlight?.flightDetails.at(0)?.flightNo ?? ''
                  }
                  onChange={setSelectedReturnFlightValue}
                  flightData={returnFlight}
                />
              </div>
            </div>
          )}
          {isTransfer && transferList && (
            <div>
              <Title order={3}>Gidiş Dönüş Transferi</Title>
              <div className='pt-4'>
                <ScrollArea.Autosize mah={200}>
                  <Radio.Group
                    name='transfer'
                    value={selectedTransferValue ?? selectedTransfer?.priceCode}
                    onChange={setSelectedValueTransfer}
                  >
                    <Stack>
                      {transferList.map((transfer) => {
                        return (
                          <Radio.Card
                            key={transfer.priceCode}
                            value={transfer.priceCode}
                          >
                            <Group wrap='nowrap' align='flex-start'>
                              <Radio.Indicator icon={CheckIcon} />
                              <div>{transfer.transferFrom}</div>
                              <div>
                                {formatCurrency(transfer.totalPrice.value)}
                              </div>
                            </Group>
                          </Radio.Card>
                        )
                      })}
                    </Stack>
                  </Radio.Group>
                </ScrollArea.Autosize>
              </div>
              {isTransferOnly && (
                <div>
                  <h3 className='mb-2'>Uçuş Bilgileriniz</h3>
                  <Stack pt={'md'} gap={'md'}>
                    <div>
                      <h4>Gidiş</h4>

                      <Grid>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='departureTransferInformation.flightDate'
                            render={({ field, fieldState }) => {
                              return (
                                <DatePickerInput
                                  valueFormat='DD MMMM YYYY'
                                  minDate={new Date()}
                                  error={fieldState.error?.message}
                                  label='Gidiş Uçuş Tarihi'
                                  size='sm'
                                  {...field}
                                  onChange={(dateValue) => {
                                    field.onChange(
                                      dayjs.utc(dateValue).toDate()
                                    )
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='departureTransferInformation.airport'
                            defaultValue=''
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Kalkış Havalimanı'
                                  error={fieldState.error?.message}
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  size='sm'
                                  {...field}
                                  onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            defaultValue=''
                            control={form.control}
                            name='departureTransferInformation.airline'
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Havayolu Şirketi'
                                  error={fieldState.error?.message}
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  size='sm'
                                  {...field}
                                  onChangeCapture={({
                                    currentTarget: { value },
                                  }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            defaultValue=''
                            name='departureTransferInformation.flightCode'
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Uçuş Kodu'
                                  error={fieldState.error?.message}
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  size='sm'
                                  {...field}
                                  onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <TimeInput
                            error={
                              form.formState.errors.departureTransferInformation
                                ?.departureHour?.message ||
                              form.formState.errors.departureTransferInformation
                                ?.departureMin?.message
                            }
                            label='Kalkış Saati'
                            onChange={(event) => {
                              const currentValue = event.currentTarget.value
                              const hour = currentValue.split(':')[0]
                              const minute = currentValue.split(':')[1]

                              form.setValue(
                                'departureTransferInformation.departureHour',
                                hour
                              )
                              form.setValue(
                                'departureTransferInformation.departureMin',
                                minute
                              )

                              form.trigger([
                                'departureTransferInformation.departureHour',
                                'departureTransferInformation.departureMin',
                              ])
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <TimeInput
                            label='Varış Saati'
                            error={
                              form.formState.errors.departureTransferInformation
                                ?.arravialHour?.message ||
                              form.formState.errors.departureTransferInformation
                                ?.arravialMin?.message
                            }
                            onChange={(event) => {
                              const currentValue = event.currentTarget.value
                              const hour = currentValue.split(':')[0]
                              const minute = currentValue.split(':')[1]

                              form.setValue(
                                'departureTransferInformation.arravialHour',
                                hour
                              )
                              form.setValue(
                                'departureTransferInformation.arravialMin',
                                minute
                              )
                              form.trigger([
                                'departureTransferInformation.arravialHour',
                                'departureTransferInformation.arravialMin',
                              ])
                            }}
                          />
                        </Grid.Col>
                      </Grid>
                    </div>
                    <div>
                      <h4>Dönüş</h4>

                      <Grid>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='arrivalTransferInformation.flightDate'
                            render={({ field, fieldState }) => {
                              return (
                                <DatePickerInput
                                  valueFormat='DD MMMM YYYY'
                                  minDate={new Date()}
                                  error={fieldState.error?.message}
                                  label='Dönüş Uçuş Tarihi'
                                  size='sm'
                                  {...field}
                                  onChange={(dateValue) => {
                                    field.onChange(
                                      dayjs.utc(dateValue).toDate()
                                    )
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='arrivalTransferInformation.airport'
                            defaultValue=''
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Varış Havalimanı'
                                  error={fieldState.error?.message}
                                  size='sm'
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  {...field}
                                  onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='arrivalTransferInformation.airline'
                            defaultValue=''
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Havayolu Şirketi'
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  size='sm'
                                  {...field}
                                  error={fieldState.error?.message}
                                  onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <Controller
                            control={form.control}
                            name='arrivalTransferInformation.flightCode'
                            defaultValue=''
                            render={({ field, fieldState }) => {
                              return (
                                <TextInput
                                  label='Uçuş Kodu'
                                  classNames={{
                                    label: 'text-sm',
                                  }}
                                  size='sm'
                                  {...field}
                                  error={fieldState.error?.message}
                                  onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value)
                                    form.trigger(field.name)
                                  }}
                                />
                              )
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <TimeInput
                            label='Kalkış Saati'
                            error={
                              form.formState.errors.arrivalTransferInformation
                                ?.departureHour?.message ||
                              form.formState.errors.arrivalTransferInformation
                                ?.departureMin?.message
                            }
                            onChange={(event) => {
                              const currentValue = event.currentTarget.value
                              const hour = currentValue.split(':')[0]
                              const minute = currentValue.split(':')[1]

                              form.setValue(
                                'arrivalTransferInformation.departureHour',
                                hour
                              )
                              form.setValue(
                                'arrivalTransferInformation.departureMin',
                                minute
                              )

                              form.trigger([
                                'arrivalTransferInformation.departureHour',
                                'arrivalTransferInformation.departureMin',
                              ])
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 2,
                            sm: 4,
                          }}
                        >
                          <TimeInput
                            label='Varış Saati'
                            error={
                              form.formState.errors.arrivalTransferInformation
                                ?.arravialHour?.message ||
                              form.formState.errors.arrivalTransferInformation
                                ?.arravialMin?.message
                            }
                            onChange={(event) => {
                              const currentValue = event.currentTarget.value
                              const hour = currentValue.split(':')[0]
                              const minute = currentValue.split(':')[1]

                              form.setValue(
                                'arrivalTransferInformation.arravialHour',
                                hour
                              )
                              form.setValue(
                                'arrivalTransferInformation.arravialMin',
                                minute
                              )

                              form.trigger([
                                'arrivalTransferInformation.arravialHour',
                                'arrivalTransferInformation.arravialMin',
                              ])
                            }}
                          />
                        </Grid.Col>
                      </Grid>
                    </div>
                  </Stack>
                </div>
              )}
            </div>
          )}
          <div>
            {cyprusAddRemoveTransportQuery.data?.data?.totalPrice &&
              formatCurrency(
                cyprusAddRemoveTransportQuery.data?.data.totalPrice
              )}
          </div>
          <div>
            <Button
              type='button'
              onClick={() => handleReservation(form.getValues())}
            >
              odemeye ilerle
            </Button>
          </div>
        </Stack>
      </div>
    </form>
  )
}

export { CyprusTransferSelect }
