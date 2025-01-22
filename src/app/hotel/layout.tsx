import { HotelSearchEngine } from '@/modules/hotel'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='border-b'>
        <div className='p-4 lg:container'>
          <HotelSearchEngine />
        </div>
      </div>
      <div>{children}</div>
    </>
  )
}
