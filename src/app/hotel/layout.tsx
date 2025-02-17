import { HotelSearchEngine } from '@/modules/hotel'
import { Container } from '@mantine/core'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='border-b'>
        <Container className='py-4'>
          <HotelSearchEngine />
        </Container>
      </div>
      <div>{children}</div>
    </>
  )
}
