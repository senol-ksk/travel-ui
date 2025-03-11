'use client'

import { useRef, useState } from 'react'
import {
  Alert,
  AspectRatio,
  Button,
  Container,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  rem,
  ScrollArea,
  Skeleton,
  Title,
} from '@mantine/core'
import { useHotelDataQuery } from '../detailDataQuery'
import { HotelDetailSkeleton } from './skeletonLoader'
import { HotelRoom } from './room'
import { useDisclosure } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'
import { createSerializer } from 'nuqs'
import { reservationParsers } from '@/app/reservation/searchParams'
import { useRouter } from 'next/navigation'
import { HotelDetailRoomItem } from '../../types'
import { InstallmentTable } from './installment'
import { FaExclamationCircle } from 'react-icons/fa'

import dayjs from 'dayjs'
import { RoomUpdateForm } from './_components/room-update-form'

const HotelDetailSection = () => {
  const router = useRouter()

  const {
    hotelDetailQuery,
    roomInstallmentQuery,
    roomsQuery,
    selectedRoomMutation,
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
  const hotelSearchPanel = hotelDetailData?.data?.searchPanel

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
    const roomStatus = await selectedRoomMutation.mutateAsync({
      productKey,
      cancelWarranty,
    })

    closeRoomStateOverlayVisible()

    if (!roomStatus?.data || !roomStatus.success) {
      openRoomStateModal()

      return
    }

    if (
      Array.isArray(roomStatus?.data?.status) &&
      roomStatus?.data?.status?.length > 0
    ) {
      closeRoomStateOverlayVisible()
      openRoomStateModal()
    } else {
      handleReservation(roomStatus?.data?.productKey)
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

  const handleReservation = (productKey: string) => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey,
      searchToken: hotelDetailData?.data?.searchPanel.searchToken,
      sessionToken: hotelDetailData?.data?.searchPanel.sessionToken,
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
      <Container className='px-0 pt-5 pb-5 sm:px-4 md:pt-8'>
        {hotel?.documents && hotel?.documents?.length > 0 && (
          <div className='pb-3 text-end text-xs text-gray-700/85'>
            <span>
              Kültür ve Turizm Bakanlığı - Kısmı Turizm İşletme Belgesi:{' '}
            </span>
            <strong>{hotel.documents.at(0)?.no}</strong>
          </div>
        )}
        <div className='grid auto-cols-fr gap-1 sm:grid-cols-4 md:grid-rows-2'>
          <figure
            style={{ contentVisibility: 'auto' }}
            className='relative place-self-stretch sm:col-start-[span_2] sm:row-start-[span_2]'
          >
            <Image
              className='aspect-16/9 h-full w-full object-cover'
              src={hotel.images.at(0)?.original}
              alt={hotel.name}
            />
          </figure>

          {hotel.images.slice(1, 5).map((image, imageIndex) => (
            <figure
              key={imageIndex}
              className='relative hidden gap-1 place-self-stretch sm:col-start-[span_1] sm:sm:row-start-[span_1] sm:grid'
              style={{ contentVisibility: 'auto' }}
            >
              <Image
                src={image.original}
                alt={hotel.name}
                className='absolute aspect-16/9 h-full w-full object-cover'
              />
            </figure>
          ))}
        </div>
      </Container>
      <Container>
        <Title fz={'h2'}>{hotel.name.trim()}</Title>
        <div className='grid gap-5 pt-4'>
          <div>
            <Title order={2} size={'lg'} pb={rem(12)}>
              Odanızı Seçin
            </Title>
            <RoomUpdateForm />
          </div>

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
                <Alert color='red' title='Oda Sonuçları Bulunamadı'>
                  Oda kalmamış veya bir hata oldu. Tekrar deneyiniz.
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
      </Container>
      <Modal
        opened={roomStateModalOpened}
        onClose={closeRoomStateModal}
        title='Otel Mesajı'
        size={'auto'}
        centered
      >
        <div>
          {!selectedRoomMutation.data?.data && (
            <div>
              <Alert
                variant='light'
                color='red'
                title='Müsaitlik Bulunmuyor'
                icon={<FaExclamationCircle />}
              >
                Üzgünüz. Seçtiğiniz oda için müsaitlik bulunmamaktadır.
              </Alert>
            </div>
          )}
          {selectedRoomMutation.data?.data?.status.length &&
            selectedRoomMutation.data?.data?.status.map(
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
                          Yeni iptal politikası{' '}
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

          {selectedRoomMutation.data?.data && (
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                color='green'
                onClick={() =>
                  selectedRoomMutation.data?.data?.productKey &&
                  handleReservation(
                    selectedRoomMutation?.data?.data?.productKey
                  )
                }
              >
                Devam Et
              </Button>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        opened={installmentTableOpened}
        onClose={closeInstallmentTable}
        title='Tüm Kartlara Göre Taksit Tablosu'
        size={'auto'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {roomInstallmentQuery.isPending && (
          <div className='flex h-[500px] items-center justify-center'>
            <Loader />
          </div>
        )}
        {installmentTableData.current && (
          <InstallmentTable
            price={selectedRoomPrice.current}
            installmentData={installmentTableData.current}
          />
        )}
      </Modal>
    </>
  )
}

export { HotelDetailSection }
