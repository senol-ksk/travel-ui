import { Suspense } from 'react'
import { CyprusHotelDetail } from './_component/detail'
import { SearchParams } from 'nuqs/server'
import { cyprusHotelDetailLoader } from '../../searchParams'
import { notFound } from 'next/navigation'
import { Container, Skeleton, Stack } from '@mantine/core'
import { olRequest, OLResponse } from '@/network'
import { CyprusHotelDetailApiResponse } from '../../types'

export default async function CyprusDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const queryParams = await cyprusHotelDetailLoader(searchParams)

  console.log(queryParams)
  if (!queryParams) {
    notFound()
  }

  const detailData = await olRequest<CyprusHotelDetailApiResponse>({
    data: {
      params: {
        ...queryParams,
        slug,
        isSearch: false,
        rooms: null,
        scopeCode: process.env.SCOPE_CODE,
        scopeName: process.env.SCOPE_NAME,
        appName: process.env.APP_NAME,
        languageCode: 'tr-TR',
      },
    },
    apiAction: 'api/CyprusPackage/Detail',
    apiRoute: 'CyprusPackageService',
  })

  if (
    !detailData ||
    !detailData.data ||
    !detailData?.data.hotelDetailResponse
  ) {
    return notFound()
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
      <CyprusHotelDetail
        searchParams={queryParams}
        slug={slug}
        detailData={detailData.data}
      />
    </Suspense>
  )
}
