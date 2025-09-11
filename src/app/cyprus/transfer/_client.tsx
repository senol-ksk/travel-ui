'use client'

import { useQuery } from '@tanstack/react-query'
import { CyprusHotelDetailSearchParamTypes } from '../searchParams'
import { olRequest } from '@/network'
import { Skeleton, Stack, Title } from '@mantine/core'
import { CyprusTransferApiResponse } from '../types'

type IProps = {
  queryParams: CyprusHotelDetailSearchParamTypes
}

const CyprusTransferSelect: React.FC<IProps> = ({ queryParams }) => {
  const cyprusTransferDataQuery = useQuery({
    queryKey: ['cyprus-transfer-query', queryParams],
    queryFn: async () => {
      const response = await olRequest<CyprusTransferApiResponse>({
        apiAction: 'api/CyprusPackage/GetTransport',
        apiRoute: 'CyprusPackageService',
        data: {
          params: {
            ...queryParams,
            page: 1,
          },
          requestType:
            'Business.Models.CyprusPackage.TransportApiRequest, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[Business.Models.CyprusPackage.View.TransportViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
        },
      })

      return response
    },
    select: (query) => {
      return query?.data
    },
  })

  if (!cyprusTransferDataQuery.data || cyprusTransferDataQuery.isLoading)
    return <Skeleton h={20} />

  const { transfers, flights } = cyprusTransferDataQuery.data

  const departureFlight = flights.flightSegmentList[0]
  const returnFlight = flights.flightSegmentList[1]

  return (
    <div>
      <Stack gap={'md'}>
        <div>
          <Title order={3}>Gidiş Uçuşu</Title>
          <div>
            {departureFlight.origin} {departureFlight.destination}
          </div>
          <div>
            {departureFlight.flightList.map((flight) => {
              return flight.flightDetails.map((flightDetail) => {
                return (
                  <div key={flightDetail.flightNo}>
                    {flightDetail.origin} {flightDetail.destination}
                  </div>
                )
              })
            })}
          </div>
        </div>
        <div>
          <Title order={3}>Dönüş Uçuşu</Title>
          <div>
            {returnFlight.origin} {returnFlight.destination}
          </div>
          <div>
            {returnFlight.flightList.map((flight) => {
              return flight.flightDetails.map((flightDetail) => {
                return (
                  <div key={flightDetail.flightNo}>
                    {flightDetail.origin} {flightDetail.destination}
                  </div>
                )
              })
            })}
          </div>
        </div>
      </Stack>
    </div>
  )
}

export { CyprusTransferSelect }

// const payloadExample = {
//   Params: {
//     SessionToken:
//       '2DB3AD65B08D8C93DB8287A1BCE73BE5DCA2B2CD074256E4D153C72EB9AF1ED4',
//     SearchToken:
//       '3C0AFA4DE072D54CF0B12B6E1B5838911F7BBF82B363908267EC77AE77DBDE8B',
//     LanguageCode: null,
//     ApiRoute: null,
//     ApiAction: null,
//     ScopeCode: 'aa2eff06-6a09-4320-bae2-a82f9504ff19',
//     AppName: 'paraflytravel.preprod.webapp.html',
//     ProductKey:
//       'wreQIHgqJKqqAdkQG/35UUeG6N+Di+CMi5raUeTebWPmDxvS2mWswRdP1Y4VOcYkmoXhVRAsQaAWkaTCNmlhhGF35Vpax+t8NMHzQfDq/ZeA6z+bnJJeovEzXqFnPzhG',
//     ScopeName: 'PARAFLYTRAVEL',
//     Page: 1,
//     CustomerId: 0,
//     CustomerUserId: 0,
//     RoomKey:
//       '2RIOpMcyd3hqR2R8mT3AgOMf3dS5AmbB8op5Ud7jRLpnaPK9gSmf4FGQdvRnwAYSPyZNXXJDLS+RuxwYdEvR0/jfbR8NRzlG4WKVdPdbz+4nnaCOH9lp29JZ/4adyOUN',
//   },
//   SessionToken:
//     '2DB3AD65B08D8C93DB8287A1BCE73BE5DCA2B2CD074256E4D153C72EB9AF1ED4',
//   ApiRoute: 'CyprusPackageService',
//   ApiAction: 'api/CyprusPackage/GetTransport',
//   RequestType:
//     'Business.Models.CyprusPackage.TransportApiRequest, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
//   ReturnType:
//     'Core.Models.ResultModels.RestResult`1[[Business.Models.CyprusPackage.View.TransportViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
//   Device: null,
//   LanguageCode: null,
//   IPAddress: null,
//   MLToken: 'bf308200-883f-4134-86ee-6f5d5121c58a',
// }
