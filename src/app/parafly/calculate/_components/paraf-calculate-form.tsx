'use client'

import NextImage from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  NativeSelect,
  NativeSelectProps,
  NumberInput,
  Radio,
  Stack,
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import NumberFlow from '@number-flow/react'

import { z } from '@/libs/zod'
import { serviceRequest } from '@/network'
import { delayCodeExecution } from '@/libs/util'

const productTypes: NativeSelectProps['data'] = [
  { label: 'Uçak', value: 'Flight' },
  { label: 'Otel', value: 'Hotel' },
  { label: 'Araç Kiralama', value: 'CarRental' },
  { label: 'Tur', value: 'Tour' },
]

const schema = z.object({
  isDomestic: z.boolean(),
  moduleName: z.string(),
  amount: z
    .number({
      message: 'Geçerli bir tutar giriniz.',
    })
    .refine((value) => value >= 1000, {
      message: 'En az 1000TL girmelisiniz.',
    }),
})

type SchemaType = z.infer<typeof schema>

export const ParafCalculate = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 2000.0,
    },
  })

  const calculateMutation = useMutation({
    mutationFn: async (params: SchemaType) => {
      const response = await serviceRequest<number>({
        axiosOptions: {
          url: 'api/product/calculateBonus',
          method: 'get',
          params,
        },
      })

      await delayCodeExecution(2000)

      return response
    },
  })

  const calculatedPrice = calculateMutation.data?.data ?? 0

  return (
    <Grid gutter={'lg'} mt={'xl'}>
      <Grid.Col span={{ base: 12, md: 5 }} pos={'relative'}>
        <Stack
          component={'form'}
          onSubmit={form.handleSubmit((data) => {
            if (!calculateMutation.isPending) calculateMutation.mutate(data)
          })}
        >
          <Controller
            control={form.control}
            name='isDomestic'
            defaultValue={true}
            render={({ field }) => (
              <Radio.Group
                size='md'
                onChange={(value) => {
                  field.onChange(value === '1')
                }}
                defaultValue={'1'}
              >
                <Group>
                  <Radio value='1' label='Yurt içi' />
                  <Radio value='2' label='Yurt dışı' />
                </Group>
              </Radio.Group>
            )}
          />
          <div>
            <NativeSelect
              label='Seyahat ürünü Seçiniz'
              data={productTypes}
              size='md'
              {...form.register('moduleName')}
            />
          </div>
          <div>
            <Controller
              name='amount'
              control={form.control}
              render={({ field, fieldState }) => (
                <NumberInput
                  {...field}
                  type='tel'
                  inputMode='decimal'
                  allowNegative={false}
                  label='Ürün Fiyatını Yazınız'
                  hideControls
                  size='md'
                  maxLength={20}
                  error={fieldState.error?.message}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator='.'
                  decimalSeparator=','
                  suffix=' TL'
                />
              )}
            />
          </div>
          <div className='relative flex gap-4 rounded-md bg-gray-50 px-5 py-2 text-lg'>
            ParafPara Değeri:{' '}
            <div>
              <NumberFlow
                format={{
                  style: 'decimal',
                }}
                value={calculatedPrice}
                animated={!calculateMutation.isPending}
                suffix=' pp'
              />
            </div>
          </div>
          <div className='grid'>
            <Button type='submit' size='md'>
              Hesapla
            </Button>
          </div>
        </Stack>
        <LoadingOverlay visible={calculateMutation.isPending} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }} offset={{ md: 3 }} visibleFrom='md'>
        <Image
          component={NextImage}
          src={'/paraf_kart_2x.webp'}
          alt='paraf card'
          width={304}
          height={204}
          placeholder='blur'
          blurDataURL='...'
        />
      </Grid.Col>
    </Grid>
  )
}
