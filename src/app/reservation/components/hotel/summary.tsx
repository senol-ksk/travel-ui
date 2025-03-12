import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import {
  HotelGenderEnums,
  HotelSummaryResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import {
  Alert,
  Collapse,
  Image,
  List,
  Skeleton,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { Fragment, useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const HotelSummarySection: React.FC<IProps> = ({ data }) => {
  const [openedPriceDetails, { toggle: togglePriceDetails }] =
    useDisclosure(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const summaryResponse = data.SummaryViewDataResponser
    .summaryResponse as HotelSummaryResponse

  const roomGroup = summaryResponse.roomGroup
  const { passengerPrices } = roomGroup
  const passengers = passengerPrices.flatMap(
    (passenger) => passenger.passengers
  )

  const hotel = roomGroup.hotel
  const checkInDate = dayjs(roomGroup.checkInDate)
  const checkOutDate = dayjs(roomGroup.checkOutDate)
  const nightStay = checkOutDate.diff(checkInDate, 'd')

  const { couponDiscountList } = summaryResponse

  return (
    <div className='grid gap-3'>
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
            {formatCurrency(
              data.SummaryViewDataResponser.summaryResponse.totalPrice
            )}
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

            {roomGroup.rooms.map((room, roomIndex, roomGroupArr) => {
              const adults = passengers.filter((passenger) => {
                return (
                  room.passengerKeys.includes(passenger.key) &&
                  passenger.passengerType === HotelGenderEnums.Adult
                )
              })
              const infants = passengers.filter((passenger) => {
                return (
                  room.passengerKeys.includes(passenger.key) &&
                  passenger.passengerType === HotelGenderEnums.Infant
                )
              })

              return (
                <Fragment key={roomIndex}>
                  <div className='flex items-center justify-between font-semibold'>
                    <div>{roomIndex + 1}. Oda Bilgisi</div>
                    <div>{nightStay} Gece</div>
                  </div>
                  <div className='flex items-center justify-between ps-4 font-semibold'>
                    <div className='flex items-baseline gap-1'>
                      <span>Oda Fiyatı</span>
                      <small>
                        ({adults.length} Yetişkin{' '}
                        {infants.length > 0
                          ? `+ ${infants.length} Çocuk`
                          : null}
                        )
                      </small>{' '}
                    </div>
                    <div>{formatCurrency(room.totalPrice.value)}</div>
                  </div>
                </Fragment>
              )
            })}
          </div>
        </Collapse>
      </CheckoutCard>
      <CheckoutCard>
        <div className='grid gap-3'>
          <div className='relative h-[200px]'>
            <Skeleton
              pos={'absolute'}
              top={0}
              bottom={0}
              width={'100%'}
              visible={isImageLoading}
            />
            <Image
              src={hotel.images.at(0)?.original}
              alt={hotel.name}
              h={'100%'}
              radius={'md'}
              onLoad={() => {
                setIsImageLoading(false)
              }}
            />
          </div>
          <div>
            <Title order={3} fz='h4'>
              {hotel.name}
            </Title>
            <address className='text-sm text-gray-600 not-italic'>
              {hotel.address}
            </address>
          </div>

          <div className='text-sm text-gray-700'>
            <div className='flex gap-2'>
              <div className='font-semibold'>Giriş Tarihi:</div>
              <div>{dayjs(roomGroup.checkInDate).format('DD.MM.YYYY')}</div>
            </div>
            <div className='flex gap-2'>
              <div className='font-semibold'>Çıkış Tarihi:</div>
              <div>{dayjs(roomGroup.checkOutDate).format('DD.MM.YYYY')}</div>
            </div>
            <div className='pt-2'>{nightStay} Gece</div>
          </div>
          <div className='text-sm'>
            <List type='ordered' className='list-decimal text-sm'>
              {roomGroup.rooms.map((room, roomIndex) => {
                const roomDetail = roomGroup.roomDetails[room.key]

                return (
                  <List.Item key={room.key}>
                    Oda: {roomDetail.pensionType}
                  </List.Item>
                )
              })}
            </List>
          </div>
          {!data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty && (
            <div>
              {roomGroup.nonRefundable ? (
                <div className='text-red-500'>Bu oda iptal edilemez.</div>
              ) : (
                <div className='text-green-500'>Ücretsiz iptal </div>
              )}
            </div>
          )}
          {roomGroup.cancellationPolicies &&
            roomGroup.cancellationPolicies.length > 0 &&
            roomGroup.cancellationPolicies.map(
              (cancelPolicy, cancelPolicyIndex) => (
                <Alert
                  color='yellow'
                  key={cancelPolicyIndex}
                  className='text-sm'
                >
                  {cancelPolicy.description}
                </Alert>
              )
            )}
        </div>
      </CheckoutCard>
    </div>
  )
}

export { HotelSummarySection }
