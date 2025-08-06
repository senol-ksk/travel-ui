import { Suspense } from 'react'
import { RegisterForm } from './_components/register-form'

import { redirect } from 'next/navigation'
import { auth } from '@/app/auth'
import { Skeleton } from '@mantine/core'

export default async function RegisterPage() {
  const session = await auth()

  if (session) redirect('/account')

  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <RegisterForm />
    </Suspense>
  )
}
