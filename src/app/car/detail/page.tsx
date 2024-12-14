import type { SearchParams } from 'nuqs/server'

import { carDetailSearchParamsCache } from '../searchParams'
import { CarDetail } from '../component/details'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarDetailPage: React.FC<PageProps> = async ({ searchParams }) => {
  const params = await carDetailSearchParamsCache.parse(searchParams)

  if (Object.values(params).every((v) => !v)) return <div>no data</div>

  return (
    <div className='py-3 md:container'>
      <CarDetail />
    </div>
  )
}

export default CarDetailPage
