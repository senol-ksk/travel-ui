import { Column, Heading, Img, Row, Section } from '@react-email/components'
import { FlightSummaryResponse } from '@/app/reservation/types'
import dayjs from 'dayjs'

import { Fragment } from 'react'

type IProps = {
  data: FlightSummaryResponse
}

export default function EmailFlightBookResult({ data }: IProps) {
  return data.flightList.map((flight) => {
    return (
      <div key={flight.flightDetail.key}>
        <Section className='border-gray mb-4 rounded-lg border border-solid'>
          <Row className='border-bottom border-gray border-solid p-3'>
            <Column>
              <Heading as='h3' className='m-0 text-base'>
                {flight.flightDetail.groupId === 0
                  ? 'Gidiş Uçuşu'
                  : 'Dönüş Uçuşu'}
              </Heading>
            </Column>
          </Row>
          {flight.flightSegments.map((segment, segmentIndex, segmentArr) => {
            const hasTransferPoint = segmentArr.length > 1
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
                <Row
                  className='border-gray mb-2 border-1 border-t border-solid p-3'
                  cellPadding={8}
                >
                  <Column width={1} valign='top'>
                    <Img
                      className='size-[36px]'
                      src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${segment.operatingAirline.code}_sq.jpg`}
                      alt={data.airlineList[segment.operatingAirline.code]}
                    />
                  </Column>
                  <Column className='text-xs' width={150} valign='top'>
                    <div>{data.airlineList[segment.operatingAirline.code]}</div>
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
                      {dayjs(segment.departureTime).format('DD.MM.YYYY, ')}
                      <strong>
                        {dayjs(segment.departureTime).format('HH:mm')}
                      </strong>
                    </div>
                    <div className='text-sm'>
                      <div>
                        {data.airportList[segment.origin.code].city},{' '}
                        {data.airportList[segment.origin.code].country}
                      </div>
                      <div>
                        {
                          data.airportList[segment.origin.code].value.find(
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
                      {dayjs(segment.arrivalTime).format('DD.MM.YYYY, ')}

                      <strong>
                        {dayjs(segment.arrivalTime).format('HH:mm')}
                      </strong>
                    </div>
                    <div className='text-sm'>
                      <div>
                        {data.airportList[segment.destination.code].city},{' '}
                        {data.airportList[segment.destination.code].country}
                      </div>
                      <div>
                        {
                          data.airportList[segment.destination.code].value.find(
                            (val) => val.langCode === 'tr_TR'
                          )?.value
                        }
                      </div>
                    </div>
                  </Column>
                </Row>
              </Fragment>
            )
          })}
        </Section>
      </div>
    )
  })
}
