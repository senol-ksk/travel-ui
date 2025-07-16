import { Container, Skeleton } from '@mantine/core'
import { Suspense } from 'react'
import { TransferBookDetail } from './_components/detail'

export default function TransferBookDetailPage() {
  return (
    <Container
      maw={700}
      py={{
        base: 'md',
        md: 'xl',
      }}
      px={0}
      className='grid gap-2 md:gap-5'
    >
      <Suspense fallback={<Skeleton h={20} />}>
        <TransferBookDetail />
      </Suspense>
    </Container>
  )
}
