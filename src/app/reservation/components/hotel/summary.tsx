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

          <div className='grid grid-cols-2 items-center rounded-md border p-3 text-sm text-gray-700'>
            <div className='flex flex-col items-center text-center'>
              <div>Giriş Tarihi</div>
              <div className='font-bold'>
                {dayjs(roomGroup.checkInDate).format('DD MMM YYYY')}
              </div>
            </div>

            <div className='relative flex flex-col items-center text-center'>
              <div className='absolute top-1/2 left-0 h-16 -translate-y-1/2 border-l border-gray-300'></div>

              <div>Çıkış Tarihi</div>
              <div className='font-bold'>
                {dayjs(roomGroup.checkOutDate).format('DD MMM YYYY')}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3 border-b pb-3 text-lg font-semibold'>
            <List type='ordered' className='list-decimal'>
              {roomGroup.rooms.map((room, roomIndex) => {
                const roomDetail = roomGroup.roomDetails[room.key]

                return <List.Item key={room.key}>Oda</List.Item>
              })}
            </List>
            {nightStay} Gece
          </div>
          <div className='grid items-center gap-3'>
            {/* <div className='flex items-center justify-between'>
              <div>Misafirler</div>
              <div className='text-sm font-semibold'>2 Yetişkin, 1 Çocuk</div>
            </div> */}
            <div className='flex items-center justify-between'>
              <div>Oda Bilgisi</div>
              <div className='text-sm font-semibold'>
                {roomGroup.rooms.map((room, roomIndex) => {
                  const roomInfo = roomGroup.roomDetails[room.key]

                  return <div key={room.key}> {roomInfo.roomType}</div>
                })}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Konsept </div>
              <div className='text-sm font-semibold'>
                {roomGroup.rooms.map((room, roomIndex) => {
                  const roomDetail = roomGroup.roomDetails[room.key]

                  return <div key={room.key}> {roomDetail.pensionType}</div>
                })}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>İptal Politikası</div>
              <div className='text-sm font-semibold'>
                {' '}
                {!data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty && (
                  <div>
                    {roomGroup.nonRefundable ? (
                      <div className='text-red'>Bu oda iptal edilemez.</div>
                    ) : (
                      <div className='text-green'>Ücretsiz iptal </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* {!data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty && (
            <div>
              {roomGroup.nonRefundable ? (
                <div className='text-red'>Bu oda iptal edilemez.</div>
              ) : (
                <div className='text-green'>Ücretsiz iptal </div>
              )}
            </div>
          )} */}
          {roomGroup.cancellationPolicies &&
            roomGroup.cancellationPolicies.length > 0 &&
            roomGroup.cancellationPolicies
              .filter((item) => item.description)
              .map((cancelPolicy, cancelPolicyIndex) => (
                <Alert
                  color='yellow'
                  key={cancelPolicyIndex}
                  className='text-sm'
                >
                  {cancelPolicy.description}
                </Alert>
              ))}
        </div>
      </CheckoutCard>
      <CheckoutCard>
        <UnstyledButton
          className='flex w-full items-center justify-between'
          onClick={togglePriceDetails}
        >
          <div className='flex items-center gap-1'>
            <span className='font-semibold'>
              {data.HotelCancelWarrantyPriceStatusModel?.couponActive
                ? 'Ön Ödeme Tutarı (%25)'
                : 'Toplam Tutar'}
            </span>
            <span className='text-xl'>
              {openedPriceDetails ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </span>
          </div>
          <div className='text-lg font-semibold'>
            {formatCurrency(summaryResponse.totalPrice)}
          </div>
        </UnstyledButton>
        <Collapse in={openedPriceDetails}>
          <div className='grid gap-2 text-sm'>
            {!data.HotelCancelWarrantyPriceStatusModel?.couponActive &&
              couponDiscountList &&
              couponDiscountList.length > 0 && (
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
                  <div className='flex items-center justify-between font-semibold'>
                    <div className='flex items-baseline gap-1'>
                      <span>Oda Fiyatı</span>
                      <small>
                        ({adults.length} Yetişkin{' '}
                        {infants.length > 0
                          ? `+ ${infants.length} Çocuk`
                          : null}
                        )
                      </small>
                    </div>
                    <div>{formatCurrency(room.totalPrice.value)}</div>
                  </div>
                </Fragment>
              )
            })}
            {!data.HotelCancelWarrantyPriceStatusModel?.couponActive &&
              !data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty && (
                <div className='mt-3 border-t pt-3'>
                  <div className='flex items-center justify-between font-semibold'>
                    <div>Toplam Fiyat</div>
                    <div>{formatCurrency(summaryResponse.totalPrice)}</div>
                  </div>
                </div>
              )}
            {data.HotelCancelWarrantyPriceStatusModel?.couponActive &&
              data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty &&
              (summaryResponse?.couponDiscountList?.at(0)?.discountPrice
                ?.value ?? 0) > 0 && (
                <>
                  <div className='border-t pt-3'>
                    <div className='flex items-center justify-between font-semibold text-green-700'>
                      <div>Ön Ödeme Tutarı (%25)</div>
                      <div>
                        {formatCurrency(
                          summaryResponse.totalPrice -
                            (roomGroup.cancelWarrantyPrice?.value || 0)
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between font-semibold text-green-700'>
                      <div>İptal ve İade Paketi</div>
                      <div>
                        {formatCurrency(
                          roomGroup.cancelWarrantyPrice?.value || 0
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between font-semibold'>
                      <div>Şimdi Ödenecek Toplam</div>
                      <div>{formatCurrency(summaryResponse.totalPrice)}</div>
                    </div>

                    <div className='flex items-center justify-between font-semibold'>
                      <div>Kalan Ödeme Tutarı</div>
                      <div>
                        {formatCurrency(
                          summaryResponse.couponDiscountList?.at(0)
                            ?.discountPrice.value ?? 0
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='mt-3 rounded-md bg-red-50 p-3'>
                    <div className='text-xs text-red-700'>
                      Kalan tutar, son tarih{' '}
                      {dayjs(roomGroup.checkInDate)
                        .subtract(4, 'days')
                        .format('DD.MM.YYYY')}{' '}
                      saate kadar ödenmelidir. Şimdi ödenecek tutar, konaklama
                      bedelinin %25&apos;inin ve varsa ek hizmetlerin bedelinin
                      toplamıdır.
                    </div>
                  </div>
                  <div className='mt-2 rounded-md bg-green-50 p-3'>
                    <div className='text-xs text-green-700'>
                      %25&apos;ini Şimdi, %75&apos;ini Tatilden Önce Öde!
                      kampanyasından faydalandınız.
                    </div>
                  </div>
                </>
              )}
          </div>
        </Collapse>
      </CheckoutCard>
    </div>
  )
}

export { HotelSummarySection }
