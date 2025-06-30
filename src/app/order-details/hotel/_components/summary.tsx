'use client'

import {
  HotelBookingDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { formatCurrency } from '@/libs/util'
import { serviceRequest } from '@/network'
import { Alert, Button, Container, Image, Skeleton, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'
import dayjsLocale from 'dayjs/locale/tr'
dayjs.locale(dayjsLocale)

import { IoInformationCircle } from 'react-icons/io5'

export const HotelBookingSummary = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookingDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response =
        await serviceRequest<OperationResultWithBookingCodeResponse>({
          axiosOptions: {
            url: 'api/product/handleOperationResultWithBookingCode',
            params: searchParams,
          },
        })
      return response
    },
  })

  if (!bookingDetailsDataQuery.data && bookingDetailsDataQuery.isLoading)
    return (
      <Container py={30} display={'grid'} className='gap-3' maw={700}>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </Container>
    )

  if (!bookingDetailsDataQuery.data) return <div>Sonuç bulunamadı</div>

  const dataViewResponsers = bookingDetailsDataQuery.data?.data
    ?.productDataViewResponser
    .dataViewResponsers as HotelBookingDetailApiResponse
  const productDataViewResponser =
    dataViewResponsers[1]?.operationResultViewData
  const summaryViewDataResponserForHotel = dataViewResponsers[0]
  const insuranceFee =
    summaryViewDataResponserForHotel.summaryResponse.roomGroup
      .cancelWarrantyPrice.value ?? 0

  const hotelDataSummaryData = dataViewResponsers[0].summaryResponse
  const roomGroup = hotelDataSummaryData.roomGroup

  return (
    <Container
      maw={700}
      py={{
        base: 'md',
        md: 'xl',
      }}
      className='grid gap-3 md:gap-5'
    >
      <div>
        <Alert
          variant='light'
          color='red'
          title='Ön Ödeme Bilgilendirmesi'
          icon={<IoInformationCircle />}
        >
          Rezervasyonunuzun %25 olan:{' '}
          <strong>
            {formatCurrency(
              productDataViewResponser?.paymentInformation?.basketTotal -
                productDataViewResponser.paymentInformation
                  .basketDiscountTotal -
                insuranceFee
            )}
          </strong>{' '}
          ve güvence paketi olan {formatCurrency(insuranceFee)} tahsil
          edilmiştir. Kalan{' '}
          <strong>
            {formatCurrency(
              productDataViewResponser.paymentInformation.basketDiscountTotal
            )}
          </strong>{' '}
          lik tutarı, otele giriş gününüze 4 gün kalaya (
          {dayjs(
            summaryViewDataResponserForHotel.summaryResponse.roomGroup
              .checkInDate
          )
            .subtract(4, 'days')
            .format('DD MMMM YYYY')}
          ) kadar, rezervasyonlarım sayfasına giderek tamamlayabilirsiniz.
          Kampanya veya fiyat değişikliği olması halinde kalan tutar sabit
          kalacak ve değişmeyecektir. Kalan tutarı taksitli ödemek isterseniz,
          ödeme yaptığınız günkü taksitli ödeme koşulları baz alınacaktır.
        </Alert>
      </div>
      <div className='grid gap-6 rounded-md border p-3 md:grid-cols-3 md:p-5'>
        <div className='col-span-1'>
          <Image
            src={roomGroup.hotel.images?.at(0)?.original}
            fallbackSrc={'/default-room.jpg'}
            alt=''
            radius={'md'}
          />
        </div>
        <div className='col-span-2'>
          <div>
            <Title fz={'h3'}>{roomGroup.hotel.name}</Title>
            <div>
              {roomGroup.hotel.address
                ? roomGroup.hotel.address
                : roomGroup.hotel.destination}
            </div>
          </div>
          <div className='pt-4'>
            <div className='flex gap-1'>
              <div className='font-semibold'>Giriş:</div> 
              <div>
                {dayjs(roomGroup.checkInDate).format('DD MMMM dddd YYYY')}
              </div>
            </div>
            <div className='flex gap-1'>
              <div className='font-semibold'>Çıkış:</div> 
              <div>
                {dayjs(roomGroup.checkOutDate).format('DD MMMM dddd YYYY')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='grid gap-6 rounded-md border p-3 md:p-5'>
        {roomGroup.rooms.map((room, roomIndex) => {
          const roomDetail = roomGroup.roomDetails[roomGroup.hotelKey]
          const guestCount = roomGroup.passengerPrices.length
          const roomInfo = [
            `${guestCount} Misafir`,
            roomDetail.description,
            ,
            roomDetail.bedType,
            roomDetail.roomType,
          ]

          return (
            <div key={roomIndex} className='grid gap-3'>
              <Title order={3} fz={'h4'} className='border-b pb-2'>
                {roomIndex + 1}. Oda Bilgileri
              </Title>
              {roomInfo.filter(Boolean).toLocaleString()}
              {/* <div>
                İptal Politikası:{' '}
                <b className='text-green-800'>İptal Edilebilir</b>
              </div> */}

              {roomGroup.cancellationPolicies.length > 0 && (
                <div className='grid gap-3'>
                  {roomGroup.cancellationPolicies.map(
                    (cancelPolicy, cancelPolicyIndex) => {
                      return (
                        <div key={cancelPolicyIndex}>
                          <Alert>{cancelPolicy.description}</Alert>
                        </div>
                      )
                    }
                  )}
                </div>
              )}

              {roomGroup.cancellationPolicy && (
                <div>
                  <Alert color='green'> {roomGroup.cancellationPolicy}</Alert>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='grid gap-6 rounded-md border p-3 md:p-5'>
        <div className='max-w-lg'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <strong>Toplam</strong>
            </div>
            <div>
              {formatCurrency(
                productDataViewResponser.paymentInformation.basketTotal
              )}
            </div>

            <div>
              <strong>Toplam Tahsil Edilen</strong>
            </div>
            <div>
              {formatCurrency(
                productDataViewResponser.paymentInformation.basketTotal -
                  productDataViewResponser.paymentInformation
                    .basketDiscountTotal,
                productDataViewResponser.paymentInformation.sellingCurrency
              )}
            </div>

            <div>
              <strong>Son Ödeme Tarihi</strong>
            </div>
            <div>
              {dayjs(roomGroup.checkInDate)
                .subtract(4, 'days')
                .format('DD MMMM YYYY')}
            </div>

            <div>
              <strong>Ödenecek Tutar</strong>
            </div>
            <div>
              {formatCurrency(
                productDataViewResponser.paymentInformation.basketDiscountTotal
              )}
            </div>
          </div>
        </div>
        <div>
          <Button>Ödeme Yap</Button>
        </div>
      </div>
    </Container>
  )
}
