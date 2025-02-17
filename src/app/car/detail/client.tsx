'use client'

import { useMemo, useState } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  Container,
  Group,
  Image,
  Skeleton,
  Title,
} from '@mantine/core'
import { useRouter } from 'next/navigation'

import { carDetailParams } from '@/app/car/searchParams'
import { serviceRequest } from '@/network'
import {
  CarExtraOption,
  CarInsuranceOption,
  DetailResponseData,
} from '@/app/car/detail/type'
import { formatCurrency } from '@/libs/util'

import { reservationParsers } from '@/app/reservation/searchParams'
import clsx from 'clsx'

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

      if (response?.data?.detailResponse.items[0].carExtraOption.length) {
        setExtraOptions(response?.data?.detailResponse.items[0].carExtraOption)
      }
      if (response?.data?.detailResponse.items[0].carInsurances.length) {
        setInsuranceOptions(
          response?.data?.detailResponse.items[0].carInsurances
        )
      }
      return response?.data
    },
  })

  const mutateReservation = useMutation({
    mutationFn: async () => {
      const selectedExtraOptions = extraOptions
        ?.filter((item) => item.selected)
        .map((item) => item.code)
      const selectedInsuranceOptions = insuranceOptions
        ?.filter((item) => item.selected)
        .map((item) => item.code)

      const response = await serviceRequest<DetailResponseData>({
        axiosOptions: {
          url: 'api/car/reservation',
          method: 'post',
          data: {
            extraOptions: selectedExtraOptions,
            insuranceOptions: selectedInsuranceOptions,
            selectedProductKey: detailItem?.key,
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
        productKey: data?.data?.detailResponse.items.at(0)?.key,
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

  const [extraOptions, setExtraOptions] = useState<CarExtraOption[]>()
  const [insuranceOptions, setInsuranceOptions] =
    useState<CarInsuranceOption[]>()

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
    <div className='xs:grid-cols-6 grid gap-5'>
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
        {extraOptions && extraOptions?.length > 0 && (
          <div className='pt-5'>
            <Title order={5}>Ekstralar Ekleyin</Title>
            <div className='grid gap-3 pt-2 md:grid-cols-2'>
              {extraOptions
                .filter((item) => item.isSelectable)
                .map((extraOption) => (
                  <div key={extraOption.code}>
                    <Checkbox.Card
                      p={12}
                      defaultChecked={
                        extraOption.selected || extraOption.isFree
                      }
                      disabled={extraOption.isFree}
                      onChange={(checked) => {
                        setExtraOptions((prevOptions) => {
                          const nextValue = prevOptions?.map((optionItem) => {
                            if (extraOption.code === optionItem.code) {
                              optionItem.selected = checked
                            }
                            return optionItem
                          })

                          return nextValue
                        })
                      }}
                      className={clsx({
                        'border-green-200 bg-green-50': extraOption.selected,
                      })}
                    >
                      <Group>
                        <Checkbox.Indicator disabled={extraOption.isFree} />
                        <div>
                          <div>{extraOption.name}</div>
                          <div className='font-semibold text-blue-700'>
                            {formatCurrency(extraOption.totalPrice.value)}
                          </div>
                        </div>
                      </Group>
                    </Checkbox.Card>
                  </div>
                ))}
            </div>
          </div>
        )}
        {insuranceOptions && insuranceOptions?.length > 0 && (
          <div className='pt-5'>
            <Title order={5}>Güvence Paketi Ekleyin</Title>
            <div className='grid gap-3 pt-2 md:grid-cols-2'>
              {insuranceOptions
                .filter((item) => item.isSelectable)
                .map((insuranceOption) => (
                  <div key={insuranceOption.code}>
                    <Checkbox.Card
                      p={12}
                      defaultChecked={
                        insuranceOption.selected || insuranceOption.isFree
                      }
                      disabled={insuranceOption.isFree}
                      onChange={(checked) => {
                        setInsuranceOptions((prevOptions) => {
                          const nextValue = prevOptions?.map((optionItem) => {
                            if (insuranceOption.code === optionItem.code) {
                              optionItem.selected = checked
                            }
                            return optionItem
                          })

                          return nextValue
                        })
                      }}
                      className={clsx({
                        'border-green-200 bg-green-50':
                          insuranceOption.selected,
                      })}
                    >
                      <Group>
                        <Checkbox.Indicator disabled={insuranceOption.isFree} />
                        <div>
                          <div>{insuranceOption.description}</div>
                          <div className='font-semibold text-blue-700'>
                            {formatCurrency(insuranceOption.totalPrice.value)}
                          </div>
                        </div>
                      </Group>
                    </Checkbox.Card>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <div className='col-span-2'>
        <div className='grid gap-3'>
          <Title order={4}>Fiyat Özeti</Title>
          <div className='flex items-center justify-between rounded-md bg-red-100 p-3 font-semibold'>
            <div>Kartınızdan Çekilecek Tutar</div>
            <div>{formatCurrency(detailItem.totalPrice.value)}</div>
          </div>
          <div className='text-sm text-gray-600'>
            {formatCurrency(detailItem.basePrice.value)} / Günlük{' '}
          </div>
          <div className='pt-4'>
            <Button
              onClick={handleCarSelect}
              type='button'
              fullWidth
              loading={mutateReservation.isPending}
            >
              Devam Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
