'use client'

import {
  Accordion,
  Alert,
  Button,
  Container,
  Drawer,
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
import { useMediaQuery } from '@mantine/hooks'
import { FaCheck } from 'react-icons/fa'
import { hotelSearchRequestModel } from './dummy'
type IProps = {
  slug?: string
}

const HotelSearchResults: React.FC<IProps> = ({ slug }) => {
  const mounted = useMounted()
  const [searchParams] = useQueryStates(hotelSearchParamParser)

  const {
    hotelSearchRequestQuery,
    searchParamsQuery,
    searchQueryStatus,
    hotelCampaignsQuery,
  } = useSearchResultParams({ slug })
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const [isMapsModalOpened, { open: openMapsModal, close: closeMapsModal }] =
    useDisclosure(false)

  const [hotelInfo, setHotelInfo] = useState<HotelSearchResultHotelInfo>()

  const handleLoadMoreActions = async () => {
    hotelSearchRequestQuery.fetchNextPage()
  }
  const filterOptions = [
    {
      label: 'Fiyat Artan',
      value: HotelSortOrderEnums.priceAscending,
    },
    {
      label: 'Fiyat Azalan',
      value: HotelSortOrderEnums.priceDescending,
    },
  ]
  const totalCount =
    searchParamsQuery.data?.hotelSearchResponse.totalHotelFound ?? 0

  const { orderBy, ...restFilterParams } = filterParams
  const [opened, { open, close }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

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
      <Container className='px-0'>
        <div className='py-5 lg:py-10'>
          <div className='grid items-start gap-4 md:grid-cols-8 md:gap-5'>
            <div className='hidden md:col-span-2 md:block'>
              {isMobile ? (
                <Drawer opened={opened} onClose={close}>
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
                        <Title order={2} className='text-xl font-bold'>
                          Filtreler
                        </Title>
                        <UnstyledButton
                          hidden={
                            !Object.values(restFilterParams).find(Boolean)
                          }
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
                          defaultValue={[
                            'byName',
                            'priceRange',
                            'destinationIds',
                            'pensionTypes',
                            'themes',
                          ]}
                          multiple
                          classNames={{
                            control: 'p-2',
                            label: 'p-0 text-md font-semibold',
                            content: 'p-0 text-xl',
                          }}
                        >
                          <Accordion.Item value='byName'>
                            <Accordion.Control>
                              Otel Adına Göre
                            </Accordion.Control>
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
                                        ?.searchResults.at(-1)?.minPrice
                                        .value ?? 0,
                                      hotelSearchRequestQuery.data?.pages
                                        .at(-1)
                                        ?.searchResults.at(-1)?.maxPrice
                                        .value ?? 0,
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
                            <Accordion.Control>
                              Konaklama Tipi
                            </Accordion.Control>
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
                </Drawer>
              ) : (
                <div>
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
                        <Title order={2} className='text-xl font-bold'>
                          Filtreler
                        </Title>
                        <UnstyledButton
                          hidden={
                            !Object.values(restFilterParams).find(Boolean)
                          }
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
                          defaultValue={[
                            'byName',
                            'priceRange',
                            'destinationIds',
                            'pensionTypes',
                            'themes',
                          ]}
                          multiple
                          classNames={{
                            control: 'p-2 ',
                            label: 'p-0  text-md font-semibold',
                            content: 'p-0 text-xl',
                          }}
                        >
                          <Accordion.Item value='byName'>
                            <Accordion.Control>
                              Otel Adına Göre
                            </Accordion.Control>
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
                                        ?.searchResults.at(-1)?.minPrice
                                        .value ?? 0,
                                      hotelSearchRequestQuery.data?.pages
                                        .at(-1)
                                        ?.searchResults.at(-1)?.maxPrice
                                        .value ?? 0,
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
                            <Accordion.Control>
                              Konaklama Tipi
                            </Accordion.Control>
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
              )}
            </div>
            <div className='grid gap-4 pb-20 md:col-span-6'>
              <div className='grid gap-3 md:flex md:gap-1'>
                <Skeleton
                  visible={
                    hotelSearchRequestQuery.isLoading ||
                    searchParamsQuery.isLoading ||
                    searchQueryStatus.current === 'loading'
                  }
                >
                  <div className='hidden items-center gap-2 md:flex'>
                    <div>
                      <span className='text-lg font-bold'>
                        {searchParams.destination}, Otelleri
                      </span>{' '}
                      için toplam {totalCount} tesis bulduk!
                    </div>
                  </div>
                </Skeleton>

                <div className='flex items-center justify-between gap-1'>
                  <Skeleton
                    className='w-auto'
                    visible={
                      hotelSearchRequestQuery.isLoading ||
                      searchParamsQuery.isLoading ||
                      searchQueryStatus.current === 'loading'
                    }
                  >
                    <Button
                      size='sm'
                      color='black'
                      className='mx-1 flex border-gray-400 px-8 font-medium md:hidden'
                      variant='outline'
                      onClick={open}
                    >
                      Filtreler
                    </Button>
                  </Skeleton>
                  <div>
                    <Skeleton
                      className='hidden items-center gap-2 md:flex'
                      visible={
                        hotelSearchRequestQuery.isLoading ||
                        searchParamsQuery.isLoading ||
                        searchQueryStatus.current === 'loading'
                      }
                    >
                      {filterOptions.map((option) => (
                        <Button
                          size='sm'
                          className={
                            filterParams.orderBy === option.value
                              ? 'border-0 bg-blue-200 font-medium text-blue-700'
                              : 'border-gray-400 font-medium text-black hover:bg-blue-50 hover:text-blue-700'
                          }
                          key={option.value}
                          leftSection={
                            filterParams.orderBy === option.value ? (
                              <FaCheck />
                            ) : (
                              ''
                            )
                          }
                          color='blue'
                          variant={
                            filterParams.orderBy === option.value
                              ? 'filled'
                              : 'outline'
                          }
                          onClick={() =>
                            setFilterParams({
                              orderBy: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </Skeleton>
                  </div>

                  <div>
                    <Skeleton
                      visible={
                        hotelSearchRequestQuery.isLoading ||
                        searchParamsQuery.isLoading ||
                        searchQueryStatus.current === 'loading'
                      }
                    >
                      <NativeSelect
                        className='mx-1 w-auto font-medium'
                        size='sm'
                        style={{ width: 'fit-content' }}
                        value={filterParams.orderBy}
                        onChange={({ currentTarget: { value } }) => {
                          setFilterParams({
                            orderBy: value as HotelSortOrderEnums,
                          })
                        }}
                        data={[
                          {
                            label: 'Fiyat Artan',
                            value: HotelSortOrderEnums.priceAscending,
                          },
                          {
                            label: 'Fiyat Azalan',
                            value: HotelSortOrderEnums.priceDescending,
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

                <Skeleton
                  className='flex items-center gap-2 px-2 md:hidden'
                  visible={
                    hotelSearchRequestQuery.isLoading ||
                    searchParamsQuery.isLoading ||
                    searchQueryStatus.current === 'loading'
                  }
                >
                  {searchParams.destination && (
                    <>
                      <div>
                        <span className='text-sm font-semibold text-gray-500'>
                          {searchParams.destination}, Otelleri için toplam{' '}
                          {totalCount} tesis bulduk!
                        </span>{' '}
                      </div>
                    </>
                  )}
                </Skeleton>
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
                          campaignContents={hotelCampaignsQuery?.data}
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
