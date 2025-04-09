'use client'

import { serviceRequest } from '@/network'
import { Alert, Card, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'

export type SavePassengerServiceResponse = {
  _passengerId: ID
  model_PassengerId: ID
  declaredAge: number
  productType: number
  checkinDate: string
  calculationYearBased: boolean
  calculationYearType: number
  passengerId: ID
  sequenceNo: number
  type: number
  gender: number
  firstName: string
  lastName: string
  middleName: null
  birthDate: string
  nationality: string
  nationality_Check: null | boolean
  citizenNo: string
  passportNo: null | string
  mobilePhoneNumber: string
  email: string
  isContact: boolean
  flightFrequencyNo: string
  notes: null
  passportValidityDate: null
  webUserId: ID
  passportCountry: ID
  groupOrderIndex: number
  passengerKey: null
  isRecord: boolean
  listFlightFrequencyAirline: string[]
  listFlightFrequencyNo: string[]
  registeredPassengerId: ID
  isDontValidate: boolean
  hesCode: null
}

const SavedPassengerList = () => {
  const savedPassengersQuery = useQuery({
    queryKey: ['saved-passengers'],
    queryFn: async () => {
      const response = await serviceRequest<SavePassengerServiceResponse[]>({
        axiosOptions: {
          url: 'api/account/getSavedPassengers',
        },
      })

      return response?.data ?? []
    },
  })

  return (
    <div>
      <Title fz={'h3'} pb={'md'}>
        Kayıtlı Yolcular
      </Title>
      {savedPassengersQuery.data?.length === 0 && (
        <Alert color='yellow'>Kayıtlı yolcu bulunamadı.</Alert>
      )}
      {savedPassengersQuery.data && savedPassengersQuery.data.length > 0 && (
        <div className='grid grid-cols-2 gap-3'>
          {savedPassengersQuery.data.map((passenger) => (
            <Card key={passenger.registeredPassengerId} withBorder shadow='xs'>
              <Title order={6} className='leading-sm flex items-center gap-2'>
                <span>
                  {passenger.firstName} {passenger.lastName}
                </span>
                <small className='font-normal text-gray-600'>
                  {passenger.email}
                </small>
              </Title>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export { SavedPassengerList }
