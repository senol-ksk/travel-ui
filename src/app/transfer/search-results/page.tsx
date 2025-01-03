import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'

import { TransferSearchEngine } from '@/modules/transfer'

export default function Page() {
  return (
    <Suspense fallback={<Skeleton h={30} />}>
      <div>
        <div className='border-b-4 px-3 py-3 md:py-6'>
          <div className='lg:container'>
            <TransferSearchEngine />
          </div>
        </div>
        <div className='py-3 lg:container md:py-6'>Transfer Search Results</div>
      </div>
    </Suspense>
  )
}
