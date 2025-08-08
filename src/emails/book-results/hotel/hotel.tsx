import {
  HotelSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { hotelDummyOrderResultResponse } from '../_dummy-response/hotel'
import { EmailBody } from '@/emails/_components/body'

type IProps = {
  data: OperationResultType
}

export default function EmailHotelOrderResult({ data }: IProps) {
  const { roomGroup } = data.product.summaryResponse as HotelSummaryResponse
  return <EmailBody>{roomGroup.hotel.name}</EmailBody>
}

EmailHotelOrderResult.PreviewProps = {
  data: hotelDummyOrderResultResponse,
}
