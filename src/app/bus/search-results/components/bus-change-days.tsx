import { Button, Skeleton } from '@mantine/core'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

type IProps = {
  handlePrevDay: () => void
  handleNextDay: () => void
  busDates: string
}
export const BusSearchPrevNextButtons: React.FC<IProps> = ({
  handlePrevDay,
  handleNextDay,
  busDates,
}: IProps) => {
  return (
    <div className='flex items-center gap-2'>
      <Button
        size='md'
        variant='outline'
        className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
        onClick={handlePrevDay}
      >
        <MdKeyboardArrowLeft color='black' size={18} />
        <span className='hidden font-normal text-black md:block'>
          Önceki Gün
        </span>
      </Button>

      <div className='flex flex-grow justify-center rounded bg-gray-200 py-2 font-medium'>
        {busDates}
      </div>

      <Button
        size='md'
        variant='outline'
        className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
        onClick={handleNextDay}
      >
        <span className='hidden font-normal text-black md:block'>
          Sonraki Gün
        </span>
        <MdKeyboardArrowRight size={18} color='black' className='md:mt-1' />
      </Button>
    </div>
  )
}
