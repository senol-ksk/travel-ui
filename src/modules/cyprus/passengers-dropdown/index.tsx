import { Input } from '@/components/search-engine/input'
import { RiUserLine } from 'react-icons/ri'

const CyprusSearchPassengers = () => {
  return (
    <div className='relative'>
      <RiUserLine
        size={20}
        className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
      />
      <Input label='Oda ve Kişi Sayısı' title={'1 oda 2 Yetişkin 4 Çocuk'} />
    </div>
  )
}

export { CyprusSearchPassengers }
