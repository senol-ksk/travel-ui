import { CarRentSearchPanel } from '@/modules/carrent'
import { Container } from '@mantine/core'

const CarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='border-t bg-white shadow'>
        <Container>
          <div className='py-3'>
            <CarRentSearchPanel />
          </div>
        </Container>
      </div>

      {children}
    </>
  )
}

export default CarLayout
