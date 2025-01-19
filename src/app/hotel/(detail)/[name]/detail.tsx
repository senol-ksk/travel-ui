'use client'

import { Button, Skeleton, Title } from '@mantine/core'
import { useHotelDataQuery } from '../detailDataQuery'
import { HotelDetailSkeleton } from './skeletonLoader'
import { HotelRoom } from './room'
import { Fragment } from 'react'

const HotelDetailSection = () => {
  const { hotelDetailQuery, roomsQuery } = useHotelDataQuery()

  const hotelDetailData = hotelDetailQuery.data
  const hotelInfo = hotelDetailData?.data?.hotelDetailResponse?.hotelInfo
  const hotel = hotelInfo?.hotel

  if (!hotelDetailData && hotelDetailQuery.isLoading) {
    return <HotelDetailSkeleton />
  }

  if (!hotel || !hotelDetailData?.success) {
    return <div>Error or Something happened bad</div>
  }

  // if (!roomsQuery.data || roomsQuery.isFetching) {
  //   roomsQuery.fetchNextPage()
  // }

  return (
    <div className='grid gap-3 p-2 py-4 @container 2xl:container lg:gap-5'>
      <Title size={'xl'}>{hotel.name}</Title>
      {hotel.documents.length > 0 && (
        <div className='text-sm'>
          <span>
            Kültür ve Turizm Bakanlığı - Kısmı Turizm İşletme Belgesi:{' '}
          </span>
          <strong>{hotel.documents.at(0)?.no}</strong>
        </div>
      )}
      <div className='grid gap-3 @4xl:grid-cols-7'>
        <div className='@4xl:col-span-5'>
          <Title order={2} size={'lg'} pb={'md'}>
            Odanızı Seçin
          </Title>
          <div className='grid gap-3'>
            {roomsQuery.isLoading && (
              <div>
                <div className='text-center text-gray-500'>
                  Odalar yükleniyor
                </div>
                <div className='flex gap-2 rounded border p-2'>
                  <Skeleton h={120} radius={'md'} />
                  <Skeleton h={120} radius={'md'} />
                  <Skeleton h={120} radius={'md'} />
                </div>
              </div>
            )}
            {roomsQuery.data?.pages.map((page, pageIndex) => {
              const roomDetails = page?.data?.hotelDetailResponse?.roomDetails
              const roomGroups = page?.data?.hotelDetailResponse?.items
              const hasMoreRoom =
                page?.data?.hotelDetailResponse?.isLoadProducts

              if (!roomDetails || !roomGroups?.length) {
                return null
              }

              return (
                <Fragment key={pageIndex}>
                  {roomGroups?.map((roomGroup) => {
                    return (
                      <div key={roomGroup.key}>
                        <HotelRoom
                          roomGroup={roomGroup}
                          roomDetails={roomDetails}
                          onSelect={(selectedRoomGroup) => {
                            console.log(selectedRoomGroup)
                          }}
                        />
                      </div>
                    )
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
                </Fragment>
              )
            })}
          </div>
          <div>
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
          </div>
        </div>
        <div className='@4xl:col-span-2'>Side section</div>
      </div>
    </div>
  )
}

export { HotelDetailSection }
