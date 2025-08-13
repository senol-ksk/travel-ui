'use client'

import { CreditCardForm } from '@/components/payment/credit-card'
import {
  creditCardSchema,
  CreditCardSchemaType,
} from '@/libs/credit-card-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Grid, Image, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import NextImage from 'next/image'
import { useMutation, useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { formatCurrency } from '@/libs/util'

function ParafQuery() {
  const form = useForm({
    resolver: zodResolver(creditCardSchema),
  })

  const getBonusInfoQuery = useMutation({
    mutationFn: async (data: CreditCardSchemaType) => {
      const response = await serviceRequest<{
        bonus: null | number
        advance: null | number
        remainingFund: null | number
        calculatedBonus: null | number
      }>({
        axiosOptions: {
          url: 'api/product/getBonusInfoHandler',
          method: 'get',
          params: { ...data },
        },
      })

      return response
    },
  })

  return (
    <div>
      <Title>ParafPara Sorgulama</Title>
      <div>
        Kartınızda bulunan ParafParalarınızı sorgulayarak öğrenebilirsiniz.
      </div>
      <Grid gutter={'lg'} mt={'xl'}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <form
            onSubmit={form.handleSubmit((data) => {
              getBonusInfoQuery.mutate(data)
            })}
          >
            <div className='grid gap-4 md:gap-8'>
              <div>
                <CreditCardForm form={form} />
              </div>
              {!getBonusInfoQuery.isPending &&
                getBonusInfoQuery.data?.data &&
                getBonusInfoQuery.data?.data.bonus && (
                  <div className='grid gap-3 rounded bg-blue-100 p-3 text-sm'>
                    <div className='flex justify-between'>
                      ParafPara Bakiyeniz{' '}
                      <strong>{getBonusInfoQuery.data?.data.bonus}</strong>
                    </div>
                    <hr />
                    <div className='flex justify-between'>
                      Kullanılabilir Avans ParafPara Bakiyeniz
                      <strong>{getBonusInfoQuery.data?.data.advance}</strong>
                    </div>
                  </div>
                )}
              <div>
                <Button
                  type='submit'
                  fullWidth
                  size='md'
                  loading={getBonusInfoQuery.isPending}
                >
                  Sorgula
                </Button>
              </div>
            </div>
          </form>
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, md: 5 }}
          offset={{ md: 2 }}
          visibleFrom='md'
        >
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
    </div>
  )
}

export { ParafQuery }
