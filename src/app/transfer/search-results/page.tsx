import { Suspense } from 'react'
import { Container, Skeleton } from '@mantine/core'

import { TransferSearchEngine } from '@/modules/transfer'
import { TransferSearchResults } from './search-results'

export default function Page() {
  return (
    <Suspense fallback={<Skeleton h={30} />}>
      <div>
        <div className='border-b px-3 py-3 md:py-6'>
          <Container>
            <TransferSearchEngine />
          </Container>
        </div>

        <TransferSearchResults />
      </div>
    </Suspense>
  )
}
