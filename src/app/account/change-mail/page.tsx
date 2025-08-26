import { Suspense } from 'react'
import { Skeleton, Title } from '@mantine/core'

import { Change } from './_components/change'

const ChangeSkeleton = () => (
  <div className='grid gap-3'>
    <Skeleton h={20} />
    <Skeleton h={20} />
  </div>
)

export default async function ChangePage() {
  return (
    <div>
      <Title order={2} className='text-center'>
        Paraflytravel için yeni e-mail adresinizi oluşturun.
      </Title>
      <Suspense fallback={<ChangeSkeleton />}>
        <div>
          <Change />
        </div>
      </Suspense>
    </div>
  )
}
