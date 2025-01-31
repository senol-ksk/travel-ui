import { Title } from '@mantine/core'
import dayjs from 'dayjs'

import { HotelSummaryResponse } from '../../type'

type IProps = {
  data: HotelSummaryResponse
}

const HotelSummary: React.FC<IProps> = ({ data }) => {
  const { hotel, checkInDate, checkOutDate } = data.roomGroup

  return (
    <div>
      {/* <input defaultValue={JSON.stringify(data)} /> */}
      <Title order={1} fz={'h4'}>
        {hotel.name}
      </Title>
      {dayjs(checkInDate).format('DD MMMM YYYY')}-
      {dayjs(checkOutDate).format('DD MMMM YYYY')}
    </div>
  )
}

export { HotelSummary }
