import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const reservationParsers = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
}

export const searchParamsCache = createSearchParamsCache(reservationParsers)
