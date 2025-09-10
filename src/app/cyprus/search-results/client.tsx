'use client'

import { CyprusSearchEngine } from '@/modules/cyprus'
import { useCyprusSearchResults } from './useSearchResults'
import { Anchor, Container } from '@mantine/core'
import { Link, useTransitionRouter } from 'next-view-transitions'
import { Route } from 'next'
import { cyprusHotelDetailSerializer } from '../searchParams'

const CyprusSearchResults = () => {
  const { cyprusSearchResultsQuery, searchToken, sessionToken, searchParams } =
    useCyprusSearchResults()

  return (
    <>
      <div className='border-b py-3'>
        <Container>
          <CyprusSearchEngine
            defaultValues={{
              rooms: searchParams.rooms,
              checkInDate: searchParams.checkInDate,
              checkOutDate: searchParams.checkOutDate,
              isFlight: searchParams.isFlight,
              isTransfer: searchParams.isTransfer,
              slug: searchParams.slug,
              airportCode: searchParams.airportCode ?? '',
            }}
          />
        </Container>
      </div>
      <Container>
        {cyprusSearchResultsQuery?.data?.searchResults.map((searchResult) => {
          return searchResult.items.map((item) => {
            const detailUrl = cyprusHotelDetailSerializer(
              `/cyprus/${item.hotel?.slug}`,
              {
                searchToken,
                sessionToken,
                productKey: item.key,
                checkInDate: new Date(item.checkInDate),
                checkOutDate: new Date(item.checkOutDate),
              }
            )

            return (
              <div key={item.key}>
                <div>{item?.hotel?.name}</div>

                <Anchor component={Link} href={detailUrl as Route}>
                  Devam et
                </Anchor>
              </div>
            )
          })
        })}
      </Container>
    </>
  )
}

export { CyprusSearchResults }
