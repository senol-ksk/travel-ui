'use client'

import { FlightRefundApiResponse } from '@/app/online-operations/types'
import { flightRefundParams } from '@/libs/onlineOperations/searchParams'
import { serviceRequest } from '@/network'
import { Alert, Container, Skeleton } from '@mantine/core'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

export default function FlightRefundPage() {
  const queryClient = useQueryClient()
  const [searchParams] = useQueryStates(flightRefundParams)
  console.log(searchParams)

  const flightDataCache = queryClient.getMutationCache().find({
    mutationKey: ['book-refund-mutation'],
  })?.state.data as FlightRefundApiResponse | undefined

  const flightDataQuery = useQuery({
    enabled: !flightDataCache,
    queryKey: ['book-refund-query', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<FlightRefundApiResponse>({
        axiosOptions: {
          url: 'api/product/bookRefundData',
          params: searchParams,
        },
      })
      return response
    },
  })
  if (flightDataQuery.isLoading)
    return (
      <Container py={'lg'} className='grid gap-3'>
        <Skeleton h={30} radius={'md'} />
        <Skeleton h={20} maw={'75%'} radius={'md'} />
        <Skeleton h={20} maw={'55%'} radius={'md'} />
      </Container>
    )

  if (!flightDataCache && !flightDataQuery.data)
    return (
      <Container py={'lg'}>
        <Alert color='red'>Pnr no bulunamadı.</Alert>
      </Container>
    )
  return <Container py={'lg'}>sadas</Container>
}
