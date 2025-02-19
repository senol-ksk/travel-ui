import type { SearchParams } from 'nuqs/server'

import { carDetailSearchParamsCache } from '../searchParams'
import { Suspense } from 'react'
import { DetailClient } from './client'
import { Container } from '@mantine/core'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarDetailPage: React.FC<PageProps> = async ({ searchParams }) => {
  await carDetailSearchParamsCache.parse(searchParams)

  return (
    <Suspense>
      <Container>
        <div className='py-3 md:py-8'>
          <DetailClient />
        </div>
      </Container>
    </Suspense>
  )
}

export default CarDetailPage
