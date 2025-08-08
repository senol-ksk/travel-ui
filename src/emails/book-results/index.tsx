import {
  FlightSummaryResponse,
  OperationResultType,
  HotelSummaryResponse,
} from '@/app/reservation/types'

import {
  __dummy__flightPaymentSummaryResponse,
  __dummy__flightPaymentSummaryResponseIstAms_transfer,
} from './_dummy-response/flight'
import { EmailBody } from '../_components/body'
import { Column, Heading, Row, Section } from '@react-email/components'
import EmailHotelOrderResult from './hotel/hotel'

import EmailFlightBookResult from './flight/flight'
import { hotelDummyOrderResultResponse } from './_dummy-response/hotel'
import EmailTourOrderResult from './tour/transfer'
import EmailBusOrderResult from './bus/bus'
import EmailCarRentalOrderResult from './car-rental/car-rental'
import EmailTransferOrderResult from './transfer/transfer'

export default function EmailBookResult({
  data,
}: {
  data: OperationResultType
}) {
  const { moduleName } = data.product.summaryResponse

  switch (moduleName) {
    case 'Flight':
      return <EmailFlightBookResult data={data} />

    case 'Hotel':
      return <EmailHotelOrderResult data={data} />
    case 'Tour':
      return <EmailTourOrderResult data={data} />
    case 'Bus':
      return <EmailBusOrderResult data={data} />
    case 'CarRental':
      return <EmailCarRentalOrderResult data={data} />
    case 'Transfer':
      return <EmailTransferOrderResult data={data} />
    default:
      return <div>Plase choose a product</div>
      break
  }
}

EmailBookResult.PreviewProps = {
  data: {
    product: {
      summaryResponse: {
        moduleName: '',
      },
    },
  },
}
