'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { CyprusHotelDetailSearchParamTypes } from '../searchParams'
import { olRequest } from '@/network'
import {
  CheckIcon,
  Group,
  Radio,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core'
import {
  CyprusFlight,
  CyprusTransfer,
  CyprusTransferApiResponse,
} from '../types'
import { notFound } from 'next/navigation'
import { CyprusFlightSelect } from './_flight-select'
import { useState } from 'react'
import dayjs from 'dayjs'

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

  const selectedDepartureFlight =
    departureFlight?.flightList.find((flightList) =>
      flightList.flightDetails.find(
        (detail) => detail.flightNo === selectedDepartureFlightValue
      )
    ) ?? departureFlight?.flightList.at(0)
  const selectedReturnFlight =
    returnFlight?.flightList.find((flightList) =>
      flightList.flightDetails.find(
        (detail) => detail.flightNo === selectedReturnFlightValue
      )
    ) ?? returnFlight?.flightList.at(0)
  const selectedTransfer =
    transferList?.find(
      (transfer) => transfer.priceCode === selectedTransferValue
    ) ?? transferList?.at(0)

  const cyprusAddRemoveTransportQuery = useQuery({
    queryKey: [
      'cyprus-transform',
      queryParams,
      selectedDepartureFlight,
      selectedReturnFlight,
      selectedTransfer,
      transportData?.flights?.flightHashData,
      transportData?.transfers?.transferHashData,
    ],
    enabled: !!(transportData?.flights && transportData?.transfers),
    queryFn: async () => {
      const dummyPayload = {
        params: {
          DepartureFlightCode: 'PRC_f3d9821e8b9e56582e6dd0bdcbcc80ef',
          ReturnFlightCode: 'PRC_ddb91d93747c82be7ee3c326395f2c0e',
          DepartureTransferCode: 'TRP_9cfbe7b3821441',
          ReturnTransferCode: 'TRP_9cfbe7b3821441',
          TransferHashCode: 'TRN_4a967a8a4760587b0db2537ec2846d2a',
          FlightHashCode: 'FLGT_259db08e5c718026',
          RoomKey:
            '2RIOpMcyd3hqR2R8mT3AgGOoLrH4LJy2BuyDjWiY66W/lO4MvnmME3o7q+/O3chXVfQkmhjjnDU6G6k0MXiKhjtrm21QtscQ2MsU1V4g9W/Bd25KdrnjVBqyMVyQN5m7',
          SearchToken:
            'F31BE3F038FD78826B2F2953C0E75C27E6C2961831F3526EC0ED4558DA450A3A',
          ProductKey:
            'wreQIHgqJKqqAdkQG/35UUeG6N+Di+CMi5raUeTebWPQF96UilXs2NkF8oe8ZJs+Cfn42E4AHbiYhD43v5aLjSMxx959/Bqzr2AVCcGRFZ3q6uam+6vj/sT8exnIbeJ3',
          DestinationSlug: null,
          HotelSlug: null,
          CancelWarranty: false,
          LanguageCode: null,
          SessionToken:
            '87BFBD9C713ADEEAB8559C8F6196E3EA54E3D592B65DD9BA38C84066CC8F4A4B',
          ApiRoute: null,
          ApiAction: null,
          AppName: 'paraflytravel.preprod.webapp.html',
          ScopeName: 'PARAFLYTRAVEL',
          ScopeCode: 'aa2eff06-6a09-4320-bae2-a82f9504ff19',
          CustomerId: 0,
          CustomerUserId: 0,
        },
        SessionToken:
          '87BFBD9C713ADEEAB8559C8F6196E3EA54E3D592B65DD9BA38C84066CC8F4A4B',
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/SelectedRoomDetail',
        RequestType:
          'TravelAccess.Core.Models.CyprusPackage.SelectedRoomDetailRequestModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
        ReturnType:
          'Core.Models.ResultModels.RestResult`1[[TravelAccess.Business.Models.CyprusPackage.View.HotelSummaryViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
        Device: null,
        LanguageCode: null,
        IPAddress: null,
        MLToken: '7f3a4b23-a402-4e31-b3b2-398848102de4',
      }

      const response = await olRequest({
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/SelectedRoomDetail',
        data: {
          requestType:
            'TravelAccess.Core.Models.CyprusPackage.SelectedRoomDetailRequestModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[TravelAccess.Business.Models.CyprusPackage.View.HotelSummaryViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
          params: {
            ...queryParams,
            roomKey: queryParams.roomGroupKey,
            cancelWarranty: false,
            departureFlightCode:
              selectedDepartureFlight?.flightDetails.at(0)?.priceCode,
            returnFlightCode:
              selectedReturnFlight?.flightDetails.at(0)?.priceCode,
            flightHashCode: transportData?.flights?.flightHashData,
            transferHashCode: transportData?.transfers?.transferHashData,
            departureTransferCode: selectedTransfer?.priceCode,
            returnTransferCode: selectedTransfer?.priceCode,
          },
        },
      })
      return response
    },
  })

  if (!cyprusTransportDataQuery.data || cyprusTransportDataQuery.isLoading)
    return <Skeleton h={20} />

  if ((!departureFlight || !returnFlight) && !transferList) {
    // TODO: we may redirect homepage, or hotel search results
    return notFound()
  }

  return (
    <div>
      <Stack gap={'xl'}>
        {departureFlight && (
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
        {returnFlight && (
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
        {transferList && (
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
    </div>
  )
}

export { CyprusTransferSelect }

// const payloadExample = {
//   Params: {
//     SessionToken:
//       '2DB3AD65B08D8C93DB8287A1BCE73BE5DCA2B2CD074256E4D153C72EB9AF1ED4',
//     SearchToken:
//       '3C0AFA4DE072D54CF0B12B6E1B5838911F7BBF82B363908267EC77AE77DBDE8B',
//     LanguageCode: null,
//     ApiRoute: null,
//     ApiAction: null,
//     ScopeCode: 'aa2eff06-6a09-4320-bae2-a82f9504ff19',
//     AppName: 'paraflytravel.preprod.webapp.html',
//     ProductKey:
//       'wreQIHgqJKqqAdkQG/35UUeG6N+Di+CMi5raUeTebWPmDxvS2mWswRdP1Y4VOcYkmoXhVRAsQaAWkaTCNmlhhGF35Vpax+t8NMHzQfDq/ZeA6z+bnJJeovEzXqFnPzhG',
//     ScopeName: 'PARAFLYTRAVEL',
//     Page: 1,
//     CustomerId: 0,
//     CustomerUserId: 0,
//     RoomKey:
//       '2RIOpMcyd3hqR2R8mT3AgOMf3dS5AmbB8op5Ud7jRLpnaPK9gSmf4FGQdvRnwAYSPyZNXXJDLS+RuxwYdEvR0/jfbR8NRzlG4WKVdPdbz+4nnaCOH9lp29JZ/4adyOUN',
//   },
//   SessionToken:
//     '2DB3AD65B08D8C93DB8287A1BCE73BE5DCA2B2CD074256E4D153C72EB9AF1ED4',
//   ApiRoute: 'CyprusPackageService',
//   ApiAction: 'api/CyprusPackage/GetTransport',
//   RequestType:
//     'Business.Models.CyprusPackage.TransportApiRequest, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
//   ReturnType:
//     'Core.Models.ResultModels.RestResult`1[[Business.Models.CyprusPackage.View.TransportViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
//   Device: null,
//   LanguageCode: null,
//   IPAddress: null,
//   MLToken: 'bf308200-883f-4134-86ee-6f5d5121c58a',
// }
