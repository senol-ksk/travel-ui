'use client'

import {
  Alert,
  Button,
  Card,
  Modal,
  Skeleton,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { ModuleNames, ReservationFlight } from '../types'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { useRef } from 'react'
import { FlightSummary } from '@/app/reservation/(results)/callback/products/flight'
import { FlightSummaryResponse } from '@/app/reservation/types'

type IProps = {
  reservations: ReservationFlight[]
}

const productName = (type: ModuleNames): string => {
  switch (type) {
    case 'Flight':
      return 'Uçak'
    case 'CarRental':
      return 'Araç Kiralama'
    case 'Hotel':
      return 'Otel'
    case 'Tour':
      return 'Tur'
    case 'Transfer':
      return 'Transfer'
    case 'Visa':
      return 'Vize'
    default:
      return type
  }
}

export const ReservationItems: React.FC<IProps> = ({ reservations }) => {
  const [
    isDetailModalOpened,
    { open: openDetailModal, close: closeDetailModal },
  ] = useDisclosure(false)
  const shoppingFileId = useRef<ID | null>(null)

  const detailQuery = useQuery({
    enabled: !!shoppingFileId.current,
    queryKey: ['reservation-detail', shoppingFileId.current],
    queryFn: async () => {
      const response = await serviceRequest<{
        product: { summaryResponse: FlightSummaryResponse }
      }>({
        axiosOptions: {
          url: 'api/product/summary',
          params: {
            shoppingFileId: shoppingFileId.current,
          },
        },
      })

      return response
    },
  })

  const productData = detailQuery.data?.data?.product.summaryResponse

  return (
    <>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
        {reservations.map((reservation, reservationIndex) => (
          <Card
            key={reservationIndex}
            className='cursor-pointer border text-start transition-all hover:border-gray-400 hover:shadow-sm'
            component={'button'}
            type='button'
            onClick={() => {
              shoppingFileId.current = reservation.shoppingFileId
              openDetailModal()
            }}
          >
            <Title order={6} fz={'h5'}>
              {productName(reservation.productTypeName)}
            </Title>
            <div className='py-2 text-sm'>
              <div>
                Tarih: {dayjs(reservation.sellingDate).format('DD MMMM YYYY')}
              </div>
              <div>Toplam Fiyat: {formatCurrency(reservation.total)} </div>
            </div>
            <div className='flex gap-2'>
              {reservation.status === 5 && (
                <div className='text-red-800'>İptal edildi</div>
              )}
              {reservation.status === 4 && (
                <div className='text-green-800'>Onaylandı</div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Modal
        opened={isDetailModalOpened}
        onClose={closeDetailModal}
        title='Rezervasyon Detayı'
        size={'xl'}
        classNames={{
          header: 'border-b',
        }}
      >
        <div className='pt-4'>
          {detailQuery.isLoading && (
            <div className='grid gap-3'>
              <Skeleton height={30} />
              <Skeleton height={20} w={'75%'} />
              <Skeleton height={18} w={'55%'} />
            </div>
          )}
          {detailQuery.data && !detailQuery.data.success && (
            <div>
              <Alert
                color='red'
                title='Rezervasyon detaylarını alırken bir hata oluştu'
              >
                <div>Bilgilerinizi ulaşamadık.</div>
                <div className='flex justify-center pt-3'>
                  <Button
                    loading={detailQuery.isLoading || detailQuery.isFetching}
                    onClick={() => detailQuery.refetch()}
                  >
                    Tekrar Deneyin
                  </Button>
                </div>
              </Alert>
            </div>
          )}
          {productData && productData.moduleName === 'Flight' && (
            <FlightSummary data={productData as FlightSummaryResponse} />
          )}
        </div>
      </Modal>
    </>
  )
}
