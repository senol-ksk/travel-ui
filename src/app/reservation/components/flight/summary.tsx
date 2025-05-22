import { upperFirst, useDisclosure } from '@mantine/hooks'
import { Collapse, Title, UnstyledButton } from '@mantine/core'

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdTransferWithinAStation,
} from 'react-icons/md'
import { FaArrowRightLong } from 'react-icons/fa6'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(duration)

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
import NumberFlow from '@number-flow/react'
import { IoAirplaneSharp } from 'react-icons/io5'
import { FlightTransferSummary } from './transfer'

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
        <div className='grid gap-4 text-sm'>
          {flightData.flightList
            .sort((a, b) => a.flightDetail.groupId - b.flightDetail.groupId)
            .map((flightItem) => {
              const { flightDetail, flightSegments } = flightItem

              const flightSegmentsFirstItem = flightSegments[0]
              const flightSegmentsLastItem = flightSegments.at(
                -1
              ) as typeof flightSegmentsFirstItem
              const hasTransfer = flightSegments.length > 1
              const firstDepartureTime = dayjs(
                flightSegmentsFirstItem.departureTime
              )
              const lastArrivalTime = dayjs(flightSegmentsLastItem?.arrivalTime)
              const totalFlightDuration = dayjs.duration(
                lastArrivalTime.diff(firstDepartureTime)
              )

              return (
                <div key={flightDetail.key} className='grid gap-1'>
                  <Title order={5}>
                    {flightDetail.groupId === 0 ? 'Gidiş' : 'Dönüş'}
                  </Title>
                  <div className='flex gap-2'>
                    <div className='leading-none'>
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
                      {airlines[flightSegmentsFirstItem.marketingAirline.code]}
                      {' - '}
                      {flightSegmentsFirstItem.flightNumber}
                      {' - '}
                      {upperFirst(
                        (
                          flightDetail.freeVolatileData?.BrandName ??
                          flightDetail.freeVolatileData?.brandname
                        )?.toLowerCase() ?? ''
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>
                      {firstDepartureTime.format('HH:mm')}
                      {' - '}
                      {lastArrivalTime.format('HH:mm')}
                    </strong>{' '}
                    {lastArrivalTime.format('DD MMMM YYYY dddd')} (
                    {totalFlightDuration.format('H')}s{' '}
                    {totalFlightDuration.format('mm')}dk)
                  </div>
                  <div className='flex items-center gap-2'>
                    <div>
                      {airports[flightSegmentsFirstItem.origin.code].city} (
                      {flightSegmentsFirstItem.origin.code})
                    </div>
                    <div>
                      <IoAirplaneSharp />
                    </div>
                    <div>
                      {airports[flightSegmentsLastItem?.destination.code].city}(
                      {flightSegmentsLastItem?.destination.code})
                    </div>
                  </div>
                  {hasTransfer && (
                    <FlightTransferSummary flightSegments={flightSegments} />
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
            <NumberFlow
              className='pt-1 text-lg font-semibold'
              format={{
                style: 'currency',
                currency: 'TRY',
                currencyDisplay: 'narrowSymbol',
              }}
              value={flightData.totalPrice}
            />
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
