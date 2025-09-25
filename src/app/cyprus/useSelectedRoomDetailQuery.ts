import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CyprusFlight,
  CyprusSelectedRoomDetailResponse,
  CyprusTransfer,
  CyprusTransferApiResponse,
} from './types'
import { CyprusHotelDetailSearchParamTypes } from './searchParams'
import { olRequest } from '@/network'
import dayjs from 'dayjs'

type TransferInfoParams = {
  flightDate?: Date
  airport?: string
  airline?: string
  departureHour?: string
  departureMin?: string
  arravialHour?: string
  arravialMin?: string
  flightCode?: string
}

type IProps = {
  transportData?: CyprusTransferApiResponse | undefined
  queryParams: CyprusHotelDetailSearchParamTypes
  selectedDepartureFlight?:
    | CyprusFlight['flightSegmentList'][0]['flightList'][0]
    | null
    | undefined
  selectedReturnFlight?:
    | CyprusFlight['flightSegmentList'][0]['flightList'][0]
    | null
    | undefined
  selectedTransfer?: CyprusTransfer['transferSegmentList'][0] | null | undefined
  roomKey: string | null
  departureTransferInformation?: TransferInfoParams
  arrivalTransferInformation?: TransferInfoParams
}
export const useSelectedRoomDetailQuery = ({
  transportData,
  queryParams,
  selectedDepartureFlight,
  selectedReturnFlight,
  selectedTransfer,
  roomKey,
  arrivalTransferInformation,
  departureTransferInformation,
}: IProps) =>
  useQuery({
    queryKey: [
      'cyprus-transform',
      queryParams,
      selectedDepartureFlight,
      selectedReturnFlight,
      selectedTransfer,
      transportData,
      roomKey,
      arrivalTransferInformation,
      departureTransferInformation,
    ],
    enabled: !!(transportData?.flights && transportData?.transfers),
    queryFn: async () => {
      const response = await fetchRoomDetail({
        queryParams,
        roomKey,
        selectedDepartureFlight,
        selectedReturnFlight,
        selectedTransfer,
        transportData,
        arrivalTransferInformation,
        departureTransferInformation,
      })
      return response
    },
  })

export const useSelectedRoomDetailMutation = () =>
  useMutation({
    mutationKey: ['cyprus-transform'],
    mutationFn: async ({
      transportData,
      queryParams,
      selectedDepartureFlight,
      selectedReturnFlight,
      selectedTransfer,
      roomKey,
      arrivalTransferInformation,
      departureTransferInformation,
    }: IProps) => {
      const response = fetchRoomDetail({
        queryParams,
        roomKey,
        selectedDepartureFlight,
        selectedReturnFlight,
        selectedTransfer,
        transportData,
        arrivalTransferInformation,
        departureTransferInformation,
      })
      return response
    },
  })

const fetchRoomDetail = ({
  queryParams,
  roomKey,
  selectedDepartureFlight,
  selectedReturnFlight,
  selectedTransfer,
  transportData,
  arrivalTransferInformation,
  departureTransferInformation,
}: IProps) =>
  olRequest<CyprusSelectedRoomDetailResponse>({
    apiRoute: 'CyprusPackageService',
    apiAction: 'api/CyprusPackage/SelectedRoomDetail',
    data: {
      requestType:
        'TravelAccess.Core.Models.CyprusPackage.SelectedRoomDetailRequestModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
      returnType:
        'Core.Models.ResultModels.RestResult`1[[TravelAccess.Business.Models.CyprusPackage.View.HotelSummaryViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
      params: {
        ...queryParams,
        roomKey,
        cancelWarranty: false,
        departureFlightCode:
          selectedDepartureFlight?.flightDetails.at(0)?.priceCode,
        returnFlightCode: selectedReturnFlight?.flightDetails.at(0)?.priceCode,
        departureTransferCode: selectedTransfer?.priceCode,
        returnTransferCode: selectedTransfer?.priceCode,
        flightHashCode: transportData?.hotelInfo?.isFlight
          ? transportData?.flights?.flightHashData
          : null,
        transferHashCode: transportData?.hotelInfo?.isTransfer
          ? transportData?.transfers?.transferHashData
          : null,

        departureTransferInformation:
          !transportData?.hotelInfo?.isFlight &&
          transportData?.hotelInfo?.isTransfer &&
          !departureTransferInformation
            ? {
                airline: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.flightDetails.at(0)?.airline,
                airport:
                  transportData?.flights?.flightSegmentList.at(0)?.destination,
                arravialHour: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.arrivalTime.split(':')[0],
                arravialMin: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.arrivalTime.split(':')[1],
                departureHour: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.departureTime.split(':')[0],
                departureMin: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.departureTime.split(':')[1],
                flightCode: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.flightDetails.at(0)?.flightNo,
                flightDate: dayjs(
                  transportData?.flights?.flightSegmentList
                    .at(0)
                    ?.flightList.at(0)
                    ?.flightDetails.at(0)?.departureDate
                ).toDate(),
              }
            : { ...departureTransferInformation },
        arrivalTransferInformation:
          !transportData?.hotelInfo?.isFlight &&
          transportData?.hotelInfo?.isTransfer &&
          !arrivalTransferInformation
            ? {
                airline: selectedDepartureFlight?.flightDetails.at(0)?.airline,
                airport:
                  selectedDepartureFlight?.flightDetails.at(0)?.destination,
                arravialHour: selectedDepartureFlight?.flightDetails
                  .at(0)
                  ?.arrivalTime.split(':')[0],
                arravialMin: selectedDepartureFlight?.flightDetails
                  .at(0)
                  ?.arrivalTime.split(':')[1],
                departureHour: selectedDepartureFlight?.flightDetails
                  .at(0)
                  ?.departureTime.split(':')[0],
                departureMin: selectedDepartureFlight?.flightDetails
                  .at(0)
                  ?.departureTime.split(':')[1],
                flightCode: transportData?.flights?.flightSegmentList
                  .at(0)
                  ?.flightList.at(0)
                  ?.flightDetails.at(0)?.flightNo,
                flightDate: dayjs(
                  transportData?.flights?.flightSegmentList
                    .at(0)
                    ?.flightList.at(0)
                    ?.flightDetails.at(0)?.departureDate
                ).toDate(),
              }
            : { ...arrivalTransferInformation },
      },
    },
  })
