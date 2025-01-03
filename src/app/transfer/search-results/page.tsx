import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'

import { TransferSearchEngine } from '@/modules/transfer'
import { TransferSearchResults } from './search-results'

export default function Page() {
  return (
    <Suspense fallback={<Skeleton h={30} />}>
      <div>
        <div className='border-b px-3 py-3 md:py-6'>
          <div className='lg:container'>
            <TransferSearchEngine />
          </div>
        </div>

        <TransferSearchResults />
      </div>
    </Suspense>
  )
}
