import type { HotelSearchParams } from '@/types/hotel'
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from 'nuqs/server'

export const hotelSearchParamParser: HotelSearchParams = {
  checkinDate: parseAsIsoDate,
  checkoutDate: parseAsIsoDate,
  destination: parseAsString,
  destinationId: parseAsString,
  slug: parseAsString,
  type: parseAsInteger,
  rooms: parseAsString,
}

export const serializeHotelSearchParams = createSerializer<HotelSearchParams>(
  hotelSearchParamParser
)

export const hotelSearchParamsCahce =
  createSearchParamsCache<HotelSearchParams>(hotelSearchParamParser)
