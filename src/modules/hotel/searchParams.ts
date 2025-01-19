import type { HotelSearchParams } from '@/types/hotel'
import {
  createSearchParamsCache,
  createSerializer,
  inferParserType,
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
// https://www.fulltrip.com/antalya-otelleri/sealife-family-resort-hotel150?AppName=fulltrip.prod.webapp.html&ScopeCode=2d932774-a9d8-4df9-aae7-5ad2727da1c7&SessionToken=A734B8DFD032B8B1312D906CD5799BEE0ADDAE02D2A4E16D3B66BF0A9153C08F&SearchToken=8E96BC404FD9D29979C27C69BE9BF2B54FC026016256C00832CF3B3DA18473FA&Slug=sealife-family-resort-hotel150&Type=0&ProductKey=v6AuEF67inqdnhnhpjA91MuNivwLsw8mPLm3ZSEXSf%2FOd808kVRT%2F0MuknMQ9HnY%2F8YzxyNzZ3S8clE4d0PNIkefOgSMzVJv0ikbqu3wR2ze%2FAifgBMjtgD2C%2B%2BkftgD

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
