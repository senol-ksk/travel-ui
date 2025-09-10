import { Suspense } from 'react'
import { CyprusHotelDetail } from './_component/detail'
import { SearchParams } from 'nuqs/server'
import { cyprusHotelDetailLoader } from '../../searchParams'
import { notFound } from 'next/navigation'
import { Container, Skeleton, Stack } from '@mantine/core'

export default async function CyprusDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const queryParams = await cyprusHotelDetailLoader(searchParams)

  if (!queryParams) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <Container pt='lg'>
          <Stack gap={'md'}>
            <Skeleton h={20} radius={'md'} w={'75%'} />
            <Skeleton h={20} radius={'md'} w={'85%'} />
            <Skeleton h={20} radius={'md'} w={'65%'} />
          </Stack>
        </Container>
      }
    >
      <CyprusHotelDetail searchParams={queryParams} slug={slug} />
    </Suspense>
  )
}
