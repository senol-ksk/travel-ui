'use client'

import { Image, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MdOutlineCameraAlt } from 'react-icons/md'
import { HotelMediaGallery } from '@/app/hotel/(detail)/[slug]/_components/media-gallery/media-gallery'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'

interface CyprusMediaGalleryProps {
  images?: string[]
  hotelName?: string
  onOpenGallery?: () => void
  hotel: HotelDetailResponseHotelInfo
}

export const CyprusMediaGallery: React.FC<CyprusMediaGalleryProps> = ({
  images = [],
  hotel,
  hotelName,
}) => {
  const [
    isMediaGalleryOpened,
    { open: openMediaGallery, close: closeMediaGallery },
  ] = useDisclosure(false)

  if (images.length === 0) {
    return (
      <div className='relative flex h-64 w-full items-center justify-center rounded-lg bg-gray-200'>
        <div className='text-gray-500'>Fotoğraf bulunamadı</div>
      </div>
    )
  }

  return (
    <>
      {hotel?.hotel.documents && hotel?.hotel.documents?.length > 0 && (
        <div className='pb-3 text-end text-xs'>
          <span>
            Kültür ve Turizm Bakanlığı - Kısmı Turizm İşletme Belgesi:{' '}
          </span>
          <strong>{hotel.hotel.documents.at(0)?.no}</strong>
        </div>
      )}
      <div className='relative'>
        <div className='absolute end-2 bottom-2 z-10 mx-2'>
          <Button
            color={'black'}
            opacity={'.75'}
            leftSection={<MdOutlineCameraAlt size={18} />}
            onClick={openMediaGallery}
          >
            Galeri ({images.length})
          </Button>
        </div>
        <div onClick={openMediaGallery} className='cursor-pointer px-2 sm:px-0'>
          <div className='grid auto-cols-fr gap-4 sm:grid-cols-4 md:grid-rows-2'>
            <figure
              style={{ contentVisibility: 'auto' }}
              className='relative place-self-stretch sm:col-start-[span_2] sm:row-start-[span_2]'
            >
              <Image
                className='aspect-16/9 h-full w-full rounded-md object-cover'
                src={images[0]}
                alt={hotelName}
              />
            </figure>

            {images.slice(1, 5).map((image, imageIndex) => (
              <figure
                key={imageIndex}
                className='relative hidden gap-3 place-self-stretch rounded-md sm:col-start-[span_1] sm:sm:row-start-[span_1] sm:grid'
                style={{ contentVisibility: 'auto' }}
              >
                <Image
                  src={image}
                  alt={hotelName}
                  className='absolute aspect-16/9 h-full w-full object-cover'
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
      <HotelMediaGallery
        data={hotel}
        isMediaGalleryOpened={isMediaGalleryOpened}
        closeMediaGallery={closeMediaGallery}
      />
    </>
  )
}
