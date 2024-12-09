'use client'

import { useEffect, useState } from 'react'

import { Button, Loader, Skeleton } from '@mantine/core'
import { useTimeout } from '@mantine/hooks'

import {
  clearCarSearch,
  useCarSearchResults,
} from '@/app/car/search-results/useSearchResult'
import { CarSearchRequest } from '@/app/car/search-results/request-model'

type Props = {
  searchRequestParams: CarSearchRequest
}

export const Search: React.FC<Props> = ({ searchRequestParams }) => {
  const carSearchResult = useCarSearchResults(searchRequestParams)
  const [timeoutReach, setTimeoutReach] = useState(false)

  useTimeout(
    () => {
      setTimeoutReach(true)
    },
    30000,
    {
      autoInvoke: true,
    }
  )
  const { start: tryFetchNextResults } = useTimeout(() => {
    carSearchResult.fetchNextPage()
  }, 3000)

  useEffect(() => {
    return () => {
      clearCarSearch()
    }
  }, [])

  if (carSearchResult.hasNextPage && !timeoutReach) {
    tryFetchNextResults()
  }

  if (carSearchResult.isLoading)
    return (
      <div className='flex items-center justify-center pt-3 md:pt-10'>
        <Loader height={30} />
      </div>
    )

  return (
    <div className='relative'>
      <div className='absolute end-0 start-0 top-0 h-[20] overflow-hidden'>
        {carSearchResult.hasNextPage && !timeoutReach ? (
          <Skeleton className='w-full' h={13} />
        ) : null}
      </div>
      <div className='pt-10 md:container'>
        {carSearchResult.data?.pages.map((carPage) => {
          return carPage.data.searchResults.map((searchResult) => {
            return searchResult.items?.map((carData) => {
              return <div key={carData.key}>{carData.carDetail.name}</div>
            })
          })
        })}
      </div>
    </div>
  )
}
