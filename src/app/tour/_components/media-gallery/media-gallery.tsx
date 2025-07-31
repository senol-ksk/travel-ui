import { Modal, Image } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import { validateUrl } from '@/libs/util'
import { cdnSiteImageUrl } from '@/libs/cms-data'

type Props = {
  images: string[]
  title: string | undefined
  opened: boolean
  onClose: () => void
  onOpen?: () => void
}

const TourMediaGallery = ({ images, title, opened, onClose }: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!images.length) return <div>Resim yok</div>

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size={isMobile ? '100%' : '70%'}
        title={<div className='text-xs md:text-lg'>{title}</div>}
        radius='lg'
        styles={{
          body: {
            padding: 3,
          },
        }}
      >
        <Carousel
          slideSize={isMobile ? '100%' : '70%'}
          slideGap='md'
          controlsOffset='sm'
          controlSize={26}
          withControls
          withIndicators={false}
          emblaOptions={{
            loop: true,
            dragFree: false,
            align: 'center',
          }}
        >
          {images.map((img, idx) => (
            <Carousel.Slide key={idx}>
              <Image
                className='rounded-3xl'
                src={validateUrl(img) ? img : cdnSiteImageUrl(img)}
                alt={`${title} - ${idx + 1}`}
                style={{
                  height: 'auto',
                  width: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>
    </>
  )
}

export { TourMediaGallery }
