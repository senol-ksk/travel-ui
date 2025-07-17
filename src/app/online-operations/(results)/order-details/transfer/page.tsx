import { Container, Skeleton } from '@mantine/core'
import { Suspense } from 'react'
import { TransferBookDetail } from './_components/detail'

export default function TransferBookDetailPage() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <TransferBookDetail />
    </Suspense>
  )
}
