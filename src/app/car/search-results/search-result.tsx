import { SearchParams } from 'nuqs'

import { getCarSearchResultParams } from '@/app/car/search-results/request-model'
import { Search } from '../component/search'

type IProps = {
  searchParams: SearchParams
}

const SearchResult: React.FC<IProps> = async ({ searchParams }) => {
  const searchApiParams = await getCarSearchResultParams(searchParams)

  if (!searchApiParams) {
    return <div>no data</div>
  }

  return <Search searchRequestParams={searchApiParams} />
}

export { SearchResult }
