import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import { Carousel, CarouselSlide } from '@mantine/carousel'

import {
  AspectRatio,
  Button,
  Image,
  Modal,
  Progress,
  SimpleGrid,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { useDisclosure } from '@mantine/hooks'
import { IoClose } from 'react-icons/io5'

import categoryCarouselClasses from './CategoryButtonEmbla.module.css'
import categoryDetailEmbla from './CategoruDetailEmbla.module.css'

type IProps = {
  data: HotelDetailResponseHotelInfo
  isMediaGalleryOpened: boolean
  closeMediaGallery: () => void
}

export const HotelMediaGallery: React.FC<IProps> = ({
  data,
  isMediaGalleryOpened,
  closeMediaGallery,
}) => {
  const [
    isCategoryCarouselOpened,
    { open: openCategoryCarouselOpened, close: closeCategoryCarouselOpened },
  ] = useDisclosure(false)
  const hotel = data.hotel
  const { images } = hotel
  const imageCategories = data.imageCategories.sort((a, b) => +a.id - +b.id)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null)
  const [emblaCaterogy, setEmblaCategory] = useState<
    EmblaCarouselType | null | undefined
  >(null)

  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaCaterogy)

  const groupedImages = Object.groupBy(images, ({ category }) => category ?? -1)
  const [selectedCategoryImages, setSelectedCategoryImages] = useState(
    hotel.images
  )
  const categoryCarouselSliderPosition = useRef(0)

  const handleScroll = useCallback(() => {
    if (!embla) {
      return
    }
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [embla, setScrollProgress])

  useEffect(() => {
    if (embla) {
      embla.on('scroll', handleScroll)
      handleScroll()
    }
  }, [embla, handleScroll])

  return (
    <>
      <Modal
        size='100%'
        radius={'md'}
        opened={isMediaGalleryOpened}
        onClose={closeMediaGallery}
        title={
          <div className='py-0 text-lg font-bold md:text-2xl'>{hotel.name}</div>
        }
        classNames={{
          body: 'px-0 md:px-2 py-0',
        }}
        withinPortal
        closeOnEscape={!isCategoryCarouselOpened}
      >
        {/* Category section */}
        <Carousel
          getEmblaApi={setEmbla}
          withControls={false}
          slideSize={'auto'}
          slideGap={'sm'}
          emblaOptions={{ dragFree: true }}
          classNames={categoryCarouselClasses}
          className='sticky top-10 z-20 flex justify-start bg-white py-7 md:justify-center'
        >
          {imageCategories.map((category) => (
            <Carousel.Slide key={category.id}>
              <Button
                fullWidth
                size='xs'
                onClick={() => {
                  const target = document.getElementById(
                    `category-wrapper-${category.id}`
                  )
                  target?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                {category.name}
              </Button>
            </Carousel.Slide>
          ))}
        </Carousel>
        <Progress maw={600} mx='auto' value={scrollProgress} size='sm' />
        {/* Categories section ends /> */}

        <div className='mx-auto h-full' style={{ contentVisibility: 'auto' }}>
          {Object.entries(groupedImages).map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className='relative justify-center px-2 py-7 md:flex md:flex-row md:flex-wrap'
              id={`category-wrapper-${category[0]}`}
            >
              <div className='px-4 pb-3 text-center'>
                <Title order={6} fz={'h2'}>
                  {
                    imageCategories.find(
                      (imageCategory) => imageCategory.id === +category[0]
                    )?.name
                  }
                </Title>
              </div>
              <div className='grid'>
                <div>
                  <SimpleGrid
                    cols={{ base: 2, md: 3 }}
                    spacing={'md'}
                    verticalSpacing={'md'}
                  >
                    {category[1]?.map((image, imageIndex) => (
                      <div key={imageIndex}>
                        <UnstyledButton
                          type='button'
                          onClick={() => {
                            openCategoryCarouselOpened()
                            categoryCarouselSliderPosition.current = imageIndex
                            setSelectedCategoryImages(
                              images.filter(
                                (hotelImage) =>
                                  hotelImage.category === image.category
                              )
                            )
                          }}
                        >
                          <AspectRatio>
                            <Image
                              src={image.original}
                              alt={
                                imageCategories.find(
                                  (category) => category.id == image.category
                                )?.name
                              }
                            />
                          </AspectRatio>
                        </UnstyledButton>
                      </div>
                    ))}
                  </SimpleGrid>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <Transition
        mounted={isCategoryCarouselOpened}
        transition='fade-up'
        timingFunction='ease'
        onEntered={() => {
          emblaCaterogy?.scrollTo(categoryCarouselSliderPosition.current)
        }}
      >
        {(styles) => {
          return (
            <div
              style={styles}
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 bg-black text-white'
            >
              <div className='p-0 text-end'>
                <div>
                  <Button
                    c={'white'}
                    variant='light'
                    leftSection={<IoClose size={22} />}
                    size='xl'
                    onClick={closeCategoryCarouselOpened}
                  >
                    Kapat
                  </Button>
                </div>
              </div>
              <div className='flex justify-center p-5'>
                <Title order={6} fz={'h3'}>
                  {
                    imageCategories.find(
                      (cat) =>
                        cat.id === selectedCategoryImages?.at(0)?.category
                    )?.name
                  }{' '}
                </Title>
              </div>
              <div>
                <Carousel
                  getEmblaApi={setEmblaCategory}
                  slideGap={'lg'}
                  slideSize={{ base: '100%', sm: '75%' }}
                  controlSize={36}
                  withIndicators={false}
                  emblaOptions={{
                    align: 'center',
                    startIndex: categoryCarouselSliderPosition.current,
                  }}
                  height={'75vh'}
                  classNames={categoryDetailEmbla}
                >
                  {selectedCategoryImages.map((image, imageIndex) => {
                    return (
                      <CarouselSlide key={imageIndex} h={'100%'}>
                        <AspectRatio ratio={1 / 1} h={'100%'}>
                          <Image
                            src={image.original}
                            h={'100%'}
                            alt={
                              imageCategories.find(
                                (cat) => cat.id === image.category
                              )?.name
                            }
                          />
                        </AspectRatio>
                      </CarouselSlide>
                    )
                  })}
                </Carousel>
                <div className='flex justify-center p-5'>
                  <small>
                    {selectedSnap + 1} / {snapCount}
                  </small>
                </div>
              </div>
            </div>
          )
        }}
      </Transition>
    </>
  )
}

type UseSelectedSnapDisplayType = {
  selectedSnap: number
  snapCount: number
}

export const useSelectedSnapDisplay = (
  emblaApi: EmblaCarouselType | undefined | null
): UseSelectedSnapDisplayType => {
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
    setSnapCount(emblaApi.scrollSnapList().length)
    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    updateScrollSnapState(emblaApi)
    emblaApi.on('select', updateScrollSnapState)
    emblaApi.on('reInit', updateScrollSnapState)
  }, [emblaApi, updateScrollSnapState])

  return {
    selectedSnap,
    snapCount,
  }
}
