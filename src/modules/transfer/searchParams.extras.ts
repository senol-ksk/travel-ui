import { createLoader, parseAsString } from 'nuqs/server'

export const transferExtraPageParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
}

export const loadTransferExtraSearchParams = createLoader(
  transferExtraPageParams
)
