import { Skeleton } from '@mantine/core'

const TransferExtraLoading = () => {
  return (
    <div className='container grid gap-3 p-6'>
      <Skeleton radius={'lg'} className='w-full md:w-5/6' h={28} />
      <Skeleton radius={'lg'} className='w-full md:w-2/3' h={20} />
      <Skeleton radius={'lg'} className='w-full md:w-1/3' h={16} />
    </div>
  )
}

export default TransferExtraLoading
