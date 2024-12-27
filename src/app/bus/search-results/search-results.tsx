'use client'

import { useSearchRequest } from '@/app/bus/search-results/useSearchResults'

import { BusSearchItem } from './search-item'
import { BusSearchEngine } from '@/modules/bus'
import { Loader, Skeleton } from '@mantine/core'

const seatRequestParams = {
  params: {
    SearchToken:
      'F1C2A04E022976B70F089D2F37A1FCA37D8124B0C72F255DFD37CBCE69ACC2E6',
    ProductKey: 'O8tZRiZYEF1+7ancZt3h/Zwy9OeoR2ZXqb6naZKbpwI=',
    SessionToken:
      'A734B8DFD032B8B1312D906CD5799BEE0ADDAE02D2A4E16D3B66BF0A9153C08F',
    ReturnDiagnostics: 0,
    AppName: 'fulltrip.prod.webapp.html',
    ScopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
  },
  apiRoute: 'BusService',
  apiAction: '/api/Bus/Detail',
  sessionToken:
    'A734B8DFD032B8B1312D906CD5799BEE0ADDAE02D2A4E16D3B66BF0A9153C08F',
  appName: 'fulltrip.prod.webapp.html',
  scopeName: 'FULLTRIP',
  scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
  Device: 'Web',
  LanguageCode: 'tr_TR',
}

const BusSearchResults: React.FC = () => {
  const searchResults = useSearchRequest()

  if (searchResults.hasNextPage) {
    setTimeout(searchResults.fetchNextPage, 1000)
  }

  return (
    <div className='relative'>
      {searchResults.isLoading || searchResults.hasNextPage ? (
        <div className='absolute end-0 start-0 top-0'>
          <Skeleton h={5} color='red.500' bg={'red'} />
        </div>
      ) : null}
      <div className='pt-5 @container md:pt-10'>
        <div className='grid gap-4 lg:container md:grid-cols-4 md:gap-3'>
          <div className='md:col-span-1'>
            <div className='rounded-md border border-gray-300 p-3'>
              Filter section
            </div>
          </div>
          <div className='grid gap-4 md:col-span-3'>
            {searchResults?.data?.pages.map((page, i) =>
              page?.searchResults.map((searchResults) =>
                searchResults.items.map((searchItem) => {
                  return (
                    <BusSearchItem
                      key={searchItem.key}
                      searchItem={searchItem}
                      onSelect={(bus) => {
                        console.log(bus)
                      }}
                    />
                  )
                })
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { BusSearchResults }
