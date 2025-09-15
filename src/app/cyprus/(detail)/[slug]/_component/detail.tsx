import { olRequest } from '@/network'
import { Container, Title } from '@mantine/core'
import { notFound } from 'next/navigation'

import { CyprusHotelDetailSearchParamTypes } from '@/app/cyprus/searchParams'
import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { CyprusRooms } from './_rooms'

type IProps = {
  slug: string
  searchParams: CyprusHotelDetailSearchParamTypes
}

export const CyprusHotelDetail: React.FC<IProps> = async ({
  slug,
  searchParams,
}) => {
  const detailData = await olRequest<CyprusHotelDetailApiResponse>({
    data: {
      params: {
        ...searchParams,
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
  const { hotelDetailResponse } = detailData.data
  const roomGroups = hotelDetailResponse.items
  const { roomDetails } = hotelDetailResponse

  return (
    <div className='pt-4'>
      <Container>
        <Title fz='h2'>
          {detailData?.data?.hotelDetailResponse?.hotelInfo?.hotel.name}
        </Title>
        <div>
          <CyprusRooms roomDetails={roomDetails} roomGroups={roomGroups} />
        </div>
      </Container>
    </div>
  )
}
