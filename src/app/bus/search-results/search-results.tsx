'use client'

import { BusSearchItem } from './components/search-item'
import { Alert, Button, Container, Drawer, Skeleton } from '@mantine/core'
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
import { busSearchParams } from '@/modules/bus/searchParmas'

const BusSearchResults: React.FC = () => {
  const [searchParams] = useQueryStates(busSearchParams)
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
        {searchResults.isLoading || searchResults.hasNextPage ? (
          <div className='absolute start-0 end-0 top-0'>
            <Skeleton h={5} title='Seferler sorgulaniyor' />
          </div>
        ) : null}
        <div className='@container pt-5 md:pt-10'>
          <Container>
            <div className='grid gap-4 md:grid-cols-4 md:gap-3'>
              <div className='relative md:col-span-1'>
                <div className='rounded-md border border-gray-300 p-3'>
                  Filter section
                </div>
                <Skeleton
                  w='100%'
                  h={'100%'}
                  top={0}
                  pos={'absolute'}
                  mah={150}
                  radius={'md'}
                  visible={searchResults.isLoading}
                />
              </div>
              <div className='grid gap-4 md:col-span-3'>
                {searchResultPages?.map((page) =>
                  page?.searchResults.map((searchResults) =>
                    searchResults.items
                      .sort(
                        (a, b) =>
                          a.bus.internetPrice.value - b.bus.internetPrice.value
                      )
                      .map((searchItem) => {
                        return (
                          <BusSearchItem
                            key={searchItem.key}
                            searchItem={searchItem}
                            onSelect={handleBusSeatSelect}
                          />
                        )
                      })
                  )
                )}
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
                console.log(gender, selectedSeatsData)
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
