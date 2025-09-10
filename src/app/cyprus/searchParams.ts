import {
  createLoader,
  createSerializer,
  parseAsIsoDate,
  parseAsString,
} from 'nuqs/server'

const cyprusHotelDetailSearchParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
  checkInDate: parseAsIsoDate,
  checkOutDate: parseAsIsoDate,
}

export const cyprusHotelDetailSerializer = createSerializer(
  cyprusHotelDetailSearchParams
)

export const cyprusHotelDetailLoader = createLoader(
  cyprusHotelDetailSearchParams
)
