import { Suspense } from 'react'
import { Skeleton, Container, Title, Image } from '@mantine/core'
import NextImage from 'next/image'

import { SearchEngine } from '@/components/search-engine/'
import { StorySlider } from '@/components/home/story-slider'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Params, Widgets } from '@/types/cms-types'
import { UpComingHolidays } from '@/components/home/upcoming-holidays'
import { LastOpportunity } from '@/components/home/last-opportunity'
import { RecommendedProducts } from '@/components/home/recommended-products'
import { TourOpportunity } from '@/components/home/tour-opportunity'
import { TrendRegions } from '@/components/home/trend-regions'
import { HolidayThemes } from '@/components/home/holiday-themes'
import { PopularDestinations } from '@/components/home/popular-destinations'
import { EbultenForm } from '@/components/home/ebulten-form'
import { EmblaCarousel } from '@/components/main-banner/embla-carousel'

export default async function Home() {
  const cmsData = (await getContent<CmsContent<Widgets, Params>>('ana-sayfa'))
    ?.data

  const dealsOfWeekData = cmsData?.widgets.filter(
    (x) => x.point === 'deals_of_week'
  )
  const emblaCarouselData = cmsData?.widgets?.filter(
    (x) => x.point == 'opportunity'
  )
  const earlyList = cmsData?.widgets?.filter(
    (x) => x.point == 'early_rezervation'
  )
  const recommendedProductsData = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_deals'
  )
  const holidayThemesData = cmsData?.widgets.filter(
    (x) => x.point === 'holiday_themes'
  )
  const footerMenuData = cmsData?.widgets.filter(
    (x) => x.point === 'landing_menu'
  )
  const trendRegionsData = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_popular_regions'
  )
  const upcomingHolidaysData = cmsData?.widgets.filter(
    (x) => x.point === 'upcoming_holidays'
  )
  const lastOpportunityData = cmsData?.widgets.filter(
    (x) => x.point === 'last_opportunity'
  )
  const lastOpportunityContainerData = cmsData?.widgets.filter(
    (x) => x.point === 'last_opportunity_container'
  )

  return (
    <>
      <div className='flex flex-col gap-6 md:gap-20'>
        <Suspense fallback={<Skeleton h={20} />}>
          <div className='relative'>
            <Title className='text-dark hidden pt-5 text-center text-lg text-shadow-md md:pt-13 md:text-4xl md:text-white'>
              FullTrip ile seyahat planlamak çok kolay
            </Title>
            <Image
              component={NextImage}
              src='https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg'
              fill
              alt='Fulltrip'
              priority
              className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
            />
            <div className='md:min-h-[280px] md:pt-10'>
              <Container className='px-0 md:px-4'>
                <div className='bg-white md:rounded-lg md:border'>
                  <SearchEngine />
                </div>
              </Container>
            </div>
          </div>
        </Suspense>

        {dealsOfWeekData && (
          <div>
            <StorySlider data={dealsOfWeekData} />
          </div>
        )}

        <Container>
          {emblaCarouselData && (
            <EmblaCarousel
              slides={emblaCarouselData.map((slide) => ({
                ...slide,
                id: String(slide.id),
                Title: slide.title,
              }))}
            />
          )}
        </Container>
        <div>
          {upcomingHolidaysData && (
            <UpComingHolidays data={upcomingHolidaysData} />
          )}
        </div>
        <div>
          {lastOpportunityData && (
            <LastOpportunity data={lastOpportunityData} />
          )}
        </div>
        <div>
          {recommendedProductsData && (
            <RecommendedProducts data={recommendedProductsData} />
          )}
        </div>
        <div className='hidden'>
          <TourOpportunity />
        </div>
        <div className='hidden sm:block'>
          {trendRegionsData && <TrendRegions data={trendRegionsData} />}
        </div>
        <div>
          {holidayThemesData && <HolidayThemes data={holidayThemesData} />}
        </div>
        <div>
          {footerMenuData && <PopularDestinations data={footerMenuData} />}
        </div>
        <div>
          <EbultenForm />
        </div>
      </div>
    </>
  )
}
