'use client'

import { useQuery } from '@tanstack/react-query'
import { CyprusHotelDetailSearchParamTypes } from '../searchParams'
import { olRequest } from '@/network'
import {
  Button,
  CheckIcon,
  Group,
  LoadingOverlay,
  Radio,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core'
import {
  CyprusSelectedRoomDetailResponse,
  CyprusTransferApiResponse,
} from '../types'
import { notFound } from 'next/navigation'
import { CyprusFlightSelect } from './_flight-select'
import { useState } from 'react'

import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer } from 'nuqs'
import { reservationParsers } from '@/app/reservation/searchParams'
import { Route } from 'next'
import { useSelectedRoomDetailQuery } from '../useSelectedRoomDetailQuery'

type IProps = {
  queryParams: CyprusHotelDetailSearchParamTypes
}

const CyprusTransferSelect: React.FC<IProps> = ({ queryParams }) => {
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

  const departureFlight = transportData?.flights?.flightSegmentList[0]
  const returnFlight = transportData?.flights?.flightSegmentList[1]
  const transferList = transportData?.transfers?.transferSegmentList

  const selectedDepartureFlight = queryParams.isFlight
    ? (departureFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.flightNo === selectedDepartureFlightValue
        )
      ) ?? departureFlight?.flightList.at(0))
    : null

  const selectedReturnFlight = queryParams.isFlight
    ? (returnFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.flightNo === selectedReturnFlightValue
        )
      ) ?? returnFlight?.flightList.at(0))
    : null

  const selectedTransfer = queryParams.isTransfer
    ? (transferList?.find(
        (transfer) => transfer.priceCode === selectedTransferValue
      ) ?? transferList?.at(0))
    : null

  // const cyprusAddRemoveTransportQuery = useQuery({
  //   queryKey: [
  //     'cyprus-transform',
  //     queryParams,
  //     selectedDepartureFlight,
  //     selectedReturnFlight,
  //     selectedTransfer,
  //     transportData?.flights?.flightHashData,
  //     transportData?.transfers?.transferHashData,
  //   ],
  //   enabled: !!(transportData?.flights && transportData?.transfers),
  //   queryFn: async () => {
  //     const response = await olRequest<CyprusSelectedRoomDetailResponse>({
  //       apiRoute: 'CyprusPackageService',
  //       apiAction: 'api/CyprusPackage/SelectedRoomDetail',
  //       data: {
  //         requestType:
  //           'TravelAccess.Core.Models.CyprusPackage.SelectedRoomDetailRequestModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
  //         returnType:
  //           'Core.Models.ResultModels.RestResult`1[[TravelAccess.Business.Models.CyprusPackage.View.HotelSummaryViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
  //         params: {
  //           ...queryParams,
  //           roomKey: queryParams.roomGroupKey,
  //           cancelWarranty: false,
  //           departureFlightCode:
  //             selectedDepartureFlight?.flightDetails.at(0)?.priceCode,
  //           returnFlightCode:
  //             selectedReturnFlight?.flightDetails.at(0)?.priceCode,
  //           departureTransferCode: selectedTransfer?.priceCode,
  //           returnTransferCode: selectedTransfer?.priceCode,
  //           flightHashCode: queryParams.isFlight
  //             ? transportData?.flights?.flightHashData
  //             : null,
  //           transferHashCode: queryParams.isTransfer
  //             ? transportData?.transfers?.transferHashData
  //             : null,
  //         },
  //       },
  //     })
  //     return response
  //   },
  // })
  const cyprusAddRemoveTransportQuery = useSelectedRoomDetailQuery({
    queryParams,
    selectedDepartureFlight,
    selectedReturnFlight,
    selectedTransfer,
    transportData,
    roomKey: queryParams.roomGroupKey,
  })

  if (!cyprusTransportDataQuery.data && cyprusTransportDataQuery.isLoading)
    return <Skeleton h={20} />

  if (!cyprusTransportDataQuery.data) {
    // TODO: we may redirect homepage, or hotel search results
    notFound()
  }

  const handleReservation = () => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey: queryParams.roomGroupKey,
      searchToken: queryParams.searchToken,
      sessionToken: queryParams.sessionToken,
    }) as Route

    router.push(url)
  }

  return (
    <div className='relative'>
      <LoadingOverlay
        visible={
          cyprusAddRemoveTransportQuery.isLoading ||
          cyprusAddRemoveTransportQuery.isFetching
        }
      />
      <Stack gap={'xl'}>
        {departureFlight && queryParams.isFlight && (
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
        {returnFlight && queryParams.isFlight && (
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
        {queryParams.isTransfer && transferList && (
          <div>
            <Title order={3}>Gidiş Transferi</Title>
            <div>
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
                          </Group>
                        </Radio.Card>
                      )
                    })}
                  </Stack>
                </Radio.Group>
              </ScrollArea.Autosize>
            </div>
          </div>
        )}
      </Stack>
      <Button type='button' onClick={handleReservation}>
        odemeye ilerle
      </Button>
    </div>
  )
}

export { CyprusTransferSelect }
