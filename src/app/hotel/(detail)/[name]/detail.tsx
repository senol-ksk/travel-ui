'use client'

import { useRef } from 'react'
import {
  Alert,
  Button,
  Container,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Skeleton,
  Spoiler,
  Title,
  Badge,
  TypographyStylesProvider,
  Text,
  Divider,
} from '@mantine/core'
import { IoMapOutline } from 'react-icons/io5'
import { Link } from 'next-view-transitions'
import { BiChevronRight } from 'react-icons/bi'
import { useDisclosure, useScrollIntoView } from '@mantine/hooks'
import { createSerializer } from 'nuqs'
import { useRouter } from 'next/navigation'
import { FaExclamationCircle } from 'react-icons/fa'
import { LuMapPinned, LuShieldCheck } from 'react-icons/lu'
import { MdOutlineCameraAlt, MdOutlineRoomService } from 'react-icons/md'

import { useHotelDataQuery } from '../detailDataQuery'
import { HotelDetailSkeleton } from './skeletonLoader'
import { HotelRoom } from './room'
import { formatCurrency } from '@/libs/util'
import { reservationParsers } from '@/app/reservation/searchParams'
import { HotelDetailRoomItem } from '../../types'
import { InstallmentTable } from './installment'
import { RoomUpdateForm } from './_components/room-update-form'
import { HotelTableOfContents } from './_components/table-of-contents'
import { FacilityProps } from './_components/facility-props'
import { Comments } from './_components/comments'
import { Location } from './_components/location'
import { HotelDrawers } from './_components/hotel-drawers'
import { ImportantInfos } from './_components/important-infos'
import { IconCheckIn, IconCheckOut } from './_components/icons'

const HotelDetailSection = () => {
  const router = useRouter()

  const {
    hotelDetailQuery,
    roomInstallmentQuery,
    roomsQuery,
    selectedRoomMutation,
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
  const { scrollIntoView: scrollIntoRatings, targetRef: ratingTargetRef } =
    useScrollIntoView({
      offset: 60,
    })

  if (!hotelDetailData && hotelDetailQuery.isLoading) {
    return <HotelDetailSkeleton />
  }

  console.log(hotel)

  if (!hotel || !hotelDetailData?.success) {
    return (
      <Container className='pt-5 text-center' maw={600}>
        <Alert color='yellow'>
          <Text>Otel bilgileri alınırken bir hata oldu.</Text>
          <div className='flex justify-center pt-3'>
            <Button component={Link} href={'/'}>
              Ana Sayfa
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <Container
        className='flex flex-col gap-3 px-0 py-5 sm:px-4 md:gap-5 md:py-8'
        id='mdx'
      >
        <div>
          {hotel?.documents && hotel?.documents?.length > 0 && (
            <div className='pb-3 text-end text-xs'>
              <span>
                Kültür ve Turizm Bakanlığı - Kısmı Turizm İşletme Belgesi:{' '}
              </span>
              <strong>{hotel.documents.at(0)?.no}</strong>
            </div>
          )}
          <div className='relative'>
            <div className='absolute end-2 top-2 z-10'>
              <Button
                bg={'white'}
                c='dark'
                variant='light'
                leftSection={<IoMapOutline />}
              >
                Harita Görünümü
              </Button>
            </div>
            <div className='absolute end-2 bottom-2 z-10'>
              <Button
                color={'black'}
                opacity={'.75'}
                leftSection={<MdOutlineCameraAlt />}
              >
                Galeri ({hotel.images.length})
              </Button>
            </div>
            <div className='grid auto-cols-fr gap-4 sm:grid-cols-4 md:grid-rows-2'>
              <figure
                style={{ contentVisibility: 'auto' }}
                className='relative place-self-stretch sm:col-start-[span_2] sm:row-start-[span_2]'
              >
                <Image
                  className='aspect-16/9 h-full w-full rounded-md object-cover'
                  src={hotel.images.at(0)?.original}
                  alt={hotel.name}
                />
              </figure>

              {hotel.images.slice(1, 5).map((image, imageIndex) => (
                <figure
                  key={imageIndex}
                  className='relative hidden gap-3 place-self-stretch rounded-md sm:col-start-[span_1] sm:sm:row-start-[span_1] sm:grid'
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
          </div>
        </div>

        <div className='sticky top-0 z-30 hidden rounded bg-gray-50 shadow-xs sm:block'>
          <HotelTableOfContents />
        </div>

        <div className='grid grid-cols-2 gap-5 rounded bg-gray-50 md:grid-cols-12 md:p-3'>
          <div className='col-span-12 grid gap-2 rounded bg-white p-3 md:col-span-8'>
            <div className='grid'>
              <Title fz={'h2'}>{hotel.name.trim()}</Title>
              <div className='grid grid-cols-2 gap-4 pt-3 text-sm text-blue-800'>
                <div className='flex gap-1'>
                  <span>
                    <LuMapPinned size={22} />
                  </span>
                  <span>{hotel.destination}</span>
                </div>
                {hotel.meal_type && (
                  <div className='flex gap-1'>
                    <span>
                      <MdOutlineRoomService size={22} />
                    </span>
                    <span>{hotel.meal_type}</span>
                  </div>
                )}
              </div>
            </div>
            {hotel.descriptions && hotel.descriptions.hotelInformation ? (
              <div className='pb-5'>
                <Title order={3} fz={'h5'}>
                  Genel Bilgiler
                </Title>
                <TypographyStylesProvider>
                  <Spoiler
                    maxHeight={150}
                    hideLabel='Kapat'
                    showLabel='Daha Fazla Göster'
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: hotel.descriptions.hotelInformation.trim(),
                      }}
                    />
                  </Spoiler>
                </TypographyStylesProvider>
              </div>
            ) : null}
          </div>

          <div className='col-span-12 flex flex-col gap-3 md:col-span-4'>
            <div className='flex items-center justify-between rounded bg-white p-3'>
              <Badge color='green' size='xl' radius='md'>
                {hotel.comment_info?.averageScore}
              </Badge>
              <Button
                variant='white'
                color='blue'
                size='sm'
                rightSection={<BiChevronRight size={20} />}
                onClick={() => scrollIntoRatings()}
              >
                {hotel.comment_info?.comments.length} değerlendirme
              </Button>
            </div>
            <div
              className='grid gap-3 rounded bg-white p-3'
              data-heading='Konum'
            >
              <div className='col-span-4 flex gap-3'>
                <iframe
                  src='https://maps.google.com/maps?q=35.379585,34.08901&amp;output=embed&amp;hl=en'
                  style={{ width: '116px', height: '110px' }}
                  className='rounded border-0'
                  allowFullScreen
                ></iframe>
                <div className='grid'>
                  <Text size='sm'>Konum</Text>
                  <div>{hotel.destination}</div>
                </div>
              </div>
            </div>
            <div className='flex justify-between gap-5 rounded bg-white px-8 py-3'>
              <div className='flex items-center gap-2'>
                <div>
                  <IconCheckIn />
                </div>
                <div>
                  <Text size='md'>Check-in</Text>
                  <Text size='md'>{hotel.checkin_from}</Text>
                </div>
              </div>
              <div className='flex items-center gap-2 border-s ps-5'>
                <div>
                  <IconCheckOut />
                </div>
                <div>
                  <Text size='md'>Check-out</Text>
                  <Text size='md'>{hotel.checkout_to}</Text>
                </div>
              </div>
            </div>
            <HotelDrawers description={hotel.descriptions} />
          </div>
        </div>
        <Title fz={'xxl'} id='rooms'>
          Odalar
        </Title>
        <div className='rounded-sm border border-gray-300 p-3'>
          <RoomUpdateForm />
        </div>
        {/* {selectedRoomMutation.data?.data?.status.length &&
          selectedRoomMutation.data?.data?.status.map(
            (roomStatus, roomStatusIndex) => {
              return (
                !roomStatus.nonRefundable && (
                  <Text
                    size='md'
                    className='rounded-sm bg-green-200 p-3'
                    key={roomStatusIndex}
                  >
                    İptal Güvence Paketi ekle, tatiline 72 saat kalaya kadar
                    koşulsuz iptal hakkın olsun!
                  </Text>
                )
              )
            }
          )} */}
        <Alert
          color='green'
          icon={<LuShieldCheck size={22} />}
          classNames={{
            icon: 'me-1',
          }}
        >
          <span className='font-semibold'>
            İptal Güvence Paketi ekle, tatiline 72 saat kalaya kadar koşulsuz
            iptal hakkın olsun!
          </span>
        </Alert>

        <div className='relative grid gap-3 @lg:gap-5'>
          {(roomsQuery.isLoading || roomsQuery.data?.pages.at(0) === null) && (
            <div>
              <div className='text-center text-gray-500'>Odalar yükleniyor</div>
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
        <Title order={2} size={'lg'} id='facility-infos'>
          Tesis Bilgileri
        </Title>
        <div className='rounded border bg-sky-500/10 p-1 md:p-3'>
          <FacilityProps descriptions={hotel.descriptions} />
        </div>
        {(hotel.comment_info || hotel.reviews) && (
          <div ref={ratingTargetRef}>
            <Title order={2} size={'lg'} id='ratings' pb={'md'}>
              Değerlendirmeler
            </Title>
            <div className='gap-2 rounded bg-sky-500/10 p-3'>
              <div className='flex items-center justify-between rounded bg-white p-3'>
                <Badge color='green' size='xl' radius='md'>
                  {hotel.comment_info?.averageScore}
                </Badge>
                <Button variant='white' color='blue' size='md' radius='md'>
                  {hotel.comment_info?.comments.length} değerlendirme
                </Button>
              </div>
              <div className='mt-3 rounded bg-white'>
                {hotel.comment_info && <Comments data={hotel.comment_info} />}
              </div>
            </div>
          </div>
        )}
        <Title order={2} size={'lg'} id='location'>
          Konum Bilgileri{' '}
        </Title>
        <div>
          <Location location={hotel.location} />
        </div>
        {/* <div>
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
        </div> */}
        <Title order={2} size={'lg'}>
          Önemli Bilgiler{' '}
        </Title>
        <div>
          <ImportantInfos description={hotel.descriptions} />
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
