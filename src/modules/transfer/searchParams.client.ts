import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsIsoDate,
} from 'nuqs/server'

export const transferSearchParams = {
  originId: parseAsString,
  destinationId: parseAsString,
  originSlug: parseAsString,
  destinationSlug: parseAsString,
  date: parseAsIsoDate,
  time: parseAsString,
  searchToken: parseAsString,
  sessionToken: parseAsString,
  adultPassengerCount: parseAsInteger,
  babyPassengerCount: parseAsInteger,
  childrenPassengerCount: parseAsInteger,
}

export const serializeTransferSearchParams =
  createSerializer(transferSearchParams)
