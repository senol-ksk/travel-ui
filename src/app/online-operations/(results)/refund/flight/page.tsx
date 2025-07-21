'use client'

import { FlightRefundApiResponse } from '@/app/online-operations/types'
import { flightRefundParams } from '@/libs/onlineOperations/searchParams'
import { serviceRequest, ServiceResponse } from '@/network'
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Group,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'
import 'dayjs/locale/tr'
import { useState } from 'react'
dayjs.locale('tr')

export default function FlightRefundPage() {
  const queryClient = useQueryClient()
  const [searchParams] = useQueryStates(flightRefundParams)
  const [selectedETicketNumbers, setETicketNumbers] = useState<string[]>([])

  const flightDataCache = queryClient.getMutationCache().find({
    mutationKey: ['book-refund-mutation'],
  })?.state.data as ServiceResponse<FlightRefundApiResponse> | undefined

  let flightData = flightDataCache?.data

  const flightDataQuery = useQuery({
    enabled: !flightData,
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

  const validateRefundMutation = useMutation({
    mutationFn: async () => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/product/validateFlightRefund',
          method: 'post',
          data: {
            surname: searchParams.surname,
            bookingCode: searchParams.bookingCode,
            key: operationResultViewData.authorizeKey,
            eTicketNumber: selectedETicketNumbers,
          },
        },
      })

      return response
    },
  })

  if (!flightData) {
    flightData = flightDataQuery.data?.data as
      | FlightRefundApiResponse
      | undefined
  }

  if (flightDataQuery.isLoading)
    return (
      <Container py={'lg'} className='grid gap-3'>
        <Skeleton h={30} radius={'md'} />
        <Skeleton h={20} maw={'75%'} radius={'md'} />
        <Skeleton h={20} maw={'55%'} radius={'md'} />
      </Container>
    )

  if (!flightData)
    return (
      <Container py={'lg'}>
        <Alert color='red'>Pnr no bulunamadı.</Alert>
      </Container>
    )

  const { summaryResponse } = flightData[1]
  const { operationResultViewData } = flightData[0]

  return (
    <Container py={'lg'}>
      <Title fw={'normal'} mb={'lg'}>
        Uçak İptal ve İade
      </Title>
      <div className='rounded-md border p-3 md:p-5'>
        {flightData[1].summaryResponse.flightList.map(
          (flightList, flightListIndex) => {
            const relatedSegment = flightList.flightSegments.find((segment) =>
              flightList.flightDetail.flightSegmentKeys.find(
                (detailSegmentKey) => detailSegmentKey === segment.key
              )
            )

            return (
              <div key={flightListIndex}>
                <div className='text-sm'>
                  <strong>
                    {dayjs(relatedSegment?.departureTime).format(
                      'DD MMMM YYYY - hh:mm'
                    )}
                  </strong>{' '}
                  {relatedSegment?.origin.code && (
                    <div>
                      {
                        summaryResponse.airportList[relatedSegment?.origin.code]
                          .city
                      }{' '}
                      {' - '}
                    </div>
                  )}
                  {' - '}
                  <strong>
                    {dayjs(relatedSegment?.arrivalTime).format(
                      'DD MMMM YYYY - hh:mm'
                    )}
                  </strong>
                  {' - '}
                  {relatedSegment?.destination.code &&
                    summaryResponse.airportList[
                      relatedSegment?.destination.code
                    ].value.at(0)?.value}
                </div>
              </div>
            )
          }
        )}

        <div className='mt-6'>
          <Checkbox.Group
            value={selectedETicketNumbers}
            onChange={setETicketNumbers}
          >
            <Stack gap={'sm'}>
              {operationResultViewData.passengers.map((passenger) => (
                <div key={passenger.eTicketNumber}>
                  <Checkbox.Card
                    value={passenger.eTicketNumber}
                    p={'md'}
                    className='hover:bg-gray-50'
                  >
                    <Group wrap='nowrap'>
                      <Checkbox.Indicator />
                      <div>{passenger.fullName}</div>
                    </Group>
                  </Checkbox.Card>
                </div>
              ))}
            </Stack>
          </Checkbox.Group>
        </div>
        <div className='pt-6'>
          <Button
            onClick={() => {
              validateRefundMutation.mutate()
            }}
            disabled={!selectedETicketNumbers?.length}
          >
            Devam
          </Button>
        </div>
      </div>
    </Container>
  )
}
