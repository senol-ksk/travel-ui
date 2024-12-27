import { BusSearchResults } from '@/app/bus/search-results/search-results'
import { BusSearchEngine } from '@/modules/bus'

const BusSearchResultsPage = () => {
  return (
    <>
      <div className='border-b py-4'>
        <div className='lg:container'>
          <BusSearchEngine />
        </div>
      </div>
      <BusSearchResults />
    </>
  )
}

export default BusSearchResultsPage
