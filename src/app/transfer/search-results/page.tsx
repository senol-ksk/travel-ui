import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'

import { TransferSearchResults } from './search-results'

export default function Page() {
  return (
    <Suspense fallback={<Skeleton h={30} />}>
      <TransferSearchResults />
    </Suspense>
  )
}
