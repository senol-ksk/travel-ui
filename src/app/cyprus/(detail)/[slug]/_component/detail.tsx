import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { olRequest, serviceRequest } from '@/network'
import { Container, Title } from '@mantine/core'
import { notFound } from 'next/navigation'

type IProps = {
  slug: string
  productKey: string
  searchToken: string
  sessionToken: string
  checkInDate: Date | null
  checkOutDate: Date | null
}

export const CyprusHotelDetail: React.FC<IProps> = async ({
  slug,
  searchToken,
  sessionToken,
  productKey,
  checkInDate,
  checkOutDate,
}) => {
  const detailData = await olRequest<CyprusHotelDetailApiResponse>({
    data: {
      params: {
        sessionToken,
        productKey,
        searchToken,
        slug,
        checkInDate: checkInDate?.toISOString(),
        checkOutDate: checkOutDate?.toISOString(),
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
  if (!detailData?.data && !detailData?.data.hotelDetailResponse) {
    notFound()
  }

  return (
    <div className='pt-4'>
      <Container>
        <Title fz='h2'>
          {detailData?.data?.hotelDetailResponse?.hotelInfo.hotel.name}
        </Title>
      </Container>
    </div>
  )
}
