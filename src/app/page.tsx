import { Suspense } from 'react'
import {
  Skeleton,
  Container,
  Title,
  Image,
  Button,
  ScrollArea,
} from '@mantine/core'
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
import { MainBannerCarousel } from '@/components/main-banner'
import { Link } from 'next-view-transitions'
import { _size } from 'zod/v4/core'

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
  const hotelDestinations = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_deals_btns'
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
  const hotelPopularRegionsBtns = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_popular_regions_btns'
  )
  const upcomingHolidaysData = cmsData?.widgets.filter(
    (x) => x.point === 'upcoming_holidays'
  )
  const lastOpportunityData = cmsData?.widgets.filter(
    (x) => x.point === 'last_opportunity'
  )

  return (
    <div>
      <Suspense fallback={<Skeleton h={20} />}>
        <div className='relative'>
          <Title className='text-dark hidden pt-5 text-center text-lg text-shadow-md md:pt-13 md:text-4xl md:text-white'>
            FullTrip ile seyahat planlamak çok kolay
          </Title>
          <Image
            component={NextImage}
            src='https://ykmturizm.mncdn.com/11/Files/638737370698225204.jpg'
            fill
            alt='Fulltrip'
            priority
            className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
            style={{
              clipPath: 'ellipse(90% 90% at 50% 00%)',
            }}
          />
          <div>
            <Container className='px-0 md:px-4 md:pt-[58px]'>
              <Title
                className='hidden text-center font-medium text-white md:mb-10 md:block'
                style={{ fontSize: '32px' }}
              >
                Parafly ile ParafPara&apos;ların keyfini çıkarın!
              </Title>

              <div className='z-50 bg-white shadow-lg md:rounded-lg md:border'>
                <SearchEngine />
              </div>
            </Container>
          </div>
        </div>
      </Suspense>

      {dealsOfWeekData && (
        <div className='mt-3 py-3 md:py-8'>
          <StorySlider data={dealsOfWeekData} />
        </div>
      )}

      <Container
        display={'flex'}
        className='flex-col gap-3 py-3 md:gap-10 md:py-10'
      >
        {emblaCarouselData && (
          <MainBannerCarousel
            slides={emblaCarouselData.map((slide) => ({
              ...slide,
              id: String(slide.id),
              Title: slide.title,
            }))}
          />
        )}
      </Container>
      <Container
        display={'flex'}
        className='flex-col gap-3 py-3 md:gap-10 md:py-10'
      >
        {upcomingHolidaysData && upcomingHolidaysData.length > 0 && (
          <div>
            <UpComingHolidays data={upcomingHolidaysData} />
          </div>
        )}
      </Container>
      {lastOpportunityData && lastOpportunityData?.length > 0 && (
        <div>
          <LastOpportunity data={lastOpportunityData} />
        </div>
      )}
      <Container
        display={'flex'}
        className='flex-col gap-3 py-3 md:gap-10 md:py-10'
      >
        {recommendedProductsData && recommendedProductsData.length > 0 && (
          <div>
            <h2 className='mb-6 text-center text-2xl font-bold text-blue-900 md:mb-10 md:text-3xl'>
              Tavsiye Ettiğimiz Oteller
            </h2>
            {hotelDestinations && hotelDestinations?.length > 0 && (
              <div className='hidden gap-3 overflow-hidden pb-8 whitespace-nowrap md:flex'>
                <ScrollArea w={'100%'}>
                  <div className='flex gap-3'>
                    {hotelDestinations
                      ?.sort((a, b) => a.ordering - b.ordering)
                      ?.map((hotelDestination) => (
                        <CategoryLink
                          key={hotelDestination.id}
                          link={hotelDestination.params.link.value}
                          title={hotelDestination.title}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <RecommendedProducts data={recommendedProductsData} />
          </div>
        )}
      </Container>
      <div className='hidden'>
        <TourOpportunity />
      </div>
      <Container display={'flex'} className='flex-col gap-3 py-3'>
        {trendRegionsData && trendRegionsData.length > 0 && (
          <div className='hidden sm:block'>
            <Title order={4} c={'blue.9'} fz={'h2'} className='text-center'>
              Trend Tatil Bölgeleri
            </Title>
            {hotelPopularRegionsBtns?.map((hotelPopularRegionsBtn) => {
              return (
                <div
                  className='hidden gap-3 overflow-hidden py-8 md:block'
                  key={hotelPopularRegionsBtn.id}
                >
                  <ScrollArea w={'100%'}>
                    <div className='flex gap-3'>
                      {hotelPopularRegionsBtn.params.destinations?.destinations.map(
                        (destination) => (
                          <CategoryLink
                            key={destination.id}
                            link={`/otel-listesi/${destination.slug}`}
                            title={destination.name}
                          />
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )
            })}
            <TrendRegions data={trendRegionsData} />
          </div>
        )}
      </Container>
      <div>
        {holidayThemesData && <HolidayThemes data={holidayThemesData} />}
      </div>
      <Container display={'flex'} className='flex-col gap-3 py-3 md:gap-10'>
        {footerMenuData && footerMenuData.length > 0 && (
          <div>
            <PopularDestinations data={footerMenuData} />
          </div>
        )}
      </Container>
      <Container display={'flex'} className='mb-10 flex-col gap-3 py-3'>
        <EbultenForm />
      </Container>
    </div>
  )
}

const CategoryLink = ({ link, title }: { link: string; title: string }) => (
  <Link href={link} className='block rounded-md border bg-white px-4 py-3'>
    {title}
  </Link>
)
