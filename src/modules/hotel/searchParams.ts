import type { HotelSearchParams } from '@/types/hotel'
import {
  createSearchParamsCache,
  createSerializer,
  inferParserType,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'

export enum HotelSortOrderEnums {
  priceDescending = 'PriceDescending',
  priceAscending = 'PriceAscending',
  // listingRateAscending = 'ListingRateAscending',
  listingRateDescending = 'ListingRateDescending',
  nameAscending = 'NameAscending',
  nameDescending = 'NameDescending',
  starAscending = 'StarAscending',
  starDescending = 'StarDescending',
}

export const hotelSearchParamParser = {
  checkinDate: parseAsIsoDate,
  checkoutDate: parseAsIsoDate,
  destination: parseAsString,
  destinationId: parseAsString,
  slug: parseAsString,
  type: parseAsInteger,
  rooms: parseAsString,
}
export const hotelFilterSearchParams = {
  orderBy: parseAsStringEnum<HotelSortOrderEnums>(
    Object.values(HotelSortOrderEnums)
  ).withDefault(HotelSortOrderEnums.listingRateDescending),
  hotelName: parseAsString,
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  maxStarRating: parseAsInteger,
  minStarRating: parseAsInteger,
}

export const hotelDetailSearchParams = {
  propertyName: parseAsString,
  slug: parseAsString,
  productKey: parseAsString,
  sessionToken: parseAsString,
  searchToken: parseAsString,
  type: parseAsInteger,
  hotelSlug: parseAsString,
}

export type HotelDetailSearchParamsType = inferParserType<
  typeof hotelDetailSearchParams
>

export const serializeHotelDetailParams = createSearchParamsCache(
  hotelDetailSearchParams
)

export const serializeHotelSearchParams = createSerializer<HotelSearchParams>(
  hotelSearchParamParser
)

export const hotelSearchParamsCahce =
  createSearchParamsCache<HotelSearchParams>(hotelSearchParamParser)
