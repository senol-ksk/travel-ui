'use client'

import type {
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { serviceRequest } from '@/network'
import { reservationParsers } from '@/app/reservation/searchParams'

export interface BaggageRequestDataModel {
  uniqueIdentifier: string
  code: string
  data: string
  releatedObjectId: string
}

export const useCheckoutMethods = () => {
  const [{ searchToken, sessionToken, productKey }] =
    useQueryStates(reservationParsers)

  const checkoutDataQuery = useQuery({
    queryKey: ['checkout', [searchToken, sessionToken, productKey]],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          signal,
          url: `api/product/reservationData`,
          method: 'get',
          params: {
            searchToken,
            sessionToken,
            productKey,
          },
        },
      })

      return response
    },
  })

  const baggageMutation = useMutation({
    mutationKey: ['baggage-selection'],
    mutationFn: async (optionalServices: BaggageRequestDataModel[]) => {
      const response = await serviceRequest<{
        summaryResponse: FlightReservationSummary
      }>({
        axiosOptions: {
          url: 'api/product/baggageUpdate',
          method: 'post',
          data: {
            searchToken,
            sessionToken,
            productKey,
            priceCurrency: 'TRY',
            totalPrice:
              checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
            optionalServices,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success && query?.data?.summaryResponse) {
        checkoutDataQuery.refetch()
      }
    },
  })

  return { checkoutDataQuery, baggageMutation }
}
