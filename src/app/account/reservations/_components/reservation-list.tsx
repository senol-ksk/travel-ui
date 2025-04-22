import { cookies } from 'next/headers'

import { serviceRequest } from '@/network'
import { Alert } from '@mantine/core'

import { type ReservationFlight } from '../types'
import { ReservationItems } from './reservation-items'

export const ReservationList = async () => {
  const cookieStore = await cookies()
  const reservationDataResponse = await serviceRequest<ReservationFlight[]>({
    axiosOptions: {
      url: 'api/account/reservations',
      method: 'get',
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  })

  if (!reservationDataResponse || reservationDataResponse.data?.length === 0) {
    return (
      <div>
        <Alert title='Rezervasyon bulunamadı' color='yellow'>
          <div>Görüntülenecek bir rezervasyon bilgisi bulunmuyor.</div>
        </Alert>
      </div>
    )
  }

  const reservationData = reservationDataResponse.data

  return (
    <div>
      {reservationData && reservationData.length > 0 ? (
        <ReservationItems reservations={reservationData} />
      ) : (
        <div>Reservasyon bulunamadi</div>
      )}
    </div>
  )
}
