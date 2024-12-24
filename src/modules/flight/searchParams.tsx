import { generateUUID } from '@/libs/util'
import { createSerializer, parseAsString, type inferParserType } from 'nuqs'

export const flightSearchParams = {
  searchToken: parseAsString,
}

export const serializeFlightSearchParams = createSerializer(flightSearchParams)

export const flightSearchResultUrl = () =>
  serializeFlightSearchParams('flight-search', {
    searchToken: generateUUID(),
  })
