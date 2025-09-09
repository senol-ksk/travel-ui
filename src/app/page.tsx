import {
  Container,
  Title,
  Image,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  SimpleGrid,
  Anchor,
} from '@mantine/core'
import NextImage from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'

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
import { EbultenForm } from '@/components/home/ebulten-form'

import populerDestinationClasses from '@/styles/OutlineTabs.module.css'
import { HomeTourDom } from '@/components/home/home-tours'
export default async function Home() {
  const cmsData = (await getContent<CmsContent<Widgets, Params>>('ana-sayfa'))
    ?.data

  const landingMenus = cmsData?.params.landing_menu

  const dealsOfWeekData = cmsData?.widgets.filter(
    (x) => x.point === 'deals_of_week'
  )
  const opportunities = cmsData?.widgets?.filter(
    (x) => x.point == 'home_carousel_banner'
  )

  const recommendedProductsData = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_deals'
  )
  const hotelDestinationsBtns = cmsData?.widgets.filter(
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
  const homeTourDomData = cmsData?.widgets.filter(
    (x) => x.point === 'home_tour_dom'
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
          src='https://ykmturizm.mncdn.com/11/Files/638923998198240440.jpg'
          fill
          alt='ParaflyTravel'
          priority
          className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
          style={{
            clipPath: 'ellipse(90% 90% at 50% 00%)',
          }}
        />
        <div className='absolute top-0 right-0 m-1 hidden rounded bg-gray-200 p-1 text-center text-xs opacity-85 md:flex'>
          Yeni Karamürsel Turizm ve Seyahat Acentası Belge No: 3102
        </div>
        <div>
          <Container className='px-0 md:px-4 md:pt-[58px]'>
            <Title
              className='hidden text-center font-medium text-white md:mb-10 md:block'
              style={{ fontSize: '32px' }}
            >
              Parafly ile ParafPara&apos;ların keyfini çıkarın!
            </Title>
            <div className='mb-1 rounded bg-gray-200 p-1 py-2 text-center text-xs opacity-85 md:hidden'>
              Yeni Karamürsel Turizm ve Seyahat Acentası Belge No: 3102
            </div>
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
        <Container className='flex flex-col gap-7 md:gap-10'>
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
              {hotelDestinationsBtns && hotelDestinationsBtns?.length > 0 && (
                <div className='hidden gap-3 overflow-hidden py-8 whitespace-nowrap md:flex'>
                  <ScrollArea w={'100%'}>
                    <div className='flex gap-3 pb-5'>
                      {hotelDestinationsBtns
                        ?.sort((a, b) => a.ordering - b.ordering)
                        ?.map((hotelDestination) => (
                          <CategoryLink
                            key={hotelDestination.id}
                            link={hotelDestination.params.link.value as Route}
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
          {homeTourDomData && homeTourDomData.length > 0 && (
            <div>
              <h2 className='my-8 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
                Yurtiçi Kültür Turları
              </h2>
              <div>
                <HomeTourDom data={homeTourDomData} />
              </div>
              <div>* Çift kişilik odada kişi fiyatıdır.</div>
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
                      <div className='flex gap-3 pb-5'>
                        {hotelPopularRegionsBtn.params.destinations?.destinations.map(
                          (destination) => (
                            <CategoryLink
                              key={destination.id}
                              link={
                                `/otel-listesi/${destination.slug}` as Route
                              }
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
          <EbultenForm />
          {landingMenus && landingMenus.menus.length > 0 && (
            <div>
              <Tabs
                defaultValue={'' + landingMenus?.menus[0].id}
                variant='unstyle'
                classNames={populerDestinationClasses}
                // visibleFrom='sm'
              >
                <ScrollArea
                  type='auto'
                  scrollbars='x'
                  scrollbarSize={0}
                  className='whitespace-nowrap'
                >
                  <TabsList className='flex-nowrap gap-2'>
                    {landingMenus?.menus
                      .sort((a, b) => a.ordering - b.ordering)
                      .map((menu) => {
                        return (
                          <TabsTab key={menu.id} value={'' + menu.id}>
                            {menu.title}
                          </TabsTab>
                        )
                      })}
                  </TabsList>
                </ScrollArea>

                <div className='pt-3 md:pt-8'>
                  {landingMenus?.menus.map((menu) => (
                    <TabsPanel value={'' + menu.id} key={menu.id}>
                      <SimpleGrid cols={{ base: 2, md: 4 }} spacing={'xs'}>
                        {menu.items.map((item) => (
                          <div key={item.id}>
                            <Anchor
                              href={item.url as Route}
                              className='text-dark-700'
                              component={Link}
                            >
                              {item.title}
                            </Anchor>
                          </div>
                        ))}
                      </SimpleGrid>
                    </TabsPanel>
                  ))}
                </div>
              </Tabs>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

const CategoryLink = ({ link, title }: { link: Route; title: string }) => (
  <Link
    href={link}
    className='block rounded-md border bg-white px-4 py-3 hover:bg-blue-100'
  >
    {title}
  </Link>
)
