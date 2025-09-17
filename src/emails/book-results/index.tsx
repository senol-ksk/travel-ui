import { OperationResultType } from '@/app/reservation/types'

import { __dummy__flightPaymentSummaryResponse } from './_dummy-response/flight'
import EmailHotelOrderResult from './hotel/hotel'

import EmailFlightBookResult from './flight/flight'
import EmailTourOrderResult from './tour/tour'
import EmailBusOrderResult from './bus/bus'
import EmailCarRentalOrderResult from './car-rental/car-rental'
import EmailTransferOrderResult from './transfer/transfer'
import EmailCyprusPackageBookResult from './cyprusPackage/cyprus-package'

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
    case 'CyprusPackage':
      return <EmailCyprusPackageBookResult data={data} />
    default:
      return <div>Plase choose a product</div>
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
