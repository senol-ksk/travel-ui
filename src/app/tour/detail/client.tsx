'use client'

import { Button, LoadingOverlay, Skeleton, Modal, Group } from '@mantine/core'
import { upperFirst, useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

import { useTourDetailQuery } from './useTourDetailQuery'
import { TourDetail } from './detail-view'
import { TourDetailPriceSection } from './price-section'
import { dummyTourDetailData } from './dummyData'
import { TourSearchEngine } from '@/modules/tour'
import { useMutation, useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import {
  PassengerFormTypes,
  TourExtraServicesApiResponse,
} from '@/modules/tour/type'
import { ExtraServicePanel } from './extra-services'
import { formatCurrency } from '@/libs/util'

const TourDetailClient = () => {
  const [
    isOpenExtraServicesModal,
    { open: openExtraSercivesModal, close: closeExtraServicesModal },
  ] = useDisclosure(false)

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

  const extraServicesMutation = useMutation({
    mutationKey: ['tour-extra-services'],
    mutationFn: async () => {
      const response = await serviceRequest<TourExtraServicesApiResponse>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/extraServices',
          method: 'post',
          data: {
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SearchToken: detailQuery.data?.searchToken,
            SessionToken: detailQuery.data?.sessionToken,
            Package: detailQuery.data?.package?.key,
          },
        },
      })

      return response
    },
    onSuccess() {
      openExtraSercivesModal()
    },
  })

  const extraServiceadultCount = Number(
    extraServicesMutation.data?.data?.adultCount.split(':').at(0)
  )
  const extraServiceChildCount =
    extraServicesMutation.data?.data?.childAges?.filter((num) => num >= 0)
      ?.length ?? 0
  const extraMaxCount = extraServiceadultCount + extraServiceChildCount

  console.log(extraMaxCount)

  const addOrRemoveExtraServicesMutation = useMutation({
    mutationKey: [
      'tour-extra-service-update',
      extraServicesMutation.data?.data,
    ],
    mutationFn: async () => {
      const response = await serviceRequest<{ tlPrice: ServicePriceType }>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/addRemoveExtraServices',
          method: 'post',
          data: {
            CalculateId: extraServicesMutation.data?.data?.calculatedId,
            SearchToken: detailQuery.data?.searchToken,
            Package: detailQuery.data?.package?.key,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SessionToken: detailQuery.data?.sessionToken,
            ExtraServicesAndAmounts: extraServicesAndAmounts,
          },
        },
      })

      return response
    },
  })

  const extraServicKeys = extraServicesMutation.data?.data?.extraServices
    .filter((extra) => !extra.isPackage && !extra.isMandatory)
    .map((ext) => {
      return {
        key: ext.key,
        count: 0,
      }
    })

  let extraServicesAndAmounts: string[]

  const handleExtraServiceActions = (actions: {
    key: string
    count: number
  }) => {
    if (extraServicKeys) {
      extraServicesAndAmounts = extraServicKeys?.map((item) => {
        if (item.key === actions.key) {
          item.count = actions.count
        }

        return `${item.key}:${item.count}`
      })
    }

    // if (
    //   extraServicesAndAmounts?.length &&
    //   !addOrRemoveExtraServicesMutation.isPending
    // ) {
    //   addOrRemoveExtraServicesMutation.mutate(extraServicesAndAmounts)
    // }

    console.log(extraServicesAndAmounts)
  }

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
                          disabled={
                            !calculateTotalPriceQuery.data?.success ||
                            extraServicesMutation.isPending
                          }
                          loading={extraServicesMutation.isPending}
                          onClick={() => {
                            extraServicesMutation.mutate()
                          }}
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
      <Modal
        opened={isOpenExtraServicesModal}
        // opened
        onClose={closeExtraServicesModal}
        title='Ekstra Servisler'
      >
        <div className='grid gap-5'>
          {extraServicesMutation.data?.data?.extraServices
            .filter((extra) => !extra.isPackage && !extra.isMandatory)
            .map((extra) => {
              return (
                <ExtraServicePanel
                  data={extra}
                  key={extra.key}
                  maxCount={extraMaxCount}
                  onChange={handleExtraServiceActions}
                />
              )
            })}
          <div className='flex items-center justify-between'>
            <div>Toplam:</div>
            <div className='text-lg font-semibold'>
              {addOrRemoveExtraServicesMutation.data?.data
                ? formatCurrency(
                    addOrRemoveExtraServicesMutation.data?.data.tlPrice.value
                  )
                : formatCurrency(
                    calculateTotalPriceQuery.data?.data?.value.value ?? 0
                  )}
            </div>
          </div>
          <Button
            type='button'
            disabled={addOrRemoveExtraServicesMutation.isPending}
            onClick={() => {
              addOrRemoveExtraServicesMutation.mutateAsync()
            }}
          >
            Güncelle
          </Button>
        </div>
        <div>
          <Group className='justify-between border-t' pt='md' mt={'md'}>
            <Button color='red'>İptal</Button>
            <Button color='green'>Rezervasyon Yap</Button>
          </Group>
        </div>
      </Modal>
    </>
  )
}

export { TourDetailClient }
