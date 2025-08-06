import { SearchParams } from 'nuqs'

import { carSearchParamsCache } from '@/modules/carrent/searchParams'
import { serviceRequest } from '@/network'
import { CarSearchRequest } from '../types'

export const getCarSearchResultParams = async (
  searchParams: SearchParams
): Promise<CarSearchRequest | null | undefined> => {
  const params = carSearchParamsCache.parse(searchParams)

  const response = await serviceRequest<CarSearchRequest>({
    axiosOptions: {
      url: 'api/car/searchResults',
      params,
    },
  })

  return response?.data
}
