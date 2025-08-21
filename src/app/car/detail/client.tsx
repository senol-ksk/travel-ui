'use client'

import { useMemo, useState } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Image,
  rem,
  Skeleton,
  Spoiler,
  Stack,
  Title,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

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
import { FaCheckCircle, FaChevronRight, FaInfoCircle } from 'react-icons/fa'
import { FuelTypes } from '@/modules/carrent/types'
import {
  MdAirlineSeatReclineNormal,
  MdElectricalServices,
  MdInfoOutline,
  MdOutlineAccountBalanceWallet,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import dayjs from 'dayjs'
import { LuFuel } from 'react-icons/lu'
import { BiTachometer } from 'react-icons/bi'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { BsInfoCircle } from 'react-icons/bs'
import { useDisclosure } from '@mantine/hooks'
import { CiCircleInfo } from 'react-icons/ci'
import { RentTermsDrawer } from '@/app/car/component/rent-terms-drawer'
import { CarSearchResultItem } from '../component/result-item'
import { WorkingHoursDrawer } from '@/app/car/component/working-hour-drawers'
import { Route } from 'next'
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
      }) as Route
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
  const totalPrice = detailItem?.totalPrice.value ?? 0
  const selectedInsurancePrice =
    detailItem?.carInsurances?.reduce((a, b) => {
      const selectedPrice = b.selected ? b.totalPrice.value : 0
      return a + selectedPrice
    }, 0) ?? 0

  const allTotalPrice =
    selectedExtraOptionPrice + selectedInsurancePrice + totalPrice
  const carInfo = carDetailQuery.data?.carRentalSearchPanel
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
  const [
    workingInfoOpened,
    { open: openWorkingInfoDrawer, close: closeWorkingInfoDrawer },
  ] = useDisclosure(false)
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
    <div className='flex flex-col items-start gap-5 md:grid md:grid-cols-6'>
      <div className='col-span-4 grid gap-4'>
        <div>
          <Alert
            color='green'
            radius={'md'}
            icon={<FaCheckCircle size={70} />}
            p={'sm'}
          >
            <div className='text-md text-green-800'>
              Teslim almadan 24 saat öncesine kadar ÜCRETSİZ iptal
            </div>
          </Alert>
        </div>
        <div className='grid gap-5 rounded-md border p-3 md:p-5'>
          <div className='md:col-span-2'>
            <Image
              src={detailItem.carDetail.imageUrl}
              alt={detailItem.carDetail.name}
            />
            <Image
              my={'sm'}
              className='block md:hidden'
              w={60}
              src={detailItem.carDetail.vendorUrl}
              alt={detailItem.carDetail.vendorName}
            />
          </div>
          <div className='flex flex-col gap-3 md:col-span-3'>
            <div className='flex items-center gap-2'>
              <Title fz={'h3'}>{detailItem.carDetail.name}</Title>
              <div className='text-sm'>
                veya benzeri - {detailItem.carDetail.category}
              </div>
            </div>
            <div className='gap-2 text-sm md:flex md:gap-4'>
              <div className='flex items-center gap-2'>
                <div>
                  {detailItem.carDetail.fuelType ===
                  FuelTypes['Elektirikli'] ? (
                    <MdElectricalServices />
                  ) : (
                    <LuFuel />
                  )}
                </div>
                <div>{FuelTypes[detailItem.carDetail.fuelType]}</div>
              </div>
              <div className='flex items-center gap-2'>
                <div>
                  <TbManualGearbox />
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
                <div>{detailItem.carDetail.seatCount} Koltuk</div>
              </div>
            </div>
            <div className='grid gap-2 text-sm md:flex md:gap-4'>
              {detailItem.carDetail.deposit.value > 0 && (
                <div className='flex items-center gap-2'>
                  <div>
                    <MdOutlineAccountBalanceWallet />
                  </div>
                  Depozito:
                  <span className='font-semibold'>
                    {formatCurrency(detailItem.carDetail.deposit.value)}
                  </span>
                </div>
              )}
              <div className='flex items-center gap-2'>
                <div>
                  <BiTachometer />
                </div>
                Toplam Km sınır:
                <span className='font-semibold'>
                  {detailItem.carDetail.kminCluded
                    ? detailItem.carDetail.kminCluded
                    : 'Belirtilmemiş'}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm font-semibold text-green-800'>
              <div>
                <IoIosCheckmarkCircle size={20} />
              </div>
              <div>Ücretsiz iptal</div>
            </div>
          </div>
          <div className='hidden'>
            <Image
              src={detailItem.carDetail.vendorUrl}
              alt={detailItem.carDetail.vendorName}
            />
          </div>
          <div className='md:col-span-5'>
            <div className='grid gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2'>
              <div>
                <div className='text-sm'>Teslim Alış</div>
                <div className='text-md font-semibold'>
                  {dayjs
                    .utc(detailItem.carDetail.pickupDate)
                    .format('DD MMMM YYYY, HH:mm')}
                </div>
                <div className='text-sm'>
                  {carDetailQuery.data?.pickupStation.location.name}
                </div>

                <div
                  onClick={openWorkingInfoDrawer}
                  className='flex items-center gap-2'
                >
                  <div className='cursor-pointer text-blue-700'>
                    Çalışma Saatleri
                  </div>
                  <FaChevronRight className='text-blue-700' size={12} />
                </div>
                {carDetailQuery.data != null && (
                  <WorkingHoursDrawer
                    data={carDetailQuery.data}
                    opened={workingInfoOpened}
                    onClose={closeWorkingInfoDrawer}
                  />
                )}
              </div>

              <div>
                <div className='text-sm'>Teslim ediş</div>
                <div className='text-md font-semibold'>
                  {dayjs
                    .utc(detailItem.carDetail.returnDate)
                    .format('DD MMMM YYYY, HH:mm')}
                </div>
                <div className='text-sm'>
                  {carDetailQuery.data?.returnStation.location.name}
                </div>
                <div
                  onClick={openWorkingInfoDrawer}
                  className='flex items-center gap-2'
                >
                  <div className='cursor-pointer text-blue-700'>
                    Çalışma Saatleri
                  </div>
                  <FaChevronRight className='text-blue-700' size={12} />
                </div>
                {carDetailQuery.data != null && (
                  <WorkingHoursDrawer
                    data={carDetailQuery.data}
                    opened={workingInfoOpened}
                    onClose={closeWorkingInfoDrawer}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {detailItem && detailItem.carExtraOption?.length > 0 && (
          <div className='flex flex-col gap-3 rounded-md border p-4'>
            <Title order={3} fz='lg'>
              Önerilen Ürünler ve Güvenceler
            </Title>
            <div className='text-xs'>
              Aşağıdaki seçeneklerden herhangi birini talep edebilirsiniz. Bu
              talepler garanti edilemez ve Ek hizmetlerin ücreti araç teslimi
              sırasında firmaya ödenir.
            </div>

            <Spoiler
              className='mb-5 grid gap-3 pb-3'
              maxHeight={185}
              showLabel='Daha fazla göster'
              hideLabel='Daha az göster'
            >
              <div className='flex flex-col gap-3'>
                {carDetailQuery?.data?.detailResponse?.items[0]?.carExtraOption
                  .filter((item) => item.isSelectable)
                  .map((extraOption, extraOptionIndex) => {
                    return (
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
                            'border-blue-800': extraOption.selected,
                            'text-blue-800': extraOption.selected,
                          })}
                        >
                          <Group className='flex items-center gap-2'>
                            <div>
                              <Checkbox.Indicator
                                size='md'
                                disabled={extraOption.isFree}
                              />
                            </div>
                            <div className='md:text-md flex flex-1 items-center justify-between text-sm font-medium'>
                              <div>{extraOption.name}</div>
                              <div className='md:text-md flex items-center gap-2 text-sm font-medium'>
                                +{formatCurrency(extraOption.totalPrice.value)}
                                {''}
                                <span className='hidden text-xs text-gray-600 md:flex'>
                                  / Gün
                                </span>
                              </div>
                            </div>
                          </Group>
                        </Checkbox.Card>
                      </div>
                    )
                  })}
              </div>
            </Spoiler>
          </div>
        )}
        {detailItem && detailItem.carInsurances.length > 0 && (
          <div className='flex flex-col gap-3 rounded-md border p-4'>
            <Title order={3} fz='lg'>
              Güvence Paketi Ekleyin
            </Title>
            <div className='flex flex-col gap-3'>
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
                        'border-blue-800': insuranceOption.selected,
                        'text-blue-800': insuranceOption.selected,
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
        <div className='grid gap-3 rounded-md border p-3'>
          <RentTermsDrawer
            kminCluded={detailItem.carDetail.kminCluded}
            minDriverAge={detailItem.carDetail.minDriverAge}
            licenseYear={detailItem.carDetail.licenseYear}
          />
        </div>
      </div>
      <div className='sticky grid w-full md:top-1 md:col-span-2'>
        <div className='flex flex-col gap-3 rounded-md border bg-white p-4'>
          <Title order={4} fw='normal'>
            Fiyat Özeti
          </Title>
          <div className='flex items-center justify-between rounded bg-gray-50 p-3'>
            <div>Kartınızdan Çekilecek Tutar</div>
            <div>{formatCurrency(detailItem.totalPrice.value)}</div>
          </div>
          <div className='px-3 text-sm text-gray-600'>
            {formatCurrency(detailItem.basePrice.value)} / Günlük{' '}
          </div>
          {(selectedExtraOptionPrice || selectedInsurancePrice) > 0 && (
            <div className='flex items-center justify-between rounded bg-gray-50 p-3'>
              <div>Ofiste Ödenecek Tutar</div>
              <div>
                {formatCurrency(
                  selectedExtraOptionPrice + selectedInsurancePrice
                )}
              </div>
            </div>
          )}
          <Divider />
          <div className='flex items-center justify-between p-3'>
            <div>Toplam Tutar:</div>{' '}
            <div className='text-xl font-semibold'>
              {formatCurrency(allTotalPrice)}
            </div>
          </div>
          <div>
            <Button
              size='md'
              radius={'md'}
              onClick={handleCarSelect}
              type='button'
              fullWidth
              loading={mutateReservation.isPending}
            >
              <span className='text-md'>Ödemeye İlerle</span>
              <MdOutlineKeyboardArrowRight
                size={20}
                className='text-color-700'
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
