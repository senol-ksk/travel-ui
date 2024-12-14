import { parseAsString } from 'nuqs/server'
import { createSearchParamsCache } from 'nuqs/server'

export const carDetailParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  key: parseAsString,
}

export const carDetailSearchParamsCache =
  createSearchParamsCache(carDetailParams)
