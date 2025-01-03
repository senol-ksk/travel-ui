import { Flight } from '@/modules/flight'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='border-t bg-white shadow'>
        <div className='container py-3'>
          <Flight />
        </div>
      </div>

      {children}
    </>
  )
}
