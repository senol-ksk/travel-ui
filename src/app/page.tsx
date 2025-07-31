import { Container, Title, Image, ScrollArea } from '@mantine/core'
import NextImage from 'next/image'
import { Link } from 'next-view-transitions'

import { SearchEngine } from '@/components/search-engine/'
import { StorySlider } from '@/components/home/story-slider'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Params, TourDealType, Widgets } from '@/types/cms-types'
import { UpComingHolidays } from '@/components/home/upcoming-holidays'
import { LastOpportunity } from '@/components/home/last-opportunity'
import { RecommendedProducts } from '@/components/home/recommended-products'

import { TrendRegions } from '@/components/home/trend-regions'
import { HolidayThemes } from '@/components/home/holiday-themes'

import { MainBannerCarousel } from '@/components/main-banner'
import { serviceRequest } from '@/network'
import { TourOpportunity } from '@/components/home/tour-opportunity'

export default async function Home() {
  const cmsData = (await getContent<CmsContent<Widgets, Params>>('ana-sayfa'))
    ?.data

  const dealsOfWeekData = cmsData?.widgets.filter(
    (x) => x.point === 'deals_of_week'
  )
  const opportunities = cmsData?.widgets?.filter(
    (x) => x.point == 'opportunity'
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

  const tourDeals = await serviceRequest<TourDealType[]>({
    axiosOptions: {
      url: 'api/cms/getDealList',
      params: {
        channel: 7,
        pageNumber: 1,
        placement: 'homepage',
        takeCount: 100,
        languageCode: 'tr_TR',
        // SessionToken: ViewBag.SessionToken,
        // SearchToken: ViewBag.TourSearchToken,
      },
    },
  })

  return (
    <div className='flex flex-col gap-4 md:gap-10'>
      <div className='relative'>
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

      {dealsOfWeekData && (
        <div className='py-3 md:py-8'>
          <StorySlider data={dealsOfWeekData} />
        </div>
      )}
      <div>
        <Container className='flex flex-col gap-3 md:gap-10'>
          {opportunities && (
            <div className='mx-auto'>
              <MainBannerCarousel
                slides={opportunities.map((slide) => ({
                  ...slide,
                  id: String(slide.id),
                  Title: slide.title,
                }))}
              />
            </div>
          )}

          {upcomingHolidaysData && upcomingHolidaysData.length > 0 && (
            <div>
              <UpComingHolidays data={upcomingHolidaysData} />
            </div>
          )}

          {lastOpportunityData && lastOpportunityData?.length > 0 && (
            <div>
              <LastOpportunity data={lastOpportunityData} />
            </div>
          )}

          {recommendedProductsData && recommendedProductsData.length > 0 && (
            <div>
              <h2 className='my-8 text-center text-2xl font-bold text-blue-900 md:mb-0 md:text-3xl'>
                Tavsiye Ettiğimiz Oteller
              </h2>
              {hotelDestinations && hotelDestinations?.length > 0 && (
                <div className='hidden gap-3 overflow-hidden py-8 whitespace-nowrap md:flex'>
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

              <div>
                <RecommendedProducts data={recommendedProductsData} />
              </div>
            </div>
          )}
          {tourDeals?.data && tourDeals.data?.length > 0 && (
            <>
              <h2 className='mt-8 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
                Tur Fırsatları
              </h2>
              <TourOpportunity data={tourDeals.data} />
            </>
          )}
          {trendRegionsData && trendRegionsData.length > 0 && (
            <div className='hidden sm:block'>
              <Title
                order={4}
                c={'blue.9'}
                className='my-8 text-center text-3xl'
              >
                Trend Tatil Bölgeleri
              </Title>
              {hotelPopularRegionsBtns?.map((hotelPopularRegionsBtn) => {
                return (
                  <div
                    className='hidden gap-3 overflow-hidden pb-8 md:block'
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
          <div>
            {holidayThemesData && <HolidayThemes data={holidayThemesData} />}
          </div>
        </Container>
      </div>
    </div>
  )
}

const CategoryLink = ({ link, title }: { link: string; title: string }) => (
  <Link
    href={link}
    className='block rounded-md border bg-white px-4 py-3 hover:bg-blue-100'
  >
    {title}
  </Link>
)
