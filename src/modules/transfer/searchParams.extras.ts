import { createLoader, parseAsString } from 'nuqs/server'

const transferExtraPageParams = {
  searchToken: parseAsString,
  sessionToken: parseAsString,
  productKey: parseAsString,
}

export const loadTransferExtraSearchParams = createLoader(
  transferExtraPageParams
)
