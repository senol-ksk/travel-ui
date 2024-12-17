import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const carDetailParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  selectedProductKey: parseAsString,
}

export const carDetailSearchParamsCache =
  createSearchParamsCache(carDetailParams)
