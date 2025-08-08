import { Column, Heading, Img, Row } from '@react-email/components'
import {
  FlightSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import dayjs from 'dayjs'

import { Fragment } from 'react'
import { formatCurrency } from '@/libs/util'
import { EmailCard } from '@/emails/_components/email-card'
import { __dummy__flightPaymentSummaryResponseIstAms_transfer } from '../_dummy-response/flight'
import { EmailBody } from '@/emails/_components/body'

type IProps = {
  data: OperationResultType
}

export default function EmailFlightBookResult({ data }: IProps) {
  const { flightList, airlineList, airportList } = data.product
    .summaryResponse as FlightSummaryResponse

  const { passenger } = data

  return (
    <EmailBody>
      <div>
        {flightList.map((flight) => {
          return (
            <div key={flight.flightDetail.key}>
              <EmailCard
                title={
                  flight.flightDetail.groupId === 0
                    ? 'Gidiş Uçuşu'
                    : 'Dönüş Uçuşu'
                }
              >
                {flight.flightSegments.map(
                  (segment, segmentIndex, segmentArr) => {
                    return (
                      <Fragment key={segmentIndex}>
                        {segmentIndex > 0 && (
                          <Row className='bg-gray p-3'>
                            <Column align='center'>
                              {segmentIndex} Aktarma{' '}
                              {segmentArr[segmentIndex - 1].destination.code}
                            </Column>
                          </Row>
                        )}
                        <Row cellPadding={8}>
                          <Column width={1} valign='top'>
                            <Img
                              className='size-[36px]'
                              src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${segment.operatingAirline.code}_sq.jpg`}
                              alt={airlineList[segment.operatingAirline.code]}
                            />
                          </Column>
                          <Column className='text-xs' width={150} valign='top'>
                            <div>
                              {airlineList[segment.operatingAirline.code]}
                            </div>
                            <div>
                              {segment.operatingAirline.code}
                              {segment.flightNumber}
                            </div>
                            <div>{segment.freeVolatileData.BrandName}</div>
                          </Column>
                          <Column valign='top' width={200}>
                            <Heading as='h4' className='mt-0 mb-1'>
                              Kalkış ({segment.origin.code.toUpperCase()})
                            </Heading>
                            <div className='mb-1'>
                              {dayjs(segment.departureTime).format(
                                'DD.MM.YYYY, '
                              )}
                              <strong>
                                {dayjs(segment.departureTime).format('HH:mm')}
                              </strong>
                            </div>
                            <div className='text-sm'>
                              <div>
                                {airportList[segment.origin.code].city},{' '}
                                {airportList[segment.origin.code].country}
                              </div>
                              <div>
                                {
                                  airportList[segment.origin.code].value.find(
                                    (val) => val.langCode === 'tr_TR'
                                  )?.value
                                }
                              </div>
                            </div>
                          </Column>
                          <Column valign='top' width={200}>
                            <Heading as='h4' className='m-0 mb-1'>
                              Varış ({segment.destination.code.toUpperCase()})
                            </Heading>
                            <div className='mb-1'>
                              {dayjs(segment.arrivalTime).format(
                                'DD.MM.YYYY, '
                              )}

                              <strong>
                                {dayjs(segment.arrivalTime).format('HH:mm')}
                              </strong>
                            </div>
                            <div className='text-sm'>
                              <div>
                                {airportList[segment.destination.code].city},{' '}
                                {airportList[segment.destination.code].country}
                              </div>
                              <div>
                                {
                                  airportList[
                                    segment.destination.code
                                  ].value.find(
                                    (val) => val.langCode === 'tr_TR'
                                  )?.value
                                }
                              </div>
                            </div>
                          </Column>
                        </Row>
                      </Fragment>
                    )
                  }
                )}
              </EmailCard>
            </div>
          )
        })}

        <EmailCard title='Yolcu Bilgileri'>
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
        </EmailCard>
        <EmailCard title='Ödeme Bilgileri'>
          <table className='w-full' cellPadding={2}>
            <tr>
              <td width={200}>Toplam Fiyat</td>
              <td>
                {formatCurrency(passenger.paymentInformation.basketTotal)}
              </td>
            </tr>
            <tr>
              <td>Kart Numarası</td>
              <td>{passenger.paymentInformation.encryptedCardNumber}</td>
            </tr>
          </table>
        </EmailCard>
      </div>
    </EmailBody>
  )
}

EmailFlightBookResult.PreviewProps = {
  data: __dummy__flightPaymentSummaryResponseIstAms_transfer,
}
