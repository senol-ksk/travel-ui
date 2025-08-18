'use client'

import { useQuery } from '@tanstack/react-query'
import { MyAccount } from './my-account'
import { serviceRequest } from '@/network'
import { Account } from '../type'
import { Skeleton } from '@mantine/core'
import { redirect } from 'next/navigation'

export const AccountInfoLayer = () => {
  const userInfoQuery = useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const response = await serviceRequest<Account>({
        axiosOptions: {
          url: 'api/account/user-info',
          headers: { Cookie: cookieStore.toString() },
        },
      })

      return response
    },
  })

  if (!userInfoQuery.data && userInfoQuery.isLoading)
    return <Skeleton height={20} />

  if (!userInfoQuery.data?.data && !userInfoQuery.data?.success)
    return redirect('/auth/login')

  if (userInfoQuery.data?.data)
    return <MyAccount defaultValues={userInfoQuery.data?.data} />
}
