import { createSerializer, parseAsString, parseAsIsoDate } from 'nuqs/server'

export const busSearchParams = {
  originId: parseAsString,
  destinationId: parseAsString,
  originSlug: parseAsString,
  destinationSlug: parseAsString,
  date: parseAsIsoDate,
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
}

export const serializeBusSearchParams = createSerializer(busSearchParams)
