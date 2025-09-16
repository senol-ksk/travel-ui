'use client'
import {
  Accordion,
  Alert,
  Container,
  LoadingOverlay,
  NativeSelect,
  Skeleton,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IoSearchSharp } from 'react-icons/io5'
import dayjs from 'dayjs'

import { CyprusSearchEngine } from '@/modules/cyprus'
import { useCyprusSearchResults } from './useSearchResults'
import { cyprusSearchParams } from '@/modules/cyprus/searchParams'
import { CyprusSearchResult } from './cyprus-result'
import { SearchByName } from '@/app/hotel/search-results/components/search-by-name'
import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { DestinationIds } from '@/app/hotel/search-results/components/filters/destinationIds'
import { Themes } from '@/app/hotel/search-results/components/filters/themes'
import { PensionTypes } from '@/app/hotel/search-results/components/filters/pension-types'

const CyprusSearchResults = () => {
  const [searchParams] = useQueryStates(cyprusSearchParams)
  const { cyprusSearchResultsQuery, searchToken, sessionToken } =
    useCyprusSearchResults()

  const [isSearchEngineOpened, { toggle: toggleSearchEngineVisibility }] =
    useDisclosure(false)

  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const totalPassengerCount = () => {
    const total = searchParams.rooms.reduce((a, b) => {
      a += b.adult + b.child
      return a
    }, 0)
    return total
  }

  const totalCount =
    cyprusSearchResultsQuery?.data?.searchResults[0]?.totalHotelFound ?? 0

  const sortOptions = [
    { label: 'Fiyata Göre Artan', value: 'price-asc' },
    { label: 'Fiyata Göre Azalan', value: 'price-desc' },
    { label: 'Popüler Paketler', value: 'popular' },
    { label: 'İsme Göre (A-Z)', value: 'name-asc' },
    { label: 'İsme Göre (Z-A)', value: 'name-desc' },
  ]
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )
  const { orderBy, ...restFilterParams } = filterParams

  console.log(' items', cyprusSearchResultsQuery?.data?.searchResults[0].items)
  console.log(
    'Hotel Infos:',
    cyprusSearchResultsQuery?.data?.searchResults.at(-1)?.hotelInfos
  )
  return (
    <>
      <div className='border-b md:py-4'>
        <Container>
          <div className='relative py-2 text-xs font-semibold text-blue-800 md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />

            <div className='flex items-center gap-2'>
              <div>{searchParams.slug}</div>
              <div>|</div>
              <div>
                {dayjs(searchParams.checkInDate).format('DD MMMM')} -{' '}
                {dayjs(searchParams.checkOutDate).format('DD MMMM')}
              </div>
              <div>|</div>
              <div>{totalPassengerCount()} Yolcu</div>
              <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
                <IoSearchSharp size={24} className='text-blue-800' />
              </div>
            </div>
          </div>
          <div
            className={`${isBreakPointMatchesMd || isSearchEngineOpened ? 'block' : 'hidden'}`}
          >
            {searchParams.slug && (
              <div className='pb-3 md:pb-0'>
                <CyprusSearchEngine
                  defaultValues={{
                    rooms: searchParams.rooms,
                    checkInDate: searchParams.checkInDate,
                    checkOutDate: searchParams.checkOutDate,
                    isFlight: searchParams.isFlight,
                    isTransfer: searchParams.isTransfer,
                    slug: searchParams.slug,
                    airportCode: searchParams.airportCode ?? '',
                  }}
                />
              </div>
            )}
          </div>
        </Container>
      </div>

      {cyprusSearchResultsQuery.isLoading && (
        <div className='relative'>
          <div className='absolute start-0 end-0'>
            <Skeleton h={6} radius={0} />
          </div>
        </div>
      )}

      <Container className='px-0'>
        <div className='md:py-10'>
          <div className='grid items-start gap-4 md:grid-cols-4 md:gap-2'>
            <div className='hidden md:col-span-1 md:block'>
              <div className='relative'>
                <LoadingOverlay
                  visible={cyprusSearchResultsQuery.isLoading}
                  zIndex={1000}
                  overlayProps={{ radius: 'sm', blur: 2 }}
                  loaderProps={{ color: 'yellow', type: 'bars' }}
                />
                <div className='flex justify-between'>
                  <Title className='text-xl font-medium'>Filtreler</Title>
                  <UnstyledButton
                    hidden={!Object.values(restFilterParams).find(Boolean)}
                    fz='xs'
                    className='px-4 font-semibold text-blue-500'
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
                      'destinationIds',
                      'pensionTypes',
                      'themes',
                    ]}
                    multiple
                    classNames={{
                      root: 'filter-accordion',
                      control: 'text-md font-medium',
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
                    {/*içi boş bunların */}
                    <Accordion.Item value='destinationIds'>
                      <Accordion.Control>Yakın Çevre</Accordion.Control>
                      <Accordion.Panel>
                        {cyprusSearchResultsQuery.data?.searchResults.at(-1)
                          ?.destinationsInfo && (
                          <DestinationIds
                            destinationsInfo={
                              cyprusSearchResultsQuery.data?.searchResults.at(
                                -1
                              )?.destinationsInfo ?? []
                            }
                          />
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value='pensionTypes'>
                      <Accordion.Control>Konaklama Tipi</Accordion.Control>
                      <Accordion.Panel>
                        {cyprusSearchResultsQuery.data?.searchResults.at(-1)
                          ?.pensionTypes && (
                          <PensionTypes
                            data={
                              cyprusSearchResultsQuery.data?.searchResults.at(
                                -1
                              )?.pensionTypes
                            }
                          />
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value='themes'>
                      <Accordion.Control>Temalar</Accordion.Control>
                      <Accordion.Panel>
                        {cyprusSearchResultsQuery.data?.searchResults.at(-1)
                          ?.themes && (
                          <Themes
                            data={
                              cyprusSearchResultsQuery.data?.searchResults.at(
                                -1
                              )?.themes
                            }
                          />
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
            <div className='grid gap-4 pb-20 md:col-span-3'>
              <div className='grid gap-3 md:flex md:justify-between md:gap-1'>
                <Skeleton visible={cyprusSearchResultsQuery.isLoading}>
                  {!cyprusSearchResultsQuery.isLoading && totalCount > 0 && (
                    <div className='hidden items-center gap-2 md:flex'>
                      <div>
                        <span className='text-lg font-bold'>
                          Kıbrıs Otelleri
                        </span>{' '}
                        İçin{' '}
                        <span className='text-xl font-bold'>
                          {' '}
                          {totalCount}{' '}
                        </span>
                        Paket Bulundu
                      </div>
                    </div>
                  )}
                </Skeleton>

                <div className='flex items-center justify-between gap-1'>
                  <div>
                    <Skeleton
                      className='hidden items-center gap-2 md:flex'
                      visible={cyprusSearchResultsQuery.isLoading}
                    >
                      <NativeSelect
                        className='mx-1 w-50 font-medium'
                        size='sm'
                        style={{ width: 'fit-content' }}
                        data={sortOptions}
                      />
                    </Skeleton>
                  </div>
                </div>

                <Skeleton
                  className='flex items-center gap-2 px-2 md:hidden'
                  visible={cyprusSearchResultsQuery.isLoading}
                >
                  <>
                    <div>
                      <span className='text-sm'>
                        <span className='font-semibold'>Kıbrıs Otelleri</span>,
                        için Toplam{' '}
                        <span className='text-md font-semibold'>
                          {totalCount}
                        </span>{' '}
                        Paket Bulundu
                      </span>{' '}
                    </div>
                  </>
                </Skeleton>
              </div>

              {!cyprusSearchResultsQuery.isLoading && totalCount === 0 && (
                <Alert color='red' title='Sonuç bulunamadı'>
                  Aradığınız kriterlerde sonuç bulunamadı.
                </Alert>
              )}

              {cyprusSearchResultsQuery.isLoading ? (
                <>
                  {[1, 2, 3].map((index) => (
                    <div key={index} className='mb-4 rounded-lg border p-4'>
                      <div className='flex gap-4'>
                        <Skeleton height={120} width={120} radius='md' />
                        <div className='flex-1 space-y-3'>
                          <Skeleton height={20} width='60%' />
                          <Skeleton height={16} width='40%' />
                          <Skeleton height={16} width='80%' />
                          <div className='flex gap-2'>
                            <Skeleton height={24} width={60} />
                            <Skeleton height={24} width={60} />
                            <Skeleton height={24} width={60} />
                          </div>
                          <div className='flex justify-between'>
                            <Skeleton height={20} width='30%' />
                            <Skeleton height={32} width={100} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                cyprusSearchResultsQuery?.data?.searchResults
                  .map((searchResult) => {
                    return searchResult.items.map((item) => {
                      const hotelInfo = searchResult.hotelInfos.find(
                        (hotel) => hotel.id === item.hotelId
                      )
                      const roomDetail =
                        searchResult.roomDetails[item.rooms[0]?.key]

                      return (
                        <CyprusSearchResult
                          key={item.key}
                          hotelInfo={hotelInfo}
                          resultItem={item}
                          roomDetail={roomDetail}
                          searchToken={searchToken || ''}
                          sessionToken={sessionToken || ''}
                          searchParams={searchParams}
                        />
                      )
                    })
                  })
                  .flat()
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export { CyprusSearchResults }
