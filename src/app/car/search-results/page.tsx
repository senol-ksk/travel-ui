import { Suspense, useId } from 'react'

import { Skeleton } from '@mantine/core'
import { SearchParams } from 'nuqs'
import { SearchResult } from './search-result'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarSearchResultPage: React.FC<PageProps> = async ({ searchParams }) => {
  const params = await searchParams

  return (
    <Suspense fallback={<Loader />}>
      <SearchResult searchParams={params} />
    </Suspense>
  )
}

export default CarSearchResultPage

const Loader = () => (
  <div className='grid gap-3 pt-3 md:container md:grid-cols-5'>
    <Skeleton radius={4} h={20} />
    <Skeleton radius={4} h={20} />
    <Skeleton radius={4} h={20} />
  </div>
)
