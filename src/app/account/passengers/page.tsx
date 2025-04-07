import { Alert, Button, Title } from '@mantine/core'
import { cookies } from 'next/headers'

import { serviceRequest } from '@/network'
import dayjs from 'dayjs'
import { PassengerForm } from './_components/form'

export default async function SavedPassengersPage() {
  const cookieStore = await cookies()

  const response = await serviceRequest<
    {
      birthdate: string
      email: string
      gender: number
      id: ID
      identityNumber: null
      mobilePhone: string
      name: string
      passportNumber: null
      passportValidity: null
      surname: string
    }[]
  >({
    axiosOptions: {
      url: 'api/account/getSavedPassengers',
      headers: { Cookie: cookieStore.toString() },
    },
  })

  const savedPassengers = response?.data ?? []

  return (
    <div>
      <Title>Kayıtlı Yolcuları</Title>
      {savedPassengers.length === 0 && (
        <Alert color='yellow' my={'md'}>
          Kayıtlı Yolcu bulunamadı.
        </Alert>
      )}
      <PassengerForm />
    </div>
  )
}
