'use client'

import { Button, LoadingOverlay, Skeleton } from '@mantine/core'
import { useState } from 'react'

import { useTourDetailQuery } from './useTourDetailQuery'
import { TourDetail } from './detail-view'
import { TourDetailPriceSection } from './price-section'
import { dummyTourDetailData } from './dummyData'
import { TourSearchEngine } from '@/modules/tour'
import { useMutation, useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { PassengerFormTypes } from '@/modules/tour/type'

const TourDetailClient = () => {
  const detailQuery = useTourDetailQuery()
  // const detailQuery = {
  //   data: dummyTourDetailData,
  //   isLoading: false,
  // }

  const [passengers, setPassengers] = useState<{
    adultCount: string
    childAge?: (string | undefined)[] | undefined
  }>({
    adultCount: '2:0',
  })

  const calculateTotalPriceQuery = useQuery({
    enabled: !!detailQuery.data && detailQuery.isSuccess,
    queryKey: [
      'tour-detail-totalPrice',
      detailQuery.data,
      passengers,
      detailQuery.data?.searchToken,
      detailQuery.data?.sessionToken,
      detailQuery.data?.package?.key,
    ],
    queryFn: async () => {
      const response = await serviceRequest<{
        value: ServicePriceType
        packageKey: string
      }>({
        axiosOptions: {
          url: `api/tour/passengerUpdate`,
          method: 'post',
          data: {
            SearchToken: detailQuery.data?.searchToken,
            SessionToken: detailQuery.data?.sessionToken,
            Package: detailQuery.data?.package?.key,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            CampaignCode: null,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      })

      return response
    },
  })

  return (
    <>
      <div className='border-b p-4'>
        <div className='lg:container'>
          <TourSearchEngine />
        </div>
      </div>
      <div className='grid gap-4 p-4 lg:container lg:p-7'>
        {!detailQuery.isLoading && !detailQuery.data ? (
          <div>no data</div>
        ) : detailQuery.isLoading || !detailQuery.data ? (
          <div className='grid gap-4'>
            <Skeleton h={70} radius={'md'} />
            <Skeleton h={20} radius={'xl'} />
            <Skeleton h={20} radius={'xl'} className='max-w-6xl' />
          </div>
        ) : (
          <div className='@container'>
            {detailQuery.data ? (
              <div className='grid gap-4 md:grid-cols-12'>
                <div className='col-span-12 md:col-span-8 lg:col-span-9'>
                  <div className='rounded border p-3 @lg:p-5'>
                    <TourDetail data={detailQuery.data} />
                  </div>
                </div>
                <div className='col-span-12 md:col-span-4 lg:col-span-3'>
                  <div className='relative'>
                    <LoadingOverlay
                      visible={calculateTotalPriceQuery.isPending}
                      zIndex={1000}
                      overlayProps={{ radius: 'sm', blur: 2 }}
                      loaderProps={{ color: 'indigo', type: 'bars' }}
                    />
                    <div className='rounded border p-3 @lg:p-5'>
                      <TourDetailPriceSection
                        calculatedTotalPrice={
                          calculateTotalPriceQuery.data?.success &&
                          typeof calculateTotalPriceQuery.data?.data?.value
                            .value === 'number'
                            ? calculateTotalPriceQuery.data?.data?.value.value
                            : 0
                        }
                        data={detailQuery.data}
                        onPassengerChange={setPassengers}
                      />
                      <div className='py-4'>
                        <Button
                          type='button'
                          fullWidth
                          size='lg'
                          disabled={!calculateTotalPriceQuery.data?.success}
                        >
                          Rezervasyon Yap
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>no data</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export { TourDetailClient }
