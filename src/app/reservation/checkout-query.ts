'use client'

import type { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { serviceRequest } from '@/network'
import { reservationParsers } from '@/app/reservation/searchParams'
import { useRef } from 'react'

const promotionText = 'LXMZ2HB66SGAES'

export interface BaggageRequestDataModel {
  uniqueIdentifier: string
  code: string
  data: string
  releatedObjectId: string
}

export const useCheckoutMethods = () => {
  const [{ searchToken, sessionToken, productKey }] =
    useQueryStates(reservationParsers)

  const moduleName = useRef('')

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

  moduleName.current = checkoutDataQuery.data?.data?.viewBag
    .ModuleName as string

  const baggageMutation = useMutation({
    mutationKey: ['baggage-selection'],
    mutationFn: async (optionalServices: BaggageRequestDataModel[]) => {
      /* {
        summaryResponse: FlightReservationSummary | HotelSummaryResponse
      }*/
      const response = await serviceRequest<
        ProductPassengerApiResponseModel['viewBag']['SummaryViewDataResponser']
      >({
        axiosOptions: {
          url: 'api/product/baggageUpdate',
          method: 'post',
          data: {
            searchToken,
            sessionToken,
            productKey,
            priceCurrency: 'TRY',
            totalPrice:
              checkoutDataQuery?.data?.data?.viewBag.SummaryViewDataResponser
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

  const earlyReservationInsuranceMutation = useMutation({
    mutationKey: ['early-reservation-mutation'],
    mutationFn: async (isChecked: boolean) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: `api/product/${isChecked ? 'addHotelWarranty' : 'removeHotelWarranty'}`,
          method: 'post',
          data: {
            promationText: promotionText,
            searchToken,
            sessionToken,
            productKey,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            moduleName: 'HOTEL',
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            totalPrice:
              checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
          },
        },
      })

      return response
    },
  })

  const partialPaymentMutation = useMutation({
    mutationKey: ['early-reservation-mutation'],
    mutationFn: async (isChecked: boolean) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: `api/promotion/${isChecked ? 'addHotelPartialPayment' : 'removeHotelPartialPayment'}`,
          method: 'post',
          data: {
            promationText: promotionText,
            searchToken,
            sessionToken,
            productKey,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            moduleName: 'HOTEL',
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            totalPrice:
              checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
          },
        },
      })

      return response
    },
  })

  const healthInsuranceMutations = useMutation({
    mutationKey: ['health-insurance-mutation'],
    mutationFn: async (isAdd: boolean) => {
      const response = serviceRequest({
        axiosOptions: {
          url: isAdd
            ? 'api/product/addHealthInsurance'
            : 'api/product/removeHealthInsurance',
          method: 'post',
          data: {
            searchToken,
            sessionToken,
            productSessionToken: searchToken,
            productSearchToken: sessionToken,
            modulName: moduleName.current,
          },
        },
      })

      return response
    },
  })

  return {
    checkoutDataQuery,
    baggageMutation,
    earlyReservationInsuranceMutation,
    partialPaymentMutation,
  }
}
