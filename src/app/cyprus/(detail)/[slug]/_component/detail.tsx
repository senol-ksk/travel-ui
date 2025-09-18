'use client'

import { Container, Alert, Title, Button, Collapse } from '@mantine/core'
import { LuShieldCheck } from 'react-icons/lu'
import { RiMapPin2Line } from 'react-icons/ri'
import { MdOutlineRoomService } from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { notFound } from 'next/navigation'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { CyprusHotelDetailSearchParamTypes } from '@/app/cyprus/searchParams'
import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { OLResponse } from '@/network'
import { HotelRoom } from '@/components/hotel-room'
import { CyprusMediaGallery } from './cyprus-media-gallery'
import { CyprusHotelInfo } from './cyprus-hotel-info'
import { CyprusDetailClient } from './cyprus-detail-client'
import { CyprusDetailClientWrapper } from './cyprus-detail-client-wrapper'
import { olRequest } from '@/network'
import { CyprusSearchEngine } from '@/modules/cyprus'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import { HotelTableOfContents } from '@/app/hotel/(detail)/[slug]/_components/table-of-contents'
import { HotelFeatures } from './hotel-features'

type IProps = {
  slug: string
  searchParams: CyprusHotelDetailSearchParamTypes
  detailData: OLResponse<CyprusHotelDetailApiResponse>
}

export const CyprusHotelDetail: React.FC<IProps> = ({
  slug,
  searchParams,
  detailData,
}) => {
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [isSearchEngineOpened, { toggle: toggleSearchEngineVisibility }] =
    useDisclosure(false)

  if (
    !detailData ||
    !detailData.data ||
    !detailData?.data.hotelDetailResponse
  ) {
    return notFound()
  }
  const { hotelDetailResponse } = detailData.data
  const roomGroups = hotelDetailResponse.items
  const roomDetails = hotelDetailResponse.roomDetails
  const hotelInfo = hotelDetailResponse.hotelInfo
  const images = hotelInfo?.hotel.images.map((img) => img.original)
  const hotelName = hotelInfo?.hotel.name
  const destination = hotelInfo?.hotel.destination
  const mealType = hotelInfo?.hotel.meal_type
  const hotelInformation = hotelInfo?.hotel.descriptions.hotelInformation
  const facilityTypes = hotelInfo?.facilityTypes

  return (
    <>
      <div className='border-b shadow md:py-3'>
        <Container>
          <div className='relative py-1 text-xs font-semibold text-blue-800 md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />

            <div className='flex items-center gap-2'>
              <div>Kıbrıs</div>
              <div>|</div>
              <div>
                {dayjs().add(1, 'months').format('DD MMMM')} -{' '}
                {dayjs().add(1, 'months').add(5, 'days').format('DD MMMM')}
              </div>
              <div>|</div>
              <div>2 Yolcu</div>
              <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
                <IoSearchSharp size={24} className='text-blue-800' />
              </div>
            </div>
          </div>
          <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
            <div className='pb-3 md:pb-0'>
              <CyprusSearchEngine />
            </div>
          </Collapse>
        </Container>
      </div>
      <Container
        className='flex flex-col gap-3 px-0 py-5 sm:px-4 md:gap-5 md:py-3'
        id='mdx'
      >
        <div>
          <div className='relative'>
            <CyprusMediaGallery
              hotel={
                detailData.data.hotelDetailResponse
                  .hotelInfo as HotelDetailResponseHotelInfo
              }
              images={images}
              hotelName={hotelName}
            />
          </div>
        </div>

        <HotelTableOfContents
          hotelInfo={hotelInfo as HotelDetailResponseHotelInfo}
        />
        <div className='grid grid-cols-2 gap-2 rounded bg-gray-50 md:grid-cols-12 md:gap-5 md:p-3'>
          <div className='col-span-12 flex flex-col gap-7 rounded bg-white p-3 md:col-span-8'>
            <div className='grid'>
              <div className='text-xl font-semibold md:text-3xl'>
                {hotelName?.trim()}
              </div>
              <div className='gap-md flex items-center py-2 text-sm text-blue-800'>
                <div className='flex gap-1'>
                  <span>
                    <RiMapPin2Line size={20} className='text-blue-800' />
                  </span>
                  <span>{destination}</span>
                </div>

                {mealType && (
                  <div className='flex gap-1'>
                    <span>
                      <MdOutlineRoomService
                        size={22}
                        className='text-blue-800'
                      />
                    </span>
                    <span> {mealType}</span>
                  </div>
                )}
              </div>
            </div>

            {hotelInformation && (
              <div>
                <Title order={3} className='mb-4 text-sm font-medium'>
                  Genel Bilgiler
                </Title>
                <CyprusDetailClient hotelInformation={hotelInformation} />
              </div>
            )}
            {facilityTypes && facilityTypes.length > 0 && (
              <div className='mt-5 mb-3'>
                <Title
                  order={3}
                  className='mb-4 hidden text-sm font-medium md:block'
                >
                  Otel Özellikleri
                </Title>
                <HotelFeatures
                  facilityTypes={facilityTypes}
                  hotelInfo={hotelInfo}
                />
              </div>
            )}
          </div>

          <div className='col-span-12 md:col-span-4'>
            <CyprusHotelInfo
              displayData={detailData.data}
              hotelInfo={hotelInfo as HotelDetailResponseHotelInfo}
            />
          </div>
        </div>

        <Title id='rooms' className='md:text-xxl p-2 text-xl md:p-0'>
          Odalar
        </Title>

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
          {roomGroups?.map((roomGroup) => (
            <HotelRoom
              key={roomGroup.key}
              hotelInfo={hotelInfo as HotelDetailResponseHotelInfo}
              roomGroup={roomGroup}
              roomDetails={roomDetails || {}}
              onSelect={(selectedRoomGroup) => {
                // Kıbrıs için rezervasyon logic'i buraya eklenebilir
                console.log('Room selected:', selectedRoomGroup)
              }}
              onInstallmentClick={(selectedRoomGroup) => {
                // Taksit seçenekleri logic'i buraya eklenebilir
                console.log('Installment clicked:', selectedRoomGroup)
              }}
            />
          ))}
        </div>

        <Title
          order={2}
          id='facility-infos'
          className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
        >
          Tesis Bilgileri
        </Title>

        <CyprusDetailClientWrapper
          hotelInfo={
            detailData.data.hotelDetailResponse
              .hotelInfo as unknown as HotelDetailResponseHotelInfo
          }
        />
      </Container>
    </>
  )
}
