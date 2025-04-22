'use client'

import {
  Accordion,
  Alert,
  Button,
  Container,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Skeleton,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'
import { useDisclosure, useMounted } from '@mantine/hooks'

import { HotelSearchEngine } from '@/modules/hotel'

import {
  hotelFilterSearchParams,
  hotelSearchParamParser,
  HotelSortOrderEnums,
} from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './useSearchQueries'
import { HotelSearchResultItem } from './results-item'
import { HotelSearchResultHotelInfo } from '../types'
import { HotelMap } from './components/maps'
import { PriceRangeSlider } from './price-range'
import { SearchByName } from './components/search-by-name'
import { DestinationIds } from './components/filters/destinationIds'
import { PensionTypes } from './components/filters/pension-types'
import { Themes } from './components/filters/themes'

type IProps = {
  slug?: string
}

const HotelSearchResults: React.FC<IProps> = ({ slug }) => {
  const mounted = useMounted()
  const [searchParams] = useQueryStates(hotelSearchParamParser)

  const { hotelSearchRequestQuery, searchParamsQuery, searchQueryStatus } =
    useSearchResultParams({ slug })
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )
  const [isMapsModalOpened, { open: openMapsModal, close: closeMapsModal }] =
    useDisclosure(false)

  const [hotelInfo, setHotelInfo] = useState<HotelSearchResultHotelInfo>()

  const handleLoadMoreActions = async () => {
    hotelSearchRequestQuery.fetchNextPage()
  }

  const { orderBy, ...restFilterParams } = filterParams

  return (
    <>
      <div className='border-b py-4'>
        <Container>
          {searchParams.destination && (
            <HotelSearchEngine
              defaultValues={{
                checkinDate: searchParams.checkinDate,
                checkoutDate: searchParams.checkoutDate,
                destination: {
                  id: searchParams.destinationId ?? 0,
                  name: searchParams.destination ?? '',
                  slug: searchParams.slug ?? '',
                  type: searchParams.type ?? 0,
                },
                rooms: searchParams.rooms,
              }}
            />
          )}
        </Container>
      </div>
      {(hotelSearchRequestQuery.isLoading || searchParamsQuery.isLoading) && (
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
                <div className='relative'>
                  <LoadingOverlay
                    visible={
                      hotelSearchRequestQuery.isLoading ||
                      searchParamsQuery.isLoading ||
                      searchQueryStatus.current === 'loading'
                    }
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 2 }}
                    loaderProps={{ color: 'yellow', type: 'bars' }}
                  />
                  <div className='flex justify-between'>
                    <Title order={2} fz='h4'>
                      Filtreler
                    </Title>
                    <UnstyledButton
                      hidden={!Object.values(restFilterParams).find(Boolean)}
                      fz='xs'
                      className='font-semibold text-blue-500'
                      onClick={() => {
                        setFilterParams(null)
                      }}
                    >
                      Temizle
                    </UnstyledButton>
                  </div>
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
                          <SearchByName
                            defaultValue={restFilterParams.hotelName}
                            onClear={() => {
                              setFilterParams({
                                hotelName: null,
                              })
                            }}
                            onSearchClick={(value) => {
                              setFilterParams({
                                hotelName: value,
                              })
                            }}
                          />
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='priceRange'>
                        <Accordion.Control>Fiyat Aralığı</Accordion.Control>
                        <Accordion.Panel>
                          <div className='p-2'>
                            {!hotelSearchRequestQuery.isLoading &&
                            !hotelSearchRequestQuery.isFetching &&
                            hotelSearchRequestQuery.data &&
                            hotelSearchRequestQuery.data.pages.length &&
                            hotelSearchRequestQuery.data.pages.at(-1) &&
                            hotelSearchRequestQuery.data.pages.at(-1)
                              ?.searchResults.length &&
                            hotelSearchRequestQuery.data.pages.at(-1)
                              ?.searchResults[0].maxPrice &&
                            hotelSearchRequestQuery.data?.pages
                              .at(-1)
                              ?.searchResults.at(-1)?.minPrice &&
                            hotelSearchRequestQuery.data?.pages
                              .at(-1)
                              ?.searchResults.at(-1)?.maxPrice ? (
                              <PriceRangeSlider
                                minPrice={
                                  restFilterParams?.priceRange
                                    ? restFilterParams.priceRange[0]
                                    : (hotelSearchRequestQuery.data?.pages
                                        .at(-1)
                                        ?.searchResults.at(-1)?.minPrice
                                        .value ?? 0)
                                }
                                maxPrice={
                                  restFilterParams?.priceRange
                                    ? restFilterParams.priceRange[1]
                                    : (hotelSearchRequestQuery.data?.pages
                                        .at(-1)
                                        ?.searchResults.at(-1)?.maxPrice
                                        .value ?? 0)
                                }
                                defaultRanges={[
                                  hotelSearchRequestQuery.data?.pages
                                    .at(-1)
                                    ?.searchResults.at(-1)?.minPrice.value ?? 0,
                                  hotelSearchRequestQuery.data?.pages
                                    .at(-1)
                                    ?.searchResults.at(-1)?.maxPrice.value ?? 0,
                                ]}
                              />
                            ) : null}
                          </div>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='destinationIds'>
                        <Accordion.Control>Yakın Çevre</Accordion.Control>
                        <Accordion.Panel>
                          {hotelSearchRequestQuery.data?.pages
                            .at(-1)
                            ?.searchResults.at(-1)?.destinationsInfo && (
                            <DestinationIds
                              destinationsInfo={
                                hotelSearchRequestQuery.data?.pages
                                  .at(-1)
                                  ?.searchResults.at(-1)?.destinationsInfo
                              }
                            />
                          )}
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='pensionTypes'>
                        <Accordion.Control>Konaklama Tipi</Accordion.Control>
                        <Accordion.Panel>
                          {hotelSearchRequestQuery.data?.pages
                            .at(-1)
                            ?.searchResults.at(-1)?.pensionTypes && (
                            <PensionTypes
                              data={
                                hotelSearchRequestQuery.data?.pages
                                  .at(-1)
                                  ?.searchResults.at(-1)?.pensionTypes
                              }
                            />
                          )}
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='themes'>
                        <Accordion.Control>Temalar</Accordion.Control>
                        <Accordion.Panel>
                          {hotelSearchRequestQuery.data?.pages
                            .at(-1)
                            ?.searchResults.at(-1)?.themes && (
                            <Themes
                              data={
                                hotelSearchRequestQuery.data?.pages
                                  .at(-1)
                                  ?.searchResults.at(-1)?.themes
                              }
                            />
                          )}
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              )}
            </div>
            <div className='grid gap-4 pb-20 md:col-span-3'>
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
              {!hotelSearchRequestQuery.isFetching &&
                hotelSearchRequestQuery.data?.pages.filter(
                  (page) =>
                    page?.searchResults.filter(
                      (searchresults) => searchresults.items.length > 0
                    ).length
                ).length === 0 &&
                searchQueryStatus.current === 'ended' && (
                  <Alert color='red' title='Sonuç bulunamadı'>
                    Aradığınız kriterlerde sonuç bulunamadı.
                  </Alert>
                )}
              {hotelSearchRequestQuery.data?.pages.map((page) => {
                if (!page) return null
                return (
                  page.searchResults.length &&
                  page.searchResults.map((results, resultIndex) => {
                    const hotelInfos = results.hotelInfos
                    const roomDetails =
                      results.roomDetails && Object.values(results.roomDetails)

                    // if (slug) {
                    //   return hotelInfos.map((result) => {
                    //     return (
                    //       <HotelSearchResultItem
                    //         searchToken={
                    //           searchParamsQuery.data?.hotelSearchApiRequest
                    //             .hotelSearchModuleRequest.searchToken as string
                    //         }
                    //         sessionToken={
                    //           searchParamsQuery.data?.hotelSearchApiRequest
                    //             .hotelSearchModuleRequest.sessionToken as string
                    //         }
                    //         key={result.id}
                    //         hotelInfo={hotelInfo}
                    //         onMapClick={() => {
                    //           openMapsModal()
                    //           setHotelInfo(hotelInfo)
                    //         }}
                    //       />
                    //     )
                    //   })
                    // }

                    return results.items.map((result) => {
                      const hotelInfo = hotelInfos.find(
                        (hotelInfo) => hotelInfo.id === result.hotelId
                      )
                      const roomDetail = roomDetails?.find(
                        (room) => room.roomKey == result.rooms[0].key
                      )

                      return (
                        <HotelSearchResultItem
                          searchToken={
                            searchParamsQuery.data?.hotelSearchApiRequest
                              .hotelSearchModuleRequest.searchToken as string
                          }
                          sessionToken={
                            searchParamsQuery.data?.hotelSearchApiRequest
                              .hotelSearchModuleRequest.sessionToken as string
                          }
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
