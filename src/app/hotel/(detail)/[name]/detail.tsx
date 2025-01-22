'use client'

import {
  Alert,
  AspectRatio,
  Button,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  Skeleton,
  Title,
} from '@mantine/core'
import { useHotelDataQuery } from '../detailDataQuery'
import { HotelDetailSkeleton } from './skeletonLoader'
import { HotelRoom } from './room'
import { Fragment, useRef } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'
import { createSerializer } from 'nuqs'
import { reservationParsers } from '@/app/reservation/searchParams'
import { useRouter } from 'next/navigation'
import { HotelDetailRoomItem } from '../../types'
import { InstallmentTable } from './installment'

const HotelDetailSection = () => {
  const selectedRoomProductKey = useRef('')
  const router = useRouter()
  const {
    hotelDetailQuery,
    roomInstallmentQuery,
    roomsQuery,
    selectedRoomMutaion,
    searchParams,
  } = useHotelDataQuery()
  const [
    roomStateModalOpened,
    { open: openRoomStateModal, close: closeRoomStateModal },
  ] = useDisclosure(false)

  const [
    installmentTableOpened,
    { open: openInstallmentTable, close: closeInstallmentTable },
  ] = useDisclosure(false)
  const [
    roomStateLoadingOverlayVisible,
    { close: closeRoomStateOverlayVisible, open: openRoomStateOverlayVisible },
  ] = useDisclosure(false)
  const selectedRoomPrice = useRef(0)

  const hotelDetailData = hotelDetailQuery.data
  const hotelInfo = hotelDetailData?.data?.hotelDetailResponse?.hotelInfo
  const hotel = hotelInfo?.hotel

  const handleRoomSelect = async ({
    productKey,
    cancelWarranty,
  }: {
    productKey: string
    cancelWarranty: boolean
  }) => {
    openRoomStateOverlayVisible()
    const roomStatus = await selectedRoomMutaion.mutateAsync({
      productKey,
      cancelWarranty,
    })

    if (!roomStatus?.data) return

    selectedRoomProductKey.current = roomStatus?.data?.productKey
    if (
      Array.isArray(roomStatus?.data?.status) &&
      roomStatus?.data?.status?.length > 0
    ) {
      closeRoomStateOverlayVisible()
      openRoomStateModal()
    } else {
      handleReservation()
    }
  }

  const installmentTableData = useRef(roomInstallmentQuery.data?.data)
  const handleInstallment = async (roomGroup: HotelDetailRoomItem) => {
    openInstallmentTable()

    if (!installmentTableData.current) {
      const tableResponse = await roomInstallmentQuery.mutateAsync({
        countryCode: hotel?.country_code || 'tr',
      })
      installmentTableData.current = tableResponse?.data
    }
    const cancelWarrantyPrice = roomGroup.cancelWarrantyPrice.value
    const totalPrice = roomGroup.totalPrice.value
    const totalPriceWithCancelWarranty = totalPrice + cancelWarrantyPrice

    if (installmentTableData?.current) {
      selectedRoomPrice.current = roomGroup.useCancelWarranty
        ? totalPriceWithCancelWarranty
        : totalPrice
    }
  }

  const handleReservation = () => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey: selectedRoomProductKey.current,
      searchToken: searchParams.searchToken,
      sessionToken: searchParams.sessionToken,
    })

    router.push(url)
  }

  if (!hotelDetailData && hotelDetailQuery.isLoading) {
    return <HotelDetailSkeleton />
  }

  if (!hotel || !hotelDetailData?.success) {
    return <div>Error or Something happened bad</div>
  }
  return (
    <>
      <div className='grid gap-3 p-2 py-4 @container 2xl:container lg:gap-5'>
        <Title size={'xl'}>{hotel.name}</Title>
        {hotel.documents.length > 0 && (
          <div className='text-sm'>
            <span>
              Kültür ve Turizm Bakanlığı - Kısmı Turizm İşletme Belgesi:{' '}
            </span>
            <strong>{hotel.documents.at(0)?.no}</strong>
          </div>
        )}
        <div>
          <AspectRatio ratio={1080 / 720} maw={300}>
            <Image src={hotel.images.at(0)?.original} alt={hotel.name} />
          </AspectRatio>
        </div>
        <div className='grid gap-3 @4xl:grid-cols-7'>
          <div className='grid gap-3 @lg:gap-5 @4xl:col-span-5'>
            <Title order={2} size={'lg'}>
              Odanızı Seçin
            </Title>
            <div className='relative grid gap-3 @lg:gap-5'>
              {(roomsQuery.isLoading ||
                roomsQuery.data?.pages.at(0) === null) && (
                <div>
                  <div className='text-center text-gray-500'>
                    Odalar yükleniyor
                  </div>
                  <div className='flex gap-2 rounded border p-2'>
                    <Skeleton h={120} radius={'md'} />
                    <Skeleton h={120} radius={'md'} />
                    <Skeleton h={120} radius={'md'} />
                  </div>
                </div>
              )}
              {roomsQuery?.data?.pages.length === 0 && (
                <div>
                  <Alert color='red' title='Oda Sonçları Bulunamadı'>
                    Oda kalmamış veya bir hata oldu. Tekrar deneyeniz.
                  </Alert>
                </div>
              )}
              {roomsQuery.data?.pages.map((page) => {
                const roomDetails = page?.data?.hotelDetailResponse?.roomDetails
                const roomGroups = page?.data?.hotelDetailResponse?.items

                if (!roomDetails || !roomGroups?.length) {
                  return null
                }

                return roomGroups?.map((roomGroup) => {
                  return (
                    <div key={roomGroup.key}>
                      <HotelRoom
                        roomGroup={roomGroup}
                        roomDetails={roomDetails}
                        onSelect={(selectedRoomGroup) => {
                          handleRoomSelect({
                            productKey: roomGroup.key,
                            cancelWarranty: selectedRoomGroup.useCancelWarranty,
                          })
                        }}
                        onInstallmentClick={(selectedRoomGroup) => {
                          console.log(selectedRoomGroup)
                          handleInstallment(selectedRoomGroup)
                        }}
                      />
                    </div>
                  )
                })
              })}
              {roomsQuery.hasNextPage && (
                <div className='flex justify-center'>
                  <Button
                    type='button'
                    loading={roomsQuery.isFetchingNextPage}
                    onClick={() => {
                      roomsQuery.fetchNextPage()
                    }}
                  >
                    Daha Fazla Oda Göster
                  </Button>
                </div>
              )}
              <LoadingOverlay
                visible={roomStateLoadingOverlayVisible}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />
            </div>
            <div>
              <Title order={5}>İletişim Bilgileri</Title>
              <address>
                {hotel.address}
                <div>
                  <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
                </div>
                <div>
                  <a href={`tel:${hotel.phone}`}>{hotel.phone}</a>
                </div>
              </address>
            </div>
          </div>
          <div className='@4xl:col-span-2'>Side section</div>
        </div>
      </div>
      <Modal
        opened={roomStateModalOpened}
        onClose={closeRoomStateModal}
        title='Otel Mesajı'
      >
        <div>
          {selectedRoomMutaion.data?.data?.status.length &&
            selectedRoomMutaion.data?.data?.status.map(
              (roomStatus, roomStatusIndex) => {
                return (
                  <div key={roomStatusIndex}>
                    <Title order={4} className='pb-3'>
                      {roomStatus.message}
                    </Title>
                    {roomStatus.type === 1 && roomStatus.confirmed && (
                      <div className='grid gap-2'>
                        <div>
                          Eski fiyat {formatCurrency(roomStatus.oldPrice.value)}
                        </div>
                        <div>
                          Yeni fiyat{' '}
                          <span className='font-semibold'>
                            {formatCurrency(roomStatus.price.value)}
                          </span>
                        </div>
                      </div>
                    )}

                    {roomStatus.type === 3 && roomStatus.confirmed && (
                      <div className=''>
                        <div>
                          Eski iptal politikası{' '}
                          {roomStatus.oldNonRefundable
                            ? 'iptal edilemez.'
                            : 'iptal edilebilir.'}
                        </div>
                        <div>
                          Yeni iptal politilası{' '}
                          <span className='font-semibold'>
                            {roomStatus.nonRefundable
                              ? 'iptal edilemez.'
                              : 'iptal edilebilir.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
            )}
          <div className='flex justify-between gap-2'>
            <div>
              <Button color='red' onClick={closeRoomStateModal}>
                Kapat
              </Button>
            </div>
            <div>
              <Button color='green' onClick={handleReservation}>
                Devam Et
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        opened={installmentTableOpened}
        onClose={closeInstallmentTable}
        title='Tüm Kartlara Göre Taksit Tablosu'
        size={'xl'}
      >
        {roomInstallmentQuery.isPending && (
          <div className='flex h-[500px] items-center justify-center'>
            <Loader />
          </div>
        )}
        {installmentTableData.current && (
          <div>
            <InstallmentTable
              price={selectedRoomPrice.current}
              installmentData={installmentTableData.current}
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export { HotelDetailSection }
