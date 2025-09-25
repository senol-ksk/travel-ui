import { Container, Skeleton } from '@mantine/core'
import { SearchParams } from 'nuqs/server'
import { cyprusHotelDetailLoader } from '../searchParams'
import { CyprusTransferSelect } from './_client'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function CyprusTransferPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const queryParams = await cyprusHotelDetailLoader(searchParams)

  if (!queryParams) {
    return notFound()
  }

  return (
    <Container pt={'lg'}>
      <Suspense fallback={<Skeleton h={20} w={'50%'} mx={'auto'} />}>
        <CyprusTransferSelect queryParams={queryParams} />
      </Suspense>
    </Container>
  )
}
