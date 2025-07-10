import { ParafQuery } from './_components/query'
import { Suspense } from 'react'
import { Container, Skeleton } from '@mantine/core'

export default function ParafQueryPage() {
  return (
    <Container
      px={{
        base: 'md',
        md: 'xl',
      }}
    >
      <Suspense fallback={<Skeleton h={20} mx='auto' maw={500} />}>
        <ParafQuery />
      </Suspense>
    </Container>
  )
}
