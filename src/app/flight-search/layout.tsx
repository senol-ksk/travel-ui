import { Flight } from '@/modules/flight'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='border-t bg-white shadow'>
        <div className='container'>
          <Flight />
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
