import { createLoader } from 'nuqs/server'

import { transferSearchParams } from '@/modules/transfer/searchParams.client'

export const loadTransferSearchParams = createLoader(transferSearchParams)
