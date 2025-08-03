import {
  FlightSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import EmailFlightBookResult from './flight/flight'
import {
  __dummy__flightPaymentSummaryResponse,
  __dummy__flightPaymentSummaryResponseIstAms_transfer,
} from './_dummy-response/flight'
import { EmailBody } from '../_components/body'
import { Column, Heading, Row, Section } from '@react-email/components'

export default function EmailBookResult({
  data,
}: {
  data: OperationResultType
}) {
  const moduleName = data.product.summaryResponse.moduleName

  return (
    <EmailBody>
      {(() => {
        switch (moduleName) {
          case 'Flight':
            return (
              <EmailFlightBookResult
                data={data.product.summaryResponse as FlightSummaryResponse}
              />
            )

          default:
            break
        }
      })()}
      <Section className='border-gray mb-4 rounded-lg border border-solid'>
        <Heading
          as='h3'
          className='border-b-gray m-0 border-0 border-b border-solid p-3 text-base'
        >
          Yolcu Bilgileri
        </Heading>

        <div className='p-3'>
          <Row cellPadding={6}>
            <thead className='text-xs font-bold'>
              <tr>
                <Column>ADI SOYADI</Column>
                <Column>E-BİLET NO.</Column>
                <Column>PNR </Column>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {data.passenger.passengers.map(
                ({ fullName, identityNumber, bookingCode, ...passenger }) => {
                  return (
                    <tr key={identityNumber}>
                      <Column>{fullName}</Column>
                      <Column>
                        <div>{passenger.eTicketNumber}</div>
                      </Column>
                      <Column>
                        <div>{bookingCode}</div>
                      </Column>
                    </tr>
                  )
                }
              )}
            </tbody>
          </Row>
        </div>
      </Section>
      <div>odeme bilgileri</div>
    </EmailBody>
  )
}

EmailBookResult.PreviewProps = {
  data: __dummy__flightPaymentSummaryResponseIstAms_transfer,
}
