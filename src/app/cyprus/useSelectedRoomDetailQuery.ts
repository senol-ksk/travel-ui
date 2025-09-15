'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CyprusFlight,
  CyprusSelectedRoomDetailResponse,
  CyprusTransfer,
  CyprusTransferApiResponse,
} from './types'
import { CyprusHotelDetailSearchParamTypes } from './searchParams'
import { olRequest } from '@/network'

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
}
export const useSelectedRoomDetailQuery = ({
  transportData,
  queryParams,
  selectedDepartureFlight,
  selectedReturnFlight,
  selectedTransfer,
  roomKey,
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
    }: IProps) => {
      const response = fetchRoomDetail({
        queryParams,
        roomKey,
        selectedDepartureFlight,
        selectedReturnFlight,
        selectedTransfer,
        transportData,
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
        flightHashCode: queryParams.isFlight
          ? transportData?.flights?.flightHashData
          : null,
        transferHashCode: queryParams.isTransfer
          ? transportData?.transfers?.transferHashData
          : null,
      },
    },
  })
