'use client'

import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  CloseButton,
  Container,
  Modal,
  NativeSelect,
  Rating,
  rem,
  ScrollArea,
  Skeleton,
  Spoiler,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'
import { useDisclosure, useInputState, useMounted } from '@mantine/hooks'

import {
  hotelFilterSearchParams,
  HotelSortOrderEnums,
} from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './useSearchQueries'
import { HotelSearchResultItem } from './results-item'
import { HotelSearchResultHotelInfo, RoomDetailType } from '../types'
import { HotelMap } from './components/maps'
import { GoSearch } from 'react-icons/go'
import { PriceRangeSlider } from './price-range'
import { SearchByName } from './components/search-by-name'
import { DestinationIds } from './components/filters/destinationIds'

const HotelSearchResults: React.FC = () => {
  const mounted = useMounted()
  const { hotelSearchRequestQuery, searchParamsQuery } = useSearchResultParams()
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )
  const [isMapsModalOpened, { open: openMapsModal, close: closeMapsModal }] =
    useDisclosure(false)

  const [hotelInfo, setHotelInfo] = useState<HotelSearchResultHotelInfo>()

  const handleLoadMoreActions = async () => {
    hotelSearchRequestQuery.fetchNextPage()
  }

  const minMaxPrices = hotelSearchRequestQuery.data?.pages
    .at(-1)
    ?.searchResults.flatMap((page) => [page.minPrice, page.maxPrice])

  return (
    <>
      {(hotelSearchRequestQuery.isLoading ||
        searchParamsQuery.isLoading ||
        !hotelSearchRequestQuery.data?.pages ||
        hotelSearchRequestQuery.data?.pages.filter(
          (item) => item?.searchResults[0].items.length
        ).length === 0) && (
        <div className='relative'>
          <div className='absolute start-0 end-0'>
            <Skeleton h={6} radius={0} />
          </div>
        </div>
      )}
      <Container>
        <div className='py-5 lg:py-10'>
          <div className='grid items-start gap-4 md:grid-cols-4 md:gap-5'>
            <div className='md:col-span-1'>
              {mounted && (
                <div>
                  <Title order={2} fz='h4'>
                    Filtreler
                  </Title>
                  <div className='pt-3'>
                    <Accordion
                      defaultValue={['byName', 'priceRange']}
                      multiple
                      classNames={{
                        control: 'p-2 text-sm',
                        label: 'p-0',
                        content: 'p-2',
                      }}
                    >
                      <Accordion.Item value='byName'>
                        <Accordion.Control>Otel Adına Göre</Accordion.Control>
                        <Accordion.Panel>
                          <SearchByName />
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='priceRange'>
                        <Accordion.Control>Fiyat Aralığı</Accordion.Control>
                        <Accordion.Panel>
                          <div className='p-2'>
                            <Skeleton
                              visible={
                                hotelSearchRequestQuery.isLoading ||
                                searchParamsQuery.isLoading
                              }
                              mih={rem(50)}
                            >
                              {hotelSearchRequestQuery.data?.pages?.length && (
                                <PriceRangeSlider
                                  minPrice={
                                    minMaxPrices?.length
                                      ? minMaxPrices[0]
                                      : {
                                          value: 0,
                                          currency: null,
                                          rateValue: null,
                                        }
                                  }
                                  maxPrice={
                                    minMaxPrices?.length
                                      ? minMaxPrices[1]
                                      : {
                                          value: 0,
                                          currency: null,
                                          rateValue: null,
                                        }
                                  }
                                />
                              )}
                            </Skeleton>
                          </div>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='destinationIds'>
                        <Accordion.Control>Yakın Çevre</Accordion.Control>
                        <Accordion.Panel>
                          <Skeleton
                            visible={
                              hotelSearchRequestQuery.isFetching ||
                              searchParamsQuery.isLoading
                            }
                            mih={rem(150)}
                          >
                            {hotelSearchRequestQuery.data?.pages.length && (
                              <DestinationIds
                                destinationsInfo={
                                  hotelSearchRequestQuery.data?.pages
                                    .at(-1)
                                    ?.searchResults.at(-1)?.destinationsInfo
                                }
                              />
                            )}
                          </Skeleton>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              )}
            </div>
            <div
              className='grid gap-4 pb-20 md:col-span-3'
              style={{
                contentVisibility: 'auto',
              }}
            >
              <div className='flex gap-1'>
                <div className='ms-auto'>
                  <Skeleton
                    visible={
                      hotelSearchRequestQuery.isLoading ||
                      searchParamsQuery.isLoading
                    }
                  >
                    <NativeSelect
                      value={filterParams.orderBy}
                      onChange={({ currentTarget: { value } }) => {
                        setFilterParams({
                          orderBy: value as HotelSortOrderEnums,
                        })
                      }}
                      data={[
                        {
                          value: HotelSortOrderEnums.priceAscending,
                          label: 'Fiyat (Artan)',
                        },
                        {
                          value: HotelSortOrderEnums.priceDescending,
                          label: 'Fiyat (Azalan)',
                        },
                        {
                          value: HotelSortOrderEnums.listingRateDescending,
                          label: 'Önerilen Oteller',
                        },
                        {
                          value: HotelSortOrderEnums.nameAscending,
                          label: 'İsme Göre (A-Z)',
                        },
                        {
                          value: HotelSortOrderEnums.nameDescending,
                          label: 'İsme Göre (Z-A)',
                        },
                        {
                          value: HotelSortOrderEnums.starAscending,
                          label: 'Yıldız Sayısı (Artan)',
                        },
                        {
                          value: HotelSortOrderEnums.starDescending,
                          label: 'Yıldız Sayısı (Azalan)',
                        },
                      ]}
                    />
                  </Skeleton>
                </div>
              </div>
              {hotelSearchRequestQuery.data?.pages.map((page) => {
                if (!page) return null
                return (
                  page.searchResults.length &&
                  page.searchResults.map((results) => {
                    const hotelInfos = results.hotelInfos
                    const roomDetails =
                      results.roomDetails && Object.values(results.roomDetails)

                    return results.items.map((result) => {
                      const hotelInfo = hotelInfos.find(
                        (hotelInfo) => hotelInfo.id === result.hotelId
                      )
                      const roomDetail = roomDetails?.find(
                        (room) => room.roomKey == result.rooms[0].key
                      )

                      return (
                        <HotelSearchResultItem
                          key={result.hotelId}
                          roomDetail={roomDetail}
                          hotelInfo={hotelInfo}
                          resultItem={result}
                          onMapClick={() => {
                            openMapsModal()
                            setHotelInfo(hotelInfo)
                          }}
                        />
                      )
                    })
                  })
                )
              })}
              {hotelSearchRequestQuery.data?.pages &&
                hotelSearchRequestQuery.data?.pages?.filter(
                  (page) => page && page.searchResults[0]?.items.length > 0
                )?.length > 0 &&
                hotelSearchRequestQuery.hasNextPage && (
                  <div className='flex justify-center'>
                    <Button
                      size='md'
                      loaderProps={{
                        type: 'dots',
                      }}
                      type='button'
                      onClick={handleLoadMoreActions}
                      loading={hotelSearchRequestQuery.isFetchingNextPage}
                    >
                      Daha Fazla Yükle
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Container>
      <Modal
        opened={isMapsModalOpened}
        onClose={closeMapsModal}
        size={'xl'}
        title={hotelInfo?.name}
      >
        <HotelMap hotelInfo={hotelInfo} />
      </Modal>
    </>
  )
}

export { HotelSearchResults }
