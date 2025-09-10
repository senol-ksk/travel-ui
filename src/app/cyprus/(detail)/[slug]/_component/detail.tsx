import {
  cyprusHotelDetailLoader,
  CyprusHotelDetailSearchParamTypes,
  cyprusHotelDetailSerializer,
} from '@/app/cyprus/searchParams'
import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { reservationParsers } from '@/app/reservation/searchParams'
import { olRequest, serviceRequest } from '@/network'
import { Button, Container, Title } from '@mantine/core'
import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { createSerializer, SearchParams } from 'nuqs/server'

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

  console.log(detailData?.data.hotelDetailResponse)

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
  const roomDetailsKeys = Object.entries(roomDetails)
  const reservationParams = createSerializer(reservationParsers)

  return (
    <div className='pt-4'>
      <Container>
        <Title fz='h2'>
          {detailData?.data?.hotelDetailResponse?.hotelInfo.hotel.name}
        </Title>
        <div>
          {roomGroups?.map((roomGroup) => {
            const rooms = roomGroup.rooms
            const roomKeys = rooms.map((s) => s.key)
            const details = roomDetailsKeys
              .filter((x) => roomKeys.includes(x[0]))
              .map((x) => x[1])

            const url = (
              searchParams.isTransfer || searchParams.isFlight
                ? cyprusHotelDetailSerializer('/cyprus/transfer', {
                    ...searchParams,
                  })
                : reservationParams('/reservation', {
                    productKey: roomGroup.key,
                    searchToken: searchParams.searchToken,
                    sessionToken: searchParams.sessionToken,
                  })
            ) as Route

            return (
              <div key={roomGroup.key}>
                {rooms.map((room) => {
                  const detail = details[0]
                  return (
                    <div key={room.key}>
                      <div>{detail.roomType}</div>
                      <div>
                        <Button component={Link} href={url}>
                          Devam
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
