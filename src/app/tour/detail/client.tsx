'use client'

import {
  Button,
  LoadingOverlay,
  Skeleton,
  Modal,
  Group,
  Container,
  Image,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import NumberFlow from '@number-flow/react'
import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'

import { useTourDetailQuery } from './useTourDetailQuery'
import { TourDetail } from './detail-view'
import { TourDetailPriceSection } from './price-section'
import { TourSearchEngine } from '@/modules/tour'
import { serviceRequest } from '@/network'
import { TourExtraServicesApiResponse } from '@/modules/tour/type'
import { ExtraServicePanel } from './extra-services'
import { reservationParsers } from '@/app/reservation/searchParams'
import { tourDetailPageParamParser } from '@/modules/tour/detailSearchParams'
import { CruiseSearchEngine } from '@/modules/cruise'
import { IoCalendarClearOutline, IoMapOutline } from 'react-icons/io5'
import { MdOutlineCameraAlt } from 'react-icons/md'
import { TourMediaGallery } from '@/app/tour/_components/media-gallery/media-gallery'
import { TourTableOfContents } from '@/app/tour/_components/table-of-contents'
import { BiMoon } from 'react-icons/bi'
import { IoIosAirplane } from 'react-icons/io'
import dayjs from 'dayjs'
import { CiLocationOn } from 'react-icons/ci'

const TourDetailClient = () => {
  const router = useTransitionRouter()
  const [
    isOpenExtraServicesModal,
    { open: openExtraServicesModal, close: closeExtraServicesModal },
  ] = useDisclosure(false)
  const [searchParams] = useQueryStates(tourDetailPageParamParser)

  const lastKeys = useRef({
    packageKey: '',
    calculatedId: '',
  })

  useEffect(() => {
    return () => {
      lastKeys.current = {
        calculatedId: '',
        packageKey: '',
      }
    }
  }, [])

  const detailQuery = useTourDetailQuery()

  const [passengers, setPassengers] = useState<{
    adultCount: string
    childAge?: (string | undefined)[] | undefined
  }>({
    adultCount: '2:0',
  })

  const calculateTotalPriceQuery = useQuery({
    enabled: !!detailQuery.data && detailQuery.isSuccess,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['tour-detail-totalPrice', detailQuery.data, passengers],
    queryFn: async () => {
      const response = await serviceRequest<{
        value: ServicePriceType
        packageKey: string
      }>({
        axiosOptions: {
          url: `api/tour/passengerUpdate`,
          method: 'post',
          data: {
            SearchToken: searchParams?.searchToken,
            SessionToken: searchParams?.sessionToken,
            Package: lastKeys.current.packageKey.length
              ? lastKeys.current.packageKey
              : searchParams?.productKey,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            CampaignCode: null,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      })

      lastKeys.current.packageKey = response?.data?.packageKey ?? ''

      return response
    },
  })

  const extraServicesMutation = useMutation({
    mutationKey: ['tour-extra-services'],
    mutationFn: async () => {
      const response = await serviceRequest<TourExtraServicesApiResponse>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/extraServices',
          method: 'post',
          data: {
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
            Package: lastKeys.current.packageKey,
          },
        },
      })

      lastKeys.current = {
        calculatedId: response?.data?.calculatedId ?? '',
        packageKey: response?.data?.package.key ?? '',
      }

      return response
    },
    onSuccess(data) {
      // setSearchParams({
      //   productKey: data?.data?.package.key,
      // })
      if (
        data?.data?.extraServices &&
        data?.data?.extraServices?.filter(
          (item) => !(item.isMandatory && item.isPackage)
        ).length > 0
      ) {
        openExtraServicesModal()
      } else {
        tourReservationQuery.mutate()
      }
    },
  })

  const addOrRemoveExtraServicesMutation = useMutation({
    mutationKey: ['tour-extra-service-update'],
    mutationFn: async () => {
      const response = await serviceRequest<{
        tlPrice: ServicePriceType
        calculatedId: string
        key: string
      }>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/addRemoveExtraServices',
          method: 'post',
          data: {
            CalculateId: lastKeys.current.calculatedId,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
            Package: lastKeys.current.packageKey,
            ExtraServicesAndAmounts: extraServicesAndAmounts,
          },
        },
      })

      return response
    },
    onSuccess: (data) => {
      // setSearchParams({
      //   productKey: data?.data?.key,
      // })
      lastKeys.current = {
        calculatedId: data?.data?.calculatedId ?? '',
        packageKey: data?.data?.key ?? '',
      }
    },
  })

  const tourReservationQuery = useMutation({
    mutationKey: ['tour-reservation'],
    mutationFn: async () => {
      const response = await serviceRequest<{ package: { key: string } }>({
        axiosOptions: {
          url: 'api/tour/reservation',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          data: {
            AppName: process.env.NEXT_PUBLIC_APP_NAME,
            ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            CalculateId: lastKeys.current.calculatedId,
            Package: lastKeys.current.packageKey,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge?.at(0),
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
          },
        },
      })

      return response
    },
    onSuccess: (data) => {
      const resParams = createSerializer(reservationParsers)

      const url = resParams('/reservation', {
        productKey: data?.data?.package.key,
        searchToken: detailQuery.data?.searchToken,
        sessionToken: detailQuery.data?.sessionToken,
      })

      router.push(url)
    },
  })

  const extraServiceKeys = extraServicesMutation.data?.data?.extraServices
    .filter((extra) => !extra.isPackage && !extra.isMandatory)
    .map((ext) => {
      return {
        key: ext.key,
        count: 0,
      }
    })

  let extraServicesAndAmounts: string[]

  const handleExtraServiceActions = (actions: {
    key: string
    count: number
  }) => {
    if (extraServiceKeys) {
      extraServicesAndAmounts = extraServiceKeys?.map((item) => {
        if (item.key === actions.key) {
          item.count = actions.count
        }

        return `${item.key}:${item.count}`
      })
    }
  }

  const extraServiceAdultCount = Number(
    extraServicesMutation.data?.data?.adultCount.split(':').at(0)
  )
  const extraServiceChildCount =
    extraServicesMutation.data?.data?.childAges?.filter((num) => num >= 0)
      ?.length ?? 0
  const extraMaxCount = extraServiceAdultCount + extraServiceChildCount
  const images = detailQuery.data?.detail.images.filter(
    (item) => !item.includes('youtube')
  )
  const videos = detailQuery.data?.detail.images.filter((item) =>
    item.includes('youtube')
  )
  const [
    isMediaGalleryOpened,
    { open: openMediaGallery, close: closeMediaGallery },
  ] = useDisclosure(false)
  const [galleryOpened, setGalleryOpened] = useState(false)
  const startDate = detailQuery.data?.package.startDate
  const endDate = detailQuery.data?.package.endDate
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1
  return (
    <>
      <div className='border-b p-4'>
        <Container>
          {searchParams.isCruise ? (
            <CruiseSearchEngine />
          ) : (
            <TourSearchEngine />
          )}
        </Container>
      </div>
      <Container className='px-0'>
        <div className='grid gap-4 py-4 lg:py-7'>
          {!detailQuery.isLoading && !detailQuery.data ? (
            <div>no data</div>
          ) : detailQuery.isLoading || !detailQuery.data ? (
            <div className='grid gap-4'>
              <Skeleton h={70} radius={'md'} />
              <Skeleton h={20} radius={'xl'} />
              <Skeleton h={20} radius={'xl'} className='max-w-6xl' />
            </div>
          ) : detailQuery.data ? (
            <div>
              <div
                onClick={() => setGalleryOpened(true)}
                className='relative grid cursor-pointer auto-cols-fr gap-4 px-3 sm:grid-cols-4 md:grid-rows-2 md:px-0'
              >
                <figure
                  style={{ contentVisibility: 'auto' }}
                  className='place-self-stretch sm:col-start-[span_2] sm:row-start-[span_2]'
                >
                  <Image
                    className='aspect-16/9 h-full w-full rounded-md object-cover'
                    src={images?.at(0)}
                    alt={detailQuery.data.package.title}
                  />
                </figure>
                {images?.slice(1, 5).map((image, imageIndex) => (
                  <figure
                    key={imageIndex}
                    className='hidden gap-3 place-self-stretch rounded-md sm:col-start-[span_1] sm:sm:row-start-[span_1] sm:grid'
                    style={{ contentVisibility: 'auto' }}
                  >
                    <Image
                      src={image}
                      alt={detailQuery.data?.package.title}
                      className='absolute aspect-16/9 h-full w-full object-cover'
                    />
                  </figure>
                ))}
                <div className='absolute end-0 right-0 bottom-1 m-1 hidden h-10 md:flex'>
                  <Button
                    color={'black'}
                    opacity={'.65'}
                    leftSection={<MdOutlineCameraAlt size={20} />}
                    onClick={openMediaGallery}
                    radius={'md'}
                  >
                    Galeri ({images?.length})
                  </Button>
                </div>
              </div>
              <div className='mt-10 mb-6'>
                <TourTableOfContents tourInfo={detailQuery.data} />
              </div>
              <div className='grid grid-cols-12 gap-4'>
                {/* detail-viewdan taşındı */}
                <div className='relative col-span-12 gap-5 rounded-lg border p-5 shadow-sm md:col-span-8'>
                  <Title className='text-md mb-4 md:text-2xl'>
                    {detailQuery.data.package.title}
                  </Title>

                  <div className='my-3 grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='flex items-center gap-4'>
                      <div className='text-blue-800'>
                        <IoCalendarClearOutline size={20} />
                      </div>
                      <div className='font-semibold'>
                        {dayjsStartDate.format("DD MMM'YY")} -{' '}
                        {dayjsEndDate.format("DD MMM'YY")} arası
                      </div>
                    </div>

                    <div className='flex items-center gap-4'>
                      <div className='text-blue-800'>
                        <BiMoon size={20} />
                      </div>
                      <div className='font-semibold'>
                        {totalNights} gece {totalDays} gün
                      </div>
                    </div>

                    {detailQuery.data.detail.flightInformation?.length > 0 && (
                      <div className='flex items-center gap-4'>
                        <div className='text-blue-800'>
                          <CiLocationOn size={22} />
                        </div>
                        <div
                          className='font-semibold'
                          dangerouslySetInnerHTML={{
                            __html:
                              detailQuery.data.detail.flightInformation[0],
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className='text-dark-200 bottom-5 hidden text-sm md:flex'>
                    Not : Çocuk kategorisi 7-12 yaşları arasıdır. Tur sirküsü
                    yayımlandığı 03.02.2025 tarihinde geçerlidir. Aynı tura ait,
                    daha sonraki bir tarihte yayımlanacak tur sirküsü bir
                    öncekini geçersiz kılar. Zorunlu ek hizmetler fiyata
                    dahildir.
                  </div>
                </div>

                <div className='order-0 col-span-12 md:order-1 md:col-span-4'>
                  <div className='relative'>
                    <LoadingOverlay
                      visible={calculateTotalPriceQuery.isPending}
                      zIndex={1000}
                      overlayProps={{ radius: 'sm', blur: 2 }}
                      loaderProps={{ color: 'indigo', type: 'bars' }}
                    />
                    <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
                      <TourDetailPriceSection
                        calculatedTotalPrice={
                          calculateTotalPriceQuery.data?.success &&
                          typeof calculateTotalPriceQuery.data?.data?.value
                            .value === 'number'
                            ? calculateTotalPriceQuery.data?.data?.value.value
                            : 0
                        }
                        data={detailQuery.data}
                        onPassengerChange={setPassengers}
                      />
                      <div className='py-4'>
                        <Button
                          type='button'
                          fullWidth
                          size='lg'
                          disabled={
                            !calculateTotalPriceQuery.data?.success ||
                            extraServicesMutation.isPending
                          }
                          loading={extraServicesMutation.isPending}
                          onClick={() => {
                            extraServicesMutation.mutate()
                          }}
                        >
                          Rezervasyon Yap
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid gap-4 py-4 md:grid-cols-12 md:py-6'>
                <div className='order-1 col-span-12 md:order-0 md:col-span-12'>
                  <TourDetail data={detailQuery.data} />
                </div>
              </div>
            </div>
          ) : (
            <div>no data</div>
          )}
        </div>
      </Container>
      <Modal
        opened={isOpenExtraServicesModal}
        onClose={closeExtraServicesModal}
        title='Ekstra Servisler'
      >
        <div className='grid gap-5'>
          {extraServicesMutation.data?.data?.extraServices
            .filter((extra) => !extra.isPackage && !extra.isMandatory)
            .map((extra) => {
              return (
                <ExtraServicePanel
                  data={extra}
                  key={extra.key}
                  maxCount={extraMaxCount}
                  onChange={handleExtraServiceActions}
                />
              )
            })}
          <div className='flex items-center justify-between'>
            <div>Toplam:</div>
            <div className='text-lg font-semibold'>
              <NumberFlow
                format={{
                  style: 'currency',
                  currency: 'TRY',
                  currencyDisplay: 'narrowSymbol',
                }}
                value={
                  addOrRemoveExtraServicesMutation.data?.data
                    ? addOrRemoveExtraServicesMutation.data?.data.tlPrice.value
                    : (calculateTotalPriceQuery.data?.data?.value?.value ?? 0)
                }
              />
            </div>
          </div>
          <Button
            type='button'
            disabled={addOrRemoveExtraServicesMutation.isPending}
            loading={addOrRemoveExtraServicesMutation.isPending}
            onClick={() => {
              addOrRemoveExtraServicesMutation.mutate()
            }}
          >
            Ekle
          </Button>
        </div>
        <div>
          <Group className='justify-between border-t' pt='md' mt={'md'}>
            <Button color='red' onClick={closeExtraServicesModal}>
              İptal
            </Button>
            <Button
              color='green'
              disabled={addOrRemoveExtraServicesMutation.isPending}
              onClick={() => {
                tourReservationQuery.mutate()
              }}
            >
              Rezervasyon Yap
            </Button>
          </Group>
        </div>
      </Modal>
      {images && (
        <TourMediaGallery
          images={images}
          title={detailQuery?.data?.package?.title}
          opened={galleryOpened}
          onClose={() => setGalleryOpened(false)}
        />
      )}
    </>
  )
}

export { TourDetailClient }
