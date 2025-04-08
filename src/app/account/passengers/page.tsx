import { Title } from '@mantine/core'
import { PassengerForm } from './_components/form'
import { SavePassengerList } from './_components/saved-passengers'

export default async function SavedPassengersPage() {
  return (
    <div className='grid gap-3 md:gap-5'>
      <div>
        <SavePassengerList />
      </div>
      <div>
        <Title order={2} fz={'h3'}>
          Yeni Yolcu Ekleyin
        </Title>
        <PassengerForm />
      </div>
    </div>
  )
}
