'use client'

import { BusSearchItem } from './components/search-item'
import { Button, Drawer, Skeleton, Title } from '@mantine/core'
import { Suspense, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

import { useSearchRequest } from '@/app/bus/useSearchResults'
import { BusSearchResultItem } from '@/app/bus/types'
import { BusFrame } from './components/bus-frame'

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
  const [seatSelectIsOpened, { open: openSeatSelect, close: closeSeatSelect }] =
    useDisclosure(false)
  const [selectedBus, setSelectedBus] = useState<BusSearchResultItem | null>()

  if (searchResults.hasNextPage) {
    setTimeout(searchResults.fetchNextPage, 1000)
  }

  return (
    <>
      <div className='relative'>
        {searchResults.isLoading || searchResults.hasNextPage ? (
          <div className='absolute end-0 start-0 top-0'>
            <Skeleton h={5} title='Seferler sorgulaniyor' />
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
                          setSelectedBus(bus)
                          openSeatSelect()
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
      <Drawer
        position='right'
        // opened={seatSelectIsOpened}
        opened
        onClose={closeSeatSelect}
        title={
          <div className='text-lg font-semibold'>Otobus Firmasi</div>
          // <div className='text-lg font-semibold'>{selectedBus?.company}</div>
        }
        radius={'lg'}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        classNames={{
          title: 'h2',
        }}
      >
        <BusFrame />
      </Drawer>
    </>
  )
}

export { BusSearchResults }
