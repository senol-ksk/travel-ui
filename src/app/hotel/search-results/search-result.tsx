'use client'

import { Title } from '@mantine/core'

import { useQueryStates } from 'nuqs'
import { hotelSearchParamParser } from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './request-model'

export const HotelSearchResults: React.FC = () => {
  const [searchParams] = useQueryStates(hotelSearchParamParser)
  const hotelSearchRequestQuery = useSearchResultParams(searchParams)

  console.log(hotelSearchRequestQuery.data?.pages.at(-1)?.hasMoreResponse)

  if (hotelSearchRequestQuery.hasNextPage) {
    hotelSearchRequestQuery.fetchNextPage()
  }

  return <Title>otel aramalari</Title>
}
