import {
  createLoader,
  createSerializer,
  inferParserType,
  parseAsBoolean,
  parseAsIsoDate,
  parseAsString,
} from 'nuqs/server'

export const cyprusHotelDetailSearchParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
  roomKey: parseAsString,
  roomGroupKey: parseAsString,
  checkInDate: parseAsIsoDate,
  checkOutDate: parseAsIsoDate,
  isTransfer: parseAsBoolean.withDefault(true),
  isFlight: parseAsBoolean.withDefault(true),
}

export const cyprusHotelDetailSerializer = createSerializer(
  cyprusHotelDetailSearchParams
)

export const cyprusHotelDetailLoader = createLoader(
  cyprusHotelDetailSearchParams
)

export type CyprusHotelDetailSearchParamTypes = inferParserType<
  typeof cyprusHotelDetailSearchParams
>
