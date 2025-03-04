'use client'

import { BusSearchItem } from './components/search-item'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Container,
  Drawer,
  NativeSelect,
  rem,
  Skeleton,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'

import {
  useBusSearchInitPaymentProcess,
  useBusSeatMutation,
  useSearchRequest,
  useSeatControlMutation,
} from '@/app/bus/useSearchResults'
import {
  BusGender,
  BusSearchResultItem,
  Seat,
  SeatColors,
} from '@/app/bus/types'
import { BusFrame } from '@/app/bus/search-results/components/bus-frame'
import { reservationParsers } from '@/app/reservation/searchParams'
import {
  busSearchParams,
  filterParsers,
  SortOrderEnums,
} from '@/modules/bus/searchParmas'
import { useFilterActions } from './filter-actions'
import { cleanObj } from '@/libs/util'

const BusSearchResults: React.FC = () => {
  const [searchParams] = useQueryStates(busSearchParams)
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)

  const searchResults = useSearchRequest()
  const seatRequestMutation = useBusSeatMutation()
  const seatControlMutation = useSeatControlMutation()
  const initBusPaymentProcess = useBusSearchInitPaymentProcess()

  const seatData = seatRequestMutation.data
  const router = useTransitionRouter()

  const [seatSelectIsOpened, { open: openSeatSelect, close: closeSeatSelect }] =
    useDisclosure(false)
  const [selectedBus, setSelectedBus] = useState<BusSearchResultItem | null>()
  const [selectedSeats, setSelectedSeatsData] = useState<Seat[]>([])

  if (searchResults.hasNextPage && !searchResults.isFetchingNextPage) {
    searchResults.fetchNextPage()
  }

  const handleBusSeatSelect = (bus: BusSearchResultItem) => {
    setSelectedBus(bus)
    openSeatSelect()

    seatRequestMutation.mutate(bus.key)
  }

  const handleCheckSeatStatus = async () => {
    const productKey = selectedBus?.key

    if (productKey) {
      const response = await seatControlMutation.mutateAsync({
        selectedSeats: selectedSeats.map((seat, paxId) => ({
          ...seat,
          paxId: paxId + 1,
        })),
        productKey,
      })

      if (response) {
        const resParams = createSerializer(reservationParsers)

        const paymentResponse =
          await initBusPaymentProcess.mutateAsync(productKey)

        if (paymentResponse?.busJourney && paymentResponse.busJourney.key) {
          const url = resParams('/reservation', {
            productKey: paymentResponse?.busJourney.key,
            searchToken: searchParams.searchToken,
            sessionToken: searchParams.sessionToken,
          })

          router.push(url)
        }
      }

      setSelectedSeatsData([])
    }
  }

  const searchResultPages = searchResults.data?.pages
  const hasSearchResult = !(
    !searchResults.isLoading &&
    !searchResults.hasNextPage &&
    searchResultPages?.some((item) =>
      item?.searchResults.some((results) => results.items.length === 0)
    )
  )

  const busSearchResults = searchResultPages?.flatMap((bus) => {
    return bus?.searchResults.flatMap((result) => result.items)
  }) as BusSearchResultItem[] | null

  const filteredSearchResults = useFilterActions(busSearchResults ?? [])

  const busTypeChecks = [
    ...new Set(busSearchResults?.map((bus) => bus.busType)),
  ]
  const destinationChecks = [
    ...new Set(busSearchResults?.map((bus) => bus.destination)),
  ]
  const originChecks = [...new Set(busSearchResults?.map((bus) => bus.origin))]
  const companyChecks = [
    ...new Set(busSearchResults?.map((bus) => bus.company)),
  ]

  if (!hasSearchResult) {
    return (
      <div className='container py-3'>
        <Alert color='red'>
          <div> Sonuç bulunamadı.</div>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <div className='relative'>
        {searchResults.isLoading ||
          (searchResults.isFetching && (
            <div className='absolute start-0 end-0 top-0'>
              <Skeleton h={5} title='Seferler sorgulanıyor' />
            </div>
          ))}
        <div className='@container pt-5 md:pt-10'>
          <Container>
            <div className='grid items-start gap-4 pb-10 md:grid-cols-4 md:gap-3 md:pb-20'>
              <div className='md:col-span-1'>
                {searchResults.isLoading || searchResults.isFetching ? (
                  <div>
                    {' '}
                    <Skeleton h={20} />{' '}
                  </div>
                ) : (
                  <>
                    <div className='flex justify-between'>
                      <Title order={2} fz={'h4'} mb={rem(20)}>
                        Filtreler
                      </Title>

                      <div
                        hidden={
                          Object.keys(cleanObj(filterParams)).length === 0
                        }
                      >
                        <UnstyledButton
                          fz='xs'
                          className='font-semibold text-blue-500'
                          onClick={() => {
                            setFilterParams(null)
                          }}
                        >
                          Temizle
                        </UnstyledButton>
                      </div>
                    </div>
                    <Accordion>
                      <Accordion.Item value='busType'>
                        <Accordion.Control>Oturma Düzeni </Accordion.Control>
                        <Accordion.Panel>
                          <Checkbox.Group>
                            <Stack gap={rem(6)}>
                              {busTypeChecks.map((item, itemIndex) => {
                                return (
                                  <Checkbox
                                    key={itemIndex}
                                    label={item}
                                    value={item}
                                  />
                                )
                              })}
                            </Stack>
                          </Checkbox.Group>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='departurePoint'>
                        <Accordion.Control>Kalkış Noktası</Accordion.Control>
                        <Accordion.Panel>
                          <Checkbox.Group>
                            <Stack gap={rem(6)}>
                              {originChecks.map((item, itemIndex) => {
                                return (
                                  <Checkbox
                                    key={itemIndex}
                                    label={item}
                                    value={item}
                                  />
                                )
                              })}
                            </Stack>
                          </Checkbox.Group>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='arrivalPoint'>
                        <Accordion.Control>Varış Noktası</Accordion.Control>
                        <Accordion.Panel>
                          <Checkbox.Group>
                            <Stack gap={rem(6)}>
                              {destinationChecks.map((item, itemIndex) => {
                                return (
                                  <Checkbox
                                    key={itemIndex}
                                    label={item}
                                    value={item}
                                  />
                                )
                              })}
                            </Stack>
                          </Checkbox.Group>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value='companies'>
                        <Accordion.Control>Firmalar</Accordion.Control>
                        <Accordion.Panel>
                          <Checkbox.Group>
                            <Stack gap={rem(6)}>
                              {companyChecks?.map((item, itemIndex) => {
                                return (
                                  <Checkbox
                                    key={itemIndex}
                                    label={item}
                                    value={item}
                                  />
                                )
                              })}
                            </Stack>
                          </Checkbox.Group>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </>
                )}
              </div>
              <div className='md:col-span-3'>
                <div className='flex justify-between'>
                  <div></div>
                  <div>
                    <NativeSelect
                      size='xs'
                      data={[
                        {
                          label: 'Fiyat Artan',
                          value: SortOrderEnums.priceAsc,
                        },
                        {
                          label: 'Fiyat Azalan',
                          value: SortOrderEnums.priceDesc,
                        },
                        {
                          label: 'Kalkış Saatine Göre',
                          value: SortOrderEnums.hourAsc,
                        },
                      ]}
                      value={order}
                      onChange={({ currentTarget: { value } }) => {
                        setFilterParams({
                          order: value as SortOrderEnums,
                        })
                      }}
                    />
                  </div>
                </div>
                <div className='grid gap-4 pt-4'>
                  {filteredSearchResults?.map((searchItem) => (
                    <BusSearchItem
                      key={searchItem.key}
                      searchItem={searchItem}
                      onSelect={handleBusSeatSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Drawer
        position='right'
        opened={seatSelectIsOpened}
        onClose={() => {
          if (seatControlMutation.isPending || initBusPaymentProcess.isPending)
            return
          setSelectedSeatsData([])
          setSelectedBus(null)

          closeSeatSelect()
        }}
        title={selectedBus?.company}
        radius={'lg'}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {seatRequestMutation.isPending ? (
          <Skeleton h={600} w={'75%'} radius={'xl'} mx='auto' />
        ) : null}
        {seatData?.seats.length ? (
          <div>
            <BusFrame
              seats={seatData.seats}
              maxSelectCountReached={selectedSeats.length === 4}
              onSeatSelect={(gender, selectedSeatsData) => {
                setSelectedSeatsData((prev) => {
                  const nextState =
                    gender === BusGender.EMPTY
                      ? [
                          ...prev.filter(
                            (item) => item.no !== selectedSeatsData.no
                          ),
                        ]
                      : [...prev, { ...selectedSeatsData, gender: gender }]

                  return nextState
                })
              }}
            />
            <div className='flex gap-3 py-3'>
              {selectedSeats.length === 0 ? <div>Koltuk Seçiniz.</div> : null}
              {selectedSeats.map((seat, seatIndex) => {
                console.log(seat)
                const gender = seat.gender
                const isMale = gender === BusGender.MALE
                const isWoman = gender === BusGender.WOMAN

                const backgroundColor = isMale
                  ? `var(${SeatColors.MALE})`
                  : isWoman
                    ? `var(${SeatColors.WOMAN})`
                    : ''

                return (
                  <div
                    key={seatIndex}
                    className='flex size-[36px] items-center justify-center rounded-t-lg border-b-4 border-b-gray-600 pt-1 text-sm text-black'
                    style={{
                      backgroundColor,
                    }}
                  >
                    <div className='relative'>{seat.no}</div>
                  </div>
                )
              })}
            </div>
            <div className='flex justify-end pt-4'>
              <div>
                <Button
                  disabled={!selectedSeats.length}
                  onClick={handleCheckSeatStatus}
                  loading={
                    seatControlMutation.isPending ||
                    initBusPaymentProcess.isPending
                  }
                >
                  Onayla ve Devam Et
                </Button>
              </div>
            </div>
          </div>
        ) : (
          seatData?.seats.length === 0 &&
          seatRequestMutation.isSuccess && <div>No seat data</div>
        )}
      </Drawer>
    </>
  )
}

export { BusSearchResults }
