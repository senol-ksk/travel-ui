import { Title } from '@mantine/core'
import { cookies } from 'next/headers'

import { serviceRequest } from '@/network'
import dayjs from 'dayjs'

export default async function AccountPage() {
  const cookieStore = await cookies()

  const response = await serviceRequest<{
    birthdate: string
    confirmAgreement: boolean
    confirmKVKK: boolean
    currentKVKKFileName: null
    email: string
    gender: number
    id: ID
    identityNumber: null
    isFacebookConnected: boolean
    isForeign: boolean
    isGoogleConnected: boolean
    isInEmailPromoList: boolean
    isInSmsPromoList: boolean
    isMobileConnectActivated: boolean
    isPhoneNumberConfirmed: boolean
    loginProvider: 'site'
    mobilePhone: string
    mobilePhoneNumberFull: string
    name: string
    passportNumber: null
    passportValidity: null
    surname: string
    totalRewardAmount: null
  }>({
    axiosOptions: {
      url: 'api/account/user-info',
      headers: { Cookie: cookieStore.toString() },
    },
  })

  if (!response || !response.success) return null
  const userData = response.data

  return (
    <div>
      <Title fz={'h3'}>Hesap Bilgilerim</Title>
      <div className='pt-5'>
        <div>{`${userData?.name} ${userData?.surname}`}</div>
        {userData?.birthdate && dayjs(userData?.birthdate).isValid() && (
          <div>{dayjs(userData?.birthdate).format('DD MMMM YYYY')}</div>
        )}
        <div>{userData?.email}</div>
        <div>{userData?.mobilePhone}</div>
      </div>
    </div>
  )
}
