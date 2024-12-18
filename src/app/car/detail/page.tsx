import type { SearchParams } from 'nuqs/server'

import { carDetailSearchParamsCache } from '../searchParams'
import { Suspense } from 'react'
import { DetailClient } from './client'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarDetailPage: React.FC<PageProps> = async ({ searchParams }) => {
  await carDetailSearchParamsCache.parse(searchParams)

  return (
    <Suspense>
      <div className='py-3 md:container md:py-8'>
        <DetailClient />
      </div>
    </Suspense>
  )
}

export default CarDetailPage
