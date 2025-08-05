import { Title } from '@mantine/core'
import { cookies } from 'next/headers'
import { Account } from './type'
import { serviceRequest } from '@/network'
import { MyAccount } from './_components/my-account'

export default async function AccountPage() {
  const cookieStore = await cookies()

  const response = await serviceRequest<Account>({
    axiosOptions: {
      url: 'api/account/user-info',
      headers: { Cookie: cookieStore.toString() },
    },
  })

  if (!response || !response.success || !response.data) {
    return <div>Kullanıcı bilgisi bulunamadı.</div>
  }
  const userData = response.data

  return (
    <div>
      <Title fz='h3'>Hesap Bilgileri</Title>
      {userData && <MyAccount defaultValues={userData} />}
    </div>
  )
}
