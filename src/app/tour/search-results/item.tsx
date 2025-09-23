'use client'
import {
  TourSearchResultGroupedItem,
  TourSearchResultRelatedItems,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Divider,
  Image,
  Popover,
  Select,
  Skeleton,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import { LiaInfoCircleSolid } from 'react-icons/lia'

import { formatCurrency, slugify } from '@/libs/util'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearchResults'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { TourDropdown } from './_components/dropdown'
import { IoLocationSharp, IoMoonOutline } from 'react-icons/io5'
import { MdOutlineChevronRight, MdOutlineLocationCity } from 'react-icons/md'
import { useQueryStates } from 'nuqs'
import {
  tourSearchResultParamParser,
  filterParser,
} from '@/modules/tour/searchResultParams'
import { WiDaySunny } from 'react-icons/wi'
import { CiSun } from 'react-icons/ci'
import { FiSun } from 'react-icons/fi'
import { Route } from 'next'
import { LuTicketsPlane } from 'react-icons/lu'
import { RiPlaneFill, RiTrainFill } from 'react-icons/ri'
import { FaBus } from 'react-icons/fa'

type Props = {
  // data: TourSearchResultSearchItem
  data: TourSearchResultGroupedItem
}

export const TourSearchResultItem: React.FC<Props> = ({ data }) => {
  const [searchParams] = useQueryStates(tourSearchResultParamParser)
  const [filterParams] = useQueryStates(filterParser)

  const sortedRelatedItems = data.relatedItems.sort((a, b) =>
    dayjs(a.startDate).diff(b.startDate)
  )

  // Çıkış noktası ve ulaşım tipi filtresi varsa, sadece o kriterlere uygun tarihleri göster
  const filteredRelatedItems = sortedRelatedItems.filter((item) => {
    // Çıkış noktası filtresi
    if (
      filterParams.departurePoints &&
      filterParams.departurePoints.length > 0
    ) {
      const hasDeparturePoint = item?.departurePoints?.some((departurePoint) =>
        filterParams.departurePoints?.includes(departurePoint.code ?? '')
      )
      if (!hasDeparturePoint) return false
    }

    // Ulaşım tipi filtresi
    if (filterParams.transportType && filterParams.transportType.length > 0) {
      const transportTypeSlug = item?.transportType?.toString() ?? ''
      const hasTransportType =
        filterParams.transportType.includes(transportTypeSlug)
      if (!hasTransportType) return false
    }

    return true
  })
  const { searchParamsQuery } = useTourSearchResultsQuery()
  const [isImageLoading, setImageLoading] = useState(true)

  // Filtrelenmiş veriden ilk item'ı seç, yoksa tüm veriden seç
  const availableItems =
    filteredRelatedItems.length > 0 ? filteredRelatedItems : sortedRelatedItems
  const [selectedTour, setSelectedTour] = useState<TourSearchResultSearchItem>(
    availableItems[0]
  )

  // Filtre değiştiğinde selectedTour'u güncelle
  useEffect(() => {
    if (availableItems.length > 0) {
      // Eğer mevcut selectedTour filtrelenmiş listede yoksa, ilk item'ı seç
      const isCurrentTourAvailable = availableItems.some(
        (item) => item.key === selectedTour.key
      )
      if (!isCurrentTourAvailable) {
        setSelectedTour(availableItems[0])
      }
    }
  }, [
    filterParams.departurePoints,
    filterParams.transportType,
    selectedTour.key,
  ])
  const transportType = selectedTour.transportType
  const transportTypeText =
    transportType === 1
      ? 'Uçak'
      : transportType === 2
        ? 'Otobüs'
        : transportType === 3
          ? 'Tren'
          : ''
  const detailUrl = serializeTourDetailPageParams('/tour/detail', {
    productKey: selectedTour.key,
    slug: selectedTour.slug,
    searchToken: searchParamsQuery.data?.data?.params.searchToken,
    sessionToken: searchParamsQuery.data?.data?.sessionToken,
    isCruise: searchParams.isCruise,
  }) as Route
  const startDate = selectedTour.startDate
  const endDate = selectedTour.endDate
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1

  const [descOpened, setDescOpened] = useState(false)
  const [wayOpened, setWayOpened] = useState(false)
  return (
    <div className='grid grid-cols-1 rounded-md border border-gray-300 shadow md:grid-cols-5'>
      <div className='grid gap-3 p-3 md:col-span-4 md:gap-5'>
        <div className='grid grid-cols-12 items-start gap-4'>
          <div className='col-span-12 md:col-span-5'>
            <Box className='relative'>
              <Transition
                mounted={isImageLoading}
                transition='fade'
                duration={400}
                timingFunction='ease'
              >
                {(styles) => (
                  <div
                    style={styles}
                    className='absolute start-0 end-0 top-0 bottom-0 rounded-md border bg-white p-2 transition-opacity duration-300'
                  >
                    <Skeleton className='size-full' radius={'md'} />
                  </div>
                )}
              </Transition>
              <AspectRatio>
                <Image
                  mah={230}
                  loading='lazy'
                  src={selectedTour.imageUrl}
                  alt={selectedTour.title}
                  radius={'md'}
                  onLoad={() => {
                    setImageLoading(false)
                  }}
                />
              </AspectRatio>
              <div className='absolute start-0 end-0 top-0 bottom-0 m-2 rounded-md'>
                <Badge className='bg-orange-800 p-3 text-white opacity-90 shadow-lg'>
                  Son {selectedTour.quota} kişi
                </Badge>
              </div>
            </Box>
          </div>
          <div className='col-span-12 flex flex-col gap-3 md:col-span-7'>
            <Title order={3} className='text-md font-semibold lg:text-lg'>
              {selectedTour.title}
            </Title>
            {selectedTour.departurePoints &&
              selectedTour.departurePoints.length > 0 && (
                <div className='text-sm font-medium text-blue-800'>
                  {selectedTour.departurePoints
                    .map((departurePoint) => departurePoint.title)
                    .join(',')}{' '}
                  Çıkışlı
                </div>
              )}
            <div>
              <TourDropdown
                data={availableItems}
                onSelect={setSelectedTour}
                defaultItem={selectedTour}
              />
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <FiSun size={22} className='text-blue-800' />
              {totalNights} gece {totalDays} Gün
            </div>
            {selectedTour.cities.length > 0 && (
              <Popover
                width={200}
                position='bottom-start'
                shadow='md'
                opened={wayOpened}
                onChange={setWayOpened}
              >
                <Popover.Target>
                  <div
                    className='flex w-40 cursor-pointer items-center gap-2'
                    role='button'
                    onClick={() => setWayOpened((o) => !o)}
                  >
                    <MdOutlineLocationCity
                      size={23}
                      className='text-blue-800'
                    />
                    Tur Güzergahı
                  </div>
                </Popover.Target>

                <Popover.Dropdown className='max-w-[150px] rounded-2xl bg-gray-200 text-sm text-black'>
                  {selectedTour.cities.map((item, index) => (
                    <div key={index}>
                      {index + 1}. Gün: {item.title}
                    </div>
                  ))}
                </Popover.Dropdown>
              </Popover>
            )}
            {selectedTour.description && (
              <Popover
                opened={descOpened}
                onChange={setDescOpened}
                position='top-start'
                withArrow
                shadow='md'
              >
                <Popover.Target>
                  <div
                    className='flex w-40 cursor-pointer items-center gap-3'
                    role='button'
                    onClick={() => setDescOpened((o) => !o)}
                  >
                    <LiaInfoCircleSolid size={18} className='text-blue-800' />
                    Tur Açıklaması
                  </div>
                </Popover.Target>

                <Popover.Dropdown className='max-w-[250px] rounded-2xl bg-gray-200 text-sm text-black'>
                  {selectedTour.description}
                </Popover.Dropdown>
              </Popover>
            )}
            {transportTypeText && (
              <div className='flex items-center gap-3 text-sm'>
                {transportType === 1 && (
                  <RiPlaneFill size={22} className='text-blue-800' />
                )}
                {transportType === 2 && (
                  <FaBus size={18} className='text-blue-800' />
                )}
                {transportType === 3 && (
                  <RiTrainFill size={22} className='text-blue-800' />
                )}
                <div> Gidiş Dönüş {transportTypeText} ile</div>
              </div>
            )}
          </div>
        </div>
        {/* <input value={JSON.stringify(selectedTour)} />  */}
      </div>

      <div className='flex items-center justify-between p-3 md:col-span-1 md:flex-col md:items-end md:justify-end md:border-l md:text-end'>
        <div>
          <small className='text-xs text-gray-500'>
            Çift Kişilik Oda Kişi Başı
          </small>

          <div className='leading-tight lg:col-span-6'>
            <small>
              {formatCurrency(
                selectedTour.totalPrice.value,
                selectedTour.totalPrice.currency ?? 'TRY'
              )}
            </small>
            <div className='mb-3 text-2xl font-semibold'>
              {formatCurrency(selectedTour.tlPrice.value)}
            </div>
          </div>
        </div>
        <div className='w-30 md:w-full'>
          <Button
            className='text-lg'
            size='md'
            radius={'md'}
            component={Link}
            href={detailUrl}
            rightSection={<MdOutlineChevronRight size={18} />}
            fullWidth
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}
