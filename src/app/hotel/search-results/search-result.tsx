import { Title } from '@mantine/core'

import { SearchParams } from 'nuqs'
import { getHotelSearchResultParams } from './request-model'

type IProps = {
  searchParams: SearchParams
}

export const HotelSearchResults: React.FC<IProps> = async ({
  searchParams,
}) => {
  const hotelRequestModel = await getHotelSearchResultParams(searchParams)

  return <Title>otel aramalari</Title>
}
