import { Container, Skeleton } from '@mantine/core'

export default function Loading() {
  return (
    <Container className='flex flex-col gap-3'>
      <Skeleton h={30} />
      <Skeleton h={20} maw={'600'} />
      <Skeleton h={20} maw={'300'} />
    </Container>
  )
}
