import { HotelSummaryResponse } from '@/app/reservation/types'
import { hotelDummyOrderResultResponse } from '../_dummy-response/hotel'

type IProps = {
  data: HotelSummaryResponse
}

export default function EmailHotelOrderResult({ data }: IProps) {
  return <div>{data.roomGroup.hotel.name}</div>
}

EmailHotelOrderResult.PreviewProps = {
  data: hotelDummyOrderResultResponse,
}
