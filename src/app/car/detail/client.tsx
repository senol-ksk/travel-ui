'use client'

import { useMemo } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Image, Skeleton, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

import { carDetailParams } from '@/app/car/searchParams'
import { serviceRequest } from '@/network'
import { DetailResponseData } from '@/app/car/detail/type'
import { formatCurrency } from '@/libs/util'

import dummyData from './dummy.json'
import { reservationParsers } from '@/app/reservation/searchParams'

export const DetailClient = () => {
  const [params] = useQueryStates(carDetailParams)
  const { searchToken, sessionToken } = params
  const router = useRouter()

  const carDetailQuery = useQuery({
    queryKey: ['car-detail', params],
    queryFn: async () => {
      const response = await serviceRequest<DetailResponseData>({
        axiosOptions: {
          url: 'api/car/detail',
          params,
        },
      })

      return response?.data
      // return dummyData.data
    },
  })

  const mutateReservation = useMutation({
    mutationFn: async () => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/car/reservation',
          method: 'post',

          params: {
            ExtraOptions: [],
            InsuranceOptions: [],
            SelectedProductKey: detailItem?.key,
            searchToken: params.searchToken,
            sessionToken: params.sessionToken,
          },
        },
      })

      return response
    },
    onSuccess(data) {
      const resParams = createSerializer(reservationParsers)

      const url = resParams('/reservation', {
        productKey: detailItem?.key,
        searchToken,
        sessionToken,
      })
      router.push(url)
    },
  })

  const detailItem = useMemo(
    () => carDetailQuery.data?.detailResponse.items[0],
    [carDetailQuery.data]
  )

  function handleCarSelect() {
    mutateReservation.mutate()
  }

  if (!carDetailQuery.data && carDetailQuery.isLoading) {
    return (
      <div className='grid w-9/12 max-w-full gap-3'>
        <Skeleton radius={'lg'} h={20} />
        <Skeleton radius={'lg'} h={18} w={'80%'} />
        <Skeleton radius={'lg'} h={16} w={'50%'} />
      </div>
    )
  }

  if (!detailItem) return <div>no data </div>

  return (
    <div className='grid gap-3 md:grid-cols-6'>
      <div className='col-span-4'>
        <div className='grid grid-cols-5'>
          <div className='col-span-1'>
            <Image
              src={detailItem.carDetail.imageUrl}
              alt={detailItem.carDetail.name}
            />
          </div>
          <div className='col-span-4'>
            <Title fz={'h3'}>
              {detailItem.carDetail.name}{' '}
              <small className='text-gray-700'>
                - {detailItem.carDetail.category}
              </small>
            </Title>
          </div>
        </div>
      </div>
      <div className='col-span-2 grid gap-3'>
        <Title order={4}>Fiyat Özeti</Title>
        <div className='flex items-center justify-between rounded-md bg-red-100 p-3 font-semibold'>
          <div>Kartınızdan Çekilecek Tutar</div>
          <div>{formatCurrency(detailItem.totalPrice.value)}</div>
        </div>
        <div>{formatCurrency(detailItem.basePrice.value)} / Günlük </div>
        <div>
          <Button onClick={() => handleCarSelect()} type='submit'>
            Devam Et
          </Button>
        </div>
      </div>
    </div>
  )
}
