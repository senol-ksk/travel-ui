import { Title } from '@mantine/core'
import { SavedPassengerList } from './_components/saved-passengers'
import { SavePassenger } from './_components/save-passenger'

export default function SavedPassengersPage() {
  return (
    <div className='grid gap-3'>
      <div>
        <SavePassenger />
      </div>
      <div className='pt-6'>
        <SavedPassengerList />
      </div>
    </div>
  )
}
