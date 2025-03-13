import { useDisclosure } from '@mantine/hooks'
import { Collapse, UnstyledButton } from '@mantine/core'

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdTransferWithinAStation,
} from 'react-icons/md'
import { FaArrowRightLong } from 'react-icons/fa6'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
  FlightPassengerTypes,
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { AirlineLogo } from '@/components/airline-logo'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'

const FlightSummary: React.FC<IProps> = ({ data }) => {
  const [openedPriceDetails, { toggle: togglePriceDetails }] =
    useDisclosure(false)

  const flightData = data.SummaryViewDataResponser
    .summaryResponse as FlightReservationSummary
  const airlines = flightData.airlineList
  const airports = flightData.airportList
  const fareInfo = flightData.flightFareInfo
  const { passengerPrices } = fareInfo
  const serviceCharge = passengerPrices.reduce((a, b) => {
    return a + b.unitFee.price.value * b.passengers.length
  }, 0)

  const { couponDiscountList } = flightData

  return (
    <div className='grid gap-5'>
      <CheckoutCard>
        <div className='grid gap-3'>
          {flightData.flightList
            .sort((a, b) => a.flightDetail.groupId - b.flightDetail.groupId)
            .map((flightItem) => {
              const flightSegments = flightItem.flightSegments
              const flightSegmentsFirstItem = flightSegments[0]
              const flightSegmentsLastItem = flightSegments.at(
                -1
              ) as typeof flightSegmentsFirstItem
              const hasTransfer = flightSegments.length > 1
              const transferCount = flightSegments.length - 1

              const flightFareInfo = flightItem.flightFareInfo

              return (
                <div key={flightItem.flightDetail.key} className='grid gap-1'>
                  <div className='flex gap-2'>
                    <div>
                      <AirlineLogo
                        airlineCode={
                          flightSegmentsFirstItem.marketingAirline.code
                        }
                        alt={
                          airlines[
                            flightSegmentsFirstItem.marketingAirline.code
                          ]
                        }
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <div>
                        {
                          airlines[
                            flightSegmentsFirstItem.marketingAirline.code
                          ]
                        }
                      </div>
                      <small>{flightSegmentsFirstItem.flightNumber}</small>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 font-semibold'>
                    <div>
                      {airports[flightSegmentsFirstItem.origin.code].city}{' '}
                      <small>({flightSegmentsFirstItem.origin.code})</small>
                    </div>
                    <div>
                      <FaArrowRightLong size={20} />
                    </div>
                    <div>
                      {airports[flightSegmentsLastItem?.destination.code].city}
                      <small>
                        ({flightSegmentsLastItem?.destination.code})
                      </small>
                    </div>
                  </div>
                  <div className='text-sm'>
                    {dayjs(flightSegmentsFirstItem.departureTime).format(
                      'DD MMMM dddd YYYY HH:mm'
                    )}
                  </div>
                  <div className='text-sm'>
                    {dayjs(flightSegmentsLastItem?.arrivalTime).format(
                      'DD MMMM dddd YYYY HH:mm'
                    )}
                  </div>
                  {hasTransfer && (
                    <div className='mt-2 rounded-md border border-yellow-300 bg-yellow-100 p-2 text-sm'>
                      <div className='pb-2 font-semibold'>
                        <div className='flex items-center gap-2'>
                          <div>
                            <MdTransferWithinAStation size={20} />
                          </div>
                          <div>{transferCount} Aktarma</div>
                        </div>
                      </div>
                      <div>
                        {flightSegments.map(
                          (segment, segmentIndex, segmentArr) => {
                            const prevSegment = segmentArr[segmentIndex]
                            const prevDepartureTime = dayjs(
                              prevSegment.departureTime
                            )
                            const prevArrivalTime = dayjs(
                              prevSegment.arrivalTime
                            )
                            const departureTime = dayjs(segment.departureTime)
                            const arrivalTime = dayjs(segment.arrivalTime)
                            const transferDuration = prevArrivalTime.to(
                              departureTime,
                              true
                            )

                            if (segmentIndex === 0) return

                            return (
                              <div key={segment.key} className='grid gap-2'>
                                <div className='flex items-center gap-3'>
                                  {transferCount > 1 && (
                                    <div>{segmentIndex}. Aktarma</div>
                                  )}

                                  <div>
                                    <strong>Bekleme Süresi:</strong>{' '}
                                    {transferDuration}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </CheckoutCard>
      <CheckoutCard>
        <UnstyledButton
          className='flex w-full items-center justify-between'
          onClick={togglePriceDetails}
        >
          <div className='flex items-center gap-1'>
            <span>Toplam Tutar</span>
            <span className='text-3xl'>
              {openedPriceDetails ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </span>
          </div>
          <div className='text-lg font-semibold'>
            {formatCurrency(flightData.totalPrice)}
          </div>
        </UnstyledButton>
        <Collapse in={openedPriceDetails}>
          <div className='grid gap-2 pt-3 text-sm'>
            {couponDiscountList && couponDiscountList.length > 0 && (
              <div className='flex items-center justify-between font-semibold text-green-700'>
                <div>İndirim Kuponu</div>
                <div>
                  -
                  {formatCurrency(
                    couponDiscountList?.at(0)?.discountPrice.value ?? 0
                  )}
                </div>
              </div>
            )}
            <div>
              <div className='flex items-center justify-between font-semibold'>
                <div>Uçuş Ücreti</div>
                <div>{formatCurrency(fareInfo.basePrice.value)}</div>
              </div>
              <div className='pt-1'>
                {passengerPrices.map((passengerPrice, passengerPriceIndex) => (
                  <div
                    key={passengerPriceIndex}
                    className='flex items-center justify-between ps-2'
                  >
                    <div>
                      {
                        FlightPassengerTypes[
                          passengerPrice.passengers[0].passengerType
                        ]
                      }
                    </div>
                    <div className='flex justify-end gap-1'>
                      <span>{passengerPrice.passengers.length} </span>
                      <span>x</span>
                      <span>
                        {formatCurrency(passengerPrice.unitBasePrice.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between font-semibold'>
                <div>Vergiler</div>
                <div>{formatCurrency(fareInfo.taxes.value)}</div>
              </div>
              <div className='pt-1'>
                {passengerPrices.map((passengerPrice, passengerPriceIndex) => (
                  <div
                    key={passengerPriceIndex}
                    className='flex items-center justify-between ps-2'
                  >
                    <div>
                      {
                        FlightPassengerTypes[
                          passengerPrice.passengers[0].passengerType
                        ]
                      }
                    </div>
                    <div className='flex justify-end gap-1'>
                      <span>{passengerPrice.passengers.length} </span>
                      <span>x</span>
                      <span>
                        {formatCurrency(passengerPrice.unitTax.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between font-semibold'>
                <div>Hizmet Bedeli</div>
                <div>{formatCurrency(serviceCharge)}</div>
              </div>
              <div className='pt-1'>
                {passengerPrices.map((passengerPrice, passengerPriceIndex) => (
                  <div
                    key={passengerPriceIndex}
                    className='flex items-center justify-between ps-2'
                  >
                    <div>
                      {
                        FlightPassengerTypes[
                          passengerPrice.passengers[0].passengerType
                        ]
                      }
                    </div>
                    <div className='flex justify-end gap-1'>
                      <span>{passengerPrice.passengers.length} </span>
                      <span>x</span>
                      <span>
                        {formatCurrency(passengerPrice.unitFee.price.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapse>
      </CheckoutCard>
    </div>
  )
}

export { FlightSummary }
