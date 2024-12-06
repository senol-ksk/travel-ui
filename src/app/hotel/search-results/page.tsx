import { type SearchParams } from 'nuqs/server'

// import { getHotelSearchResultParams } from './request-model'
import { HotelSearchResults } from '@/app/hotel/search-results/search-result'
import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const HotelSearchResultsPage: React.FC<PageProps> = async ({
  searchParams,
}) => {
  const params = await searchParams

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HotelSearchResults searchParams={params} />
    </Suspense>
  )
}

export default HotelSearchResultsPage

const SkeletonLoader = () => (
  <div className='grid gap-3 pt-3 md:container md:grid-cols-5'>
    <div className='col-span-1'>
      <Skeleton radius={4} h={'100%'} />
    </div>
    <div className='col-span-4 grid grid-cols-8 gap-3'>
      {[...Array(5).keys()].map((grid, gridIndex) => (
        <>
          <div key={gridIndex}>
            <Skeleton radius={4} h={'100%'} />
          </div>
          <div className='col-span-7 grid gap-2'>
            {[...Array(3).keys()].map((sklet, skeltIndex) => (
              <Skeleton key={skeltIndex + sklet} radius={4} h={20} />
            ))}
          </div>
        </>
      ))}
    </div>
  </div>
)
