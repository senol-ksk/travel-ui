'use client'

import { useMemo, useState } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Checkbox,
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
import { FaCheckCircle } from 'react-icons/fa'
import { FuelTypes } from '@/modules/carrent/types'
import {
  MdAirlineSeatReclineNormal,
  MdElectricalServices,
} from 'react-icons/md'
import { BsFuelPump } from 'react-icons/bs'
import { TbManualGearboxFilled } from 'react-icons/tb'
import dayjs from 'dayjs'

export const DetailClient = () => {
  const [params] = useQueryStates(carDetailParams)
  const queryClient = useQueryClient()

  const [extraOptions, setExtraOptions] = useState<CarExtraOption[]>()
  const [insuranceOptions, setInsuranceOptions] =
    useState<CarInsuranceOption[]>()

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
    },
  })

  const mutateReservation = useMutation({
    mutationFn: async () => {
      const selectedExtraOptions = detailItem?.carExtraOption
        ?.filter((item) => item.selected)
        .map((item) => item.code)
      const selectedInsuranceOptions = detailItem?.carInsurances
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
      queryClient.invalidateQueries({
        queryKey: ['checkout'],
      })

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

  const selectedExtraOptionPrice =
    detailItem?.carExtraOption?.reduce((a, b) => {
      const selectedPrice = b.selected ? b.totalPrice.value : 0
      return a + selectedPrice
    }, 0) ?? 0

  const selectedInsurancePrice =
    detailItem?.carInsurances?.reduce((a, b) => {
      const selectedPrice = b.selected ? b.totalPrice.value : 0
      return a + selectedPrice
    }, 0) ?? 0

  function handleCarSelect() {
    mutateReservation.mutate()
  }

  const handleAdditionalOptionSelect = ({
    data,
    checked,
    type,
  }: {
    data: CarInsuranceOption | CarExtraOption
    checked: boolean
    type: 'extra' | 'insurance'
  }) => {
    switch (type) {
      case 'extra':
        setExtraOptions(() => {
          const nextValue = detailItem?.carExtraOption?.map((optionItem) => {
            if (data.code === optionItem.code) {
              optionItem.selected = checked
            }
            return optionItem
          })

          return nextValue
        })
        break

      case 'insurance':
        setInsuranceOptions(() => {
          const nextValue = detailItem?.carInsurances?.map((optionItem) => {
            if (data.code === optionItem.code) {
              optionItem.selected = checked
            }
            return optionItem
          })

          return nextValue
        })
        break
    }
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
      <div className='col-span-4 grid gap-4'>
        <div>
          <Alert
            color='green'
            radius={'md'}
            icon={<FaCheckCircle size={70} />}
            classNames={{
              root: 'border border-green-200',
            }}
          >
            <div className='md:text-md font-semibold text-green-800'>
              Teslim almadan 24 saat öncesine kadar ÜCRETSİZ iptal
            </div>
          </Alert>
        </div>
        <div className='grid grid-cols-5'>
          <div className='col-span-2'>
            <Image
              src={detailItem.carDetail.imageUrl}
              alt={detailItem.carDetail.name}
            />
          </div>
          <div className='col-span-3'>
            <Title fz={'h3'}>
              {detailItem.carDetail.name}{' '}
              <small className='text-gray-700'>
                - {detailItem.carDetail.category}
              </small>
            </Title>
            <div className='grid grid-cols-2 gap-2 pt-3 text-sm'>
              <div className='flex items-center gap-2'>
                <div>
                  {detailItem.carDetail.fuelType ===
                  FuelTypes['Elektirikli'] ? (
                    <MdElectricalServices />
                  ) : (
                    <BsFuelPump />
                  )}
                </div>
                <div>{FuelTypes[detailItem.carDetail.fuelType]}</div>
              </div>
              <div className='flex items-center gap-2'>
                <div>
                  <TbManualGearboxFilled />
                </div>
                <div>
                  {detailItem.carDetail.automaticTransmission
                    ? 'Otomatik Vites'
                    : 'Düz Vites'}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div>
                  <MdAirlineSeatReclineNormal />
                </div>
                <div>{detailItem.carDetail.seatCount}</div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src={detailItem.carDetail.vendorUrl}
              alt={detailItem.carDetail.vendorName}
            />
          </div>
        </div>
        <div className='grid gap-3 md:grid-cols-2'>
          <div>
            <Title order={6} fz={'h5'}>
              Teslim Alış
            </Title>
            <div className='font-semibold'>
              {dayjs(detailItem.carDetail.pickupDate).format(
                'DD MMMM YYYY, HH:mm'
              )}
            </div>
            <div className='text-sm'>
              {carDetailQuery.data?.pickupStation.address.addressName}
            </div>
          </div>

          <div>
            <Title order={6} fz={'h5'}>
              Teslim ediş
            </Title>
            <div className='font-semibold'>
              {dayjs(detailItem.carDetail.returnDate).format(
                'DD MMMM YYYY, HH:mm'
              )}
            </div>
            <div className='text-sm'>
              {carDetailQuery.data?.returnStation.address.addressName}
            </div>
          </div>
        </div>
        {detailItem && detailItem.carExtraOption?.length > 0 && (
          <div className='pt-5'>
            <Title order={5}>Ekstralar Ekleyin</Title>
            <div className='grid gap-3 pt-2 md:grid-cols-2'>
              {carDetailQuery?.data?.detailResponse?.items[0]?.carExtraOption
                .filter((item) => item.isSelectable)
                .map((extraOption, extraOptionIndex) => (
                  <div key={extraOptionIndex}>
                    <Checkbox.Card
                      p={12}
                      checked={extraOption.selected || extraOption.isFree}
                      disabled={extraOption.isFree}
                      onChange={(checked) => {
                        handleAdditionalOptionSelect({
                          data: extraOption,
                          checked,
                          type: 'extra',
                        })
                      }}
                      className={clsx({
                        'border-green-200 bg-green-50': extraOption.selected,
                      })}
                    >
                      <Group>
                        <Checkbox.Indicator disabled={extraOption.isFree} />
                        <div className='flex-1 text-sm'>
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
        {detailItem && detailItem.carInsurances.length > 0 && (
          <div className='pt-5'>
            <Title order={5}>Güvence Paketi Ekleyin</Title>
            <div className='grid gap-3 pt-2 md:grid-cols-2'>
              {detailItem.carInsurances
                .filter((item) => item.isSelectable)
                .map((insuranceOption, insuranceOptionIndex) => (
                  <div key={insuranceOptionIndex}>
                    <Checkbox.Card
                      p={12}
                      checked={
                        insuranceOption.selected || insuranceOption.isFree
                      }
                      disabled={insuranceOption.isFree}
                      onChange={(checked) => {
                        handleAdditionalOptionSelect({
                          data: insuranceOption,
                          checked,
                          type: 'insurance',
                        })
                      }}
                      className={clsx({
                        'border-green-200 bg-green-50':
                          insuranceOption.selected,
                      })}
                    >
                      <Group>
                        <Checkbox.Indicator disabled={insuranceOption.isFree} />
                        <div className='flex-1 text-sm'>
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
          {(selectedExtraOptionPrice || selectedInsurancePrice) > 0 && (
            <div className='flex items-center justify-between rounded-md bg-blue-100 p-3 font-semibold'>
              <div>Ofiste Ödenecek Tutar</div>
              <div>
                {formatCurrency(
                  selectedExtraOptionPrice + selectedInsurancePrice
                )}
              </div>
            </div>
          )}

          <div>
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
