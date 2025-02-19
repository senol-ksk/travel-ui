import { serviceRequest } from '@/network'
import { useMutation } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { reservationParsers } from '../searchParams'

const useCouponQuery = () => {
  const [queryStrings] = useQueryStates(reservationParsers)

  const applyCouponMutation = useMutation({
    mutationKey: ['discount-coupon'],
    mutationFn: async ({
      promotionText,
      moduleName,
    }: {
      promotionText: string
      moduleName: string
    }) => {
      const response = await serviceRequest<{
        index: number
        discountPrice: ServicePriceType
        discountInfo: {
          index: number
          type: number
        }
        isPartial: boolean
      }>({
        axiosOptions: {
          url: 'api/promotion/applyCoupon',
          method: 'post',
          data: {
            ...queryStrings,
            passengerModelId: 1,
            infoIndex: 1,
            infoType: 0,
            moduleName,
            promationText: promotionText,
          },
        },
      })

      return response
    },
  })

  const revokeCouponMutation = useMutation({
    mutationKey: ['discount-revoke'],
    mutationFn: async ({ moduleName }: { moduleName: string }) => {
      const response = await serviceRequest({
        axiosOptions: {
          method: 'post',
          url: 'api/promotion/revokeCoupon',
          data: {
            ...queryStrings,
            passengerModelId: 1,
            moduleName,
          },
        },
      })

      return response
    },
  })

  return { applyCouponMutation, revokeCouponMutation }
}

export { useCouponQuery }
