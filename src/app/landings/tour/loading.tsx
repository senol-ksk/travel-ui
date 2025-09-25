import { Skeleton } from '@mantine/core'

const Loading = () => (
  <div className='container mx-auto flex flex-col gap-2 pt-6'>
    <Skeleton h={20} w={'75%'} />
    <Skeleton h={20} w={'85%'} />
    <Skeleton h={20} w={'65%'} />
  </div>
)

export default Loading
