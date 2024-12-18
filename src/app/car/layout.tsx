import { CarRentSearchPanel } from '@/modules/carrent'

const CarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='border-t bg-white shadow'>
        <div className='py-3 md:container'>
          <CarRentSearchPanel />
        </div>
      </div>

      {children}
    </>
  )
}

export default CarLayout
