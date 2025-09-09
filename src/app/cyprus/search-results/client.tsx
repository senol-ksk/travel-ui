'use client'

import { CyprusSearchEngine } from '@/modules/cyprus'
import { useCyprusSearchResults } from './useSearchResults'
import { Container } from '@mantine/core'

const CyprusSearchResults = () => {
  const { cyprusSearchResultsQuery, searchParams } = useCyprusSearchResults()

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
            return item?.hotel?.name
          })
        })}
      </Container>
    </>
  )
}

export { CyprusSearchResults }
