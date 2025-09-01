'use client'

import { useRef, useState } from 'react'
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
  Title,
  Text,
} from '@mantine/core'
import { IoMapOutline } from 'react-icons/io5'
import { BiChevronRight } from 'react-icons/bi'
import {
  useDisclosure,
  useScrollIntoView,
  useElementSize,
} from '@mantine/hooks'
import { createSerializer } from 'nuqs'
import { notFound, useRouter } from 'next/navigation'
import { FaExclamationCircle } from 'react-icons/fa'
import { LuShieldCheck } from 'react-icons/lu'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineCameraAlt,
  MdOutlineRoomService,
} from 'react-icons/md'
import { BottomSticky } from './_components/bottom-sticky'

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
import { HotelMediaGallery } from './_components/media-gallery/media-gallery'
import { HotelSearchEngine } from '@/modules/hotel'
import { RiMapPin2Line } from 'react-icons/ri'
import { MainDrawer } from './_components/main-drawer'
import { BsCheck } from 'react-icons/bs'
import { Route } from 'next'

type IProps = {
  slug: string
}

const HotelDetailSection: React.FC<IProps> = ({ slug }) => {
  const router = useRouter()

  const {
    hotelDetailQuery,
    roomInstallmentQuery,
    roomsQuery,
    selectedRoomMutation,
    setSearchParams,
    searchParams,
  } = useHotelDataQuery()

  const [
    roomStateModalOpened,
    { open: openRoomStateModal, close: closeRoomStateModal },
  ] = useDisclosure(false)
  const [
    isMediaGalleryOpened,
    { open: openMediaGallery, close: closeMediaGallery },
  ] = useDisclosure(false)

  const [
    installmentTableOpened,
    { open: openInstallmentTable, close: closeInstallmentTable },
  ] = useDisclosure(false)
  const [
    roomStateLoadingOverlayVisible,
    { close: closeRoomStateOverlayVisible, open: openRoomStateOverlayVisible },
  ] = useDisclosure(false)
  const [
    generalInfoDrawerOpened,
    { open: openGeneralInfoDrawer, close: closeGeneralInfoDrawer },
  ] = useDisclosure(false)
  const [showCommentsTab, setShowCommentsTab] = useState(false)
  const selectedRoomPrice = useRef(0)

  const hotelDetailData = hotelDetailQuery.data

  const hotelInfo = hotelDetailData?.data?.hotelDetailResponse?.hotelInfo
  const hotel = hotelInfo?.hotel

  if (!searchParams.slug) {
    setSearchParams({ slug })
  }

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
  const handleCommentClick = () => {
    setShowCommentsTab(true)
    openGeneralInfoDrawer()
  }

  const handleDrawerClose = () => {
    setShowCommentsTab(false)
    closeGeneralInfoDrawer()
  }

  const handleReservation = (productKey: string) => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey,
      searchToken: hotelDetailData?.data?.searchPanel.searchToken,
      sessionToken: hotelDetailData?.data?.searchPanel.sessionToken,
    }) as Route

    router.push(url)
  }
  const { scrollIntoView: scrollIntoRatings, targetRef: ratingTargetRef } =
    useScrollIntoView({
      offset: 60,
    })
  const { scrollIntoView: scrollIntolocations, targetRef: locationTargetRef } =
    useScrollIntoView({
      offset: 60,
    })
  const { ref: generalInfoContentRef, height: generalInfoContentHeight } =
    useElementSize()
  const GENERAL_INFO_MAX_HEIGHT = 50

  if (!hotelDetailData && hotelDetailQuery.isLoading) {
    return <HotelDetailSkeleton />
  }

  if (!hotel || !hotelDetailData?.success) {
    return notFound()
  }

  return (
    <>
      <Container className='border-b py-4'>
        <HotelSearchEngine />
      </Container>

      <Container
        className='flex flex-col gap-3 px-0 py-5 sm:px-4 md:gap-5 md:py-3'
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
            <div className='absolute end-2 top-2 z-10 hidden'>
              <Button
                bg={'white'}
                c='dark'
                variant='light'
                leftSection={<IoMapOutline />}
              >
                Harita Görünümü
              </Button>
            </div>
            <div className='absolute end-2 bottom-2 z-10 mx-2'>
              <Button
                color={'black'}
                opacity={'.75'}
                leftSection={<MdOutlineCameraAlt size={18} />}
                onClick={openMediaGallery}
              >
                Galeri ({hotel.images.length})
              </Button>
            </div>
            <div
              onClick={openMediaGallery}
              className='cursor-pointer px-2 sm:px-0'
            >
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
        </div>

        <HotelTableOfContents hotelInfo={hotelInfo} />

        <div className='grid grid-cols-2 gap-2 rounded bg-gray-50 md:grid-cols-12 md:gap-5 md:p-3'>
          <div className='col-span-12 grid gap-2 rounded bg-white p-3 md:col-span-8'>
            <div className='grid'>
              <div className='text-xl font-semibold md:text-3xl'>
                {hotel.name.trim()}
              </div>
              <div className='gap-md flex items-center py-2 text-sm text-blue-800'>
                <div className='flex gap-1'>
                  <span>
                    <RiMapPin2Line size={20} className='text-blue-800' />
                  </span>
                  <span>{hotel.destination}</span>
                </div>

                {hotel.meal_type && (
                  <div className='flex gap-1'>
                    <span>
                      <MdOutlineRoomService
                        size={22}
                        className='text-blue-800'
                      />
                    </span>
                    <span> {hotel.meal_type}</span>
                  </div>
                )}
              </div>
            </div>
            {hotel.descriptions && hotel.descriptions.hotelInformation ? (
              <div>
                <Title order={3} className='mb-4 text-sm font-medium'>
                  Genel Bilgiler
                </Title>
                <div
                  style={{
                    maxHeight: `80px`,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div>
                    <div
                      className='text-sm'
                      ref={generalInfoContentRef}
                      dangerouslySetInnerHTML={{
                        __html: hotel.descriptions.hotelInformation.trim(),
                      }}
                    />
                  </div>
                  {generalInfoContentHeight > GENERAL_INFO_MAX_HEIGHT && (
                    <div className='absolute right-0 bottom-0 left-0 h-10'></div>
                  )}
                </div>

                <div ref={generalInfoContentRef} className='mt-5 mb-3'>
                  <Title
                    order={3}
                    className='mb-4 hidden text-sm font-medium md:block'
                  >
                    Otel Özellikleri
                  </Title>
                  <ul className='grid grid-cols-2 gap-4 text-sm sm:grid-cols-4'>
                    {hotelInfo.facilityTypes
                      .slice(0, 8)
                      .map((facility, index) => (
                        <li
                          key={index}
                          className={`truncate ${
                            index > 3 ? 'hidden sm:list-item' : ''
                          }`}
                        >
                          <BsCheck className='mr-1 inline-block text-blue-800' />
                          {facility.name}
                        </li>
                      ))}
                  </ul>
                </div>
                {generalInfoContentHeight > GENERAL_INFO_MAX_HEIGHT && (
                  <Button
                    onClick={openGeneralInfoDrawer}
                    className='bg-transparent p-0 font-normal text-blue-700 md:my-0'
                  >
                    Tesisin tüm olanaklarını görün
                    <MdKeyboardArrowRight size={20} />
                  </Button>
                )}
              </div>
            ) : null}
          </div>

          <div className='col-span-12 flex flex-col gap-3 md:col-span-4'>
            {hotel.comment_info && (
              <div className='hidden items-center justify-between rounded bg-white p-3 md:flex'>
                <div className='hidden items-center gap-2 self-end text-blue-800 md:flex'>
                  <div className='rounded-md bg-blue-100 p-4 px-5 text-xl leading-none font-bold'>
                    {hotel.comment_info?.averageScore}
                  </div>
                  <div className='text-xl font-medium'>Mükemmel</div>
                </div>
                <div className='flex items-center'>
                  <Button
                    className='border-0 bg-transparent p-0 text-sm font-normal text-blue-700'
                    size='md'
                    onClick={() => scrollIntoRatings()}
                  >
                    {hotel.comment_info?.comments.length} değerlendirme
                  </Button>
                  <BiChevronRight size={20} color='blue' />
                </div>
              </div>
            )}
            <div
              className='hidden gap-3 rounded bg-white p-3 md:grid'
              data-heading='Konum'
            >
              <div className='col-span-4 hidden gap-3 md:flex'>
                <iframe
                  src='https://maps.google.com/maps?q=35.379585,34.08901&amp;output=embed&amp;hl=en'
                  style={{ width: '116px', height: '110px' }}
                  className='rounded-md border-0'
                  allowFullScreen
                ></iframe>
                <div className='grid'>
                  <Text className='font-medium'>Konum</Text>
                  <div className='text-sm font-normal'>{hotel.address}</div>
                  <div className='flex items-center'>
                    <Button
                      className='border-0 bg-transparent p-0 font-normal text-blue-700'
                      size='sm'
                      onClick={() => scrollIntolocations()}
                    >
                      Oteli haritada gör
                    </Button>
                    <BiChevronRight size={20} color='blue' />
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden justify-between gap-5 rounded bg-white px-6 py-3 md:flex'>
              <div className='flex items-center gap-2'>
                <div>
                  <IconCheckIn />
                </div>
                <div>
                  <Text>Check-in</Text>
                  <Text size='sm'>{hotel.checkin_from}</Text>
                </div>
              </div>
              <div className='flex items-center gap-2 border-s ps-5'>
                <div>
                  <IconCheckOut />
                </div>
                <div>
                  <Text>Check-out</Text>
                  <Text size='sm'>{hotel.checkout_to}</Text>
                </div>
              </div>
            </div>
            <HotelDrawers description={hotel.descriptions} />
          </div>
        </div>
        <MainDrawer
          opened={generalInfoDrawerOpened}
          onClose={handleDrawerClose}
          data={hotelInfo}
          description={hotel.descriptions}
          showCommentsTab={showCommentsTab}
        />
        <Title id='rooms' className='md:text-xxl p-2 text-xl md:p-0'>
          Odalar
        </Title>
        <div className='rounded-sm border p-3'>
          <RoomUpdateForm />
        </div>

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
              {/* <div className='text-center text-gray-500'>Odalar yükleniyor</div> */}
              <div className='grid gap-2 rounded p-2'>
                <div className='flex gap-3'>
                  <Skeleton height={140} radius='md' width='35%' />
                  <div className='grid items-center' style={{ width: '33%' }}>
                    <Skeleton height={35} radius='xl' width='100%' />
                    <Skeleton height={35} radius='xl' width='100%' />
                    <Skeleton height={35} radius='xl' width='100%' />
                  </div>
                  <div className='grid items-center' style={{ width: '32%' }}>
                    <Skeleton height={35} radius='xl' width='100%' />
                    <Skeleton height={35} radius='xl' width='100%' />
                    <Skeleton height={35} radius='xl' width='100%' />
                  </div>{' '}
                </div>
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
                    hotelInfo={page?.data?.hotelDetailResponse?.hotelInfo}
                    roomGroup={roomGroup}
                    roomDetails={roomDetails}
                    onSelect={(selectedRoomGroup: HotelDetailRoomItem) => {
                      handleRoomSelect({
                        productKey: roomGroup.key,
                        cancelWarranty: false,
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
          <div>
            {roomsQuery.data?.pages?.[0]?.data?.hotelDetailResponse
              ?.items?.[0] && (
              <BottomSticky
                roomGroup={
                  roomsQuery.data?.pages?.[0]?.data?.hotelDetailResponse
                    ?.items?.[0]
                }
              />
            )}
          </div>
          {roomsQuery.hasNextPage && (
            <div className='flex justify-center'>
              <Button
                className='flex w-full justify-center bg-blue-200 text-blue-800'
                type='button'
                loading={roomsQuery.isFetchingNextPage}
                onClick={() => {
                  roomsQuery.fetchNextPage()
                }}
              >
                Daha Fazla Oda Göster <MdKeyboardArrowDown size={18} />
              </Button>
            </div>
          )}
          <LoadingOverlay
            visible={roomStateLoadingOverlayVisible}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
        </div>

        <Title
          order={2}
          id='facility-infos'
          className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
        >
          Tesis Bilgileri
        </Title>
        <div className='border-md rounded bg-gray-50 p-1 md:p-3'>
          <FacilityProps
            descriptions={hotel.descriptions}
            data={hotelInfo}
            onOpenDrawer={openGeneralInfoDrawer}
          />
        </div>

        {(hotel.comment_info?.comments?.length ?? 0) > 0 && (
          <div ref={ratingTargetRef}>
            <Title
              order={2}
              id='ratings'
              pb={'md'}
              className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
            >
              Değerlendirmeler
            </Title>
            <div className='gap-2 rounded bg-gray-50 p-3'>
              <div className='flex items-center justify-between rounded-lg bg-white p-3'>
                <div className='hidden items-center gap-2 self-end text-blue-800 md:flex'>
                  <div className='rounded-md bg-blue-100 p-4 px-5 text-xl leading-none font-bold'>
                    {hotel.comment_info?.averageScore}
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='text-xl font-normal'>Mükemmel</div>
                    <div className='flex items-center'>
                      <Button
                        className='border-0 bg-transparent p-0 text-sm font-normal text-black'
                        size='md'
                        onClick={handleCommentClick}
                      >
                        {hotel.comment_info?.comments?.length ?? 0}{' '}
                        değerlendirme
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCommentClick}
                  className='bg-transparent p-0 font-normal text-blue-700'
                >
                  Tüm Yorumları Göster <MdKeyboardArrowRight size={20} />
                </Button>
              </div>
              <div className='mt-3 rounded-xl bg-white'>
                {hotel.comment_info && (
                  <Comments
                    data={hotel.comment_info}
                    onCommentClick={handleCommentClick}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <Title
          order={2}
          id='location'
          className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
        >
          Konum Bilgileri{' '}
        </Title>
        <div ref={locationTargetRef}>
          <Location location={hotel.location} data={hotelInfo} />
        </div>
        {hotel.descriptions.importentInfo && (
          <div>
            <Title order={2} className='mb-3 p-2 pt-6 md:mt-6 md:p-0'>
              Önemli Bilgiler{' '}
            </Title>
            <div>
              <ImportantInfos
                description={hotel.descriptions}
                data={hotelInfo}
              />
            </div>
          </div>
        )}
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
      <HotelMediaGallery
        data={hotelInfo}
        isMediaGalleryOpened={isMediaGalleryOpened}
        closeMediaGallery={closeMediaGallery}
      />
    </>
  )
}

export { HotelDetailSection }
