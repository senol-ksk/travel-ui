import { HotelCommentInfo } from '@/app/hotel/types'
import { Card, Badge, Text, Group, Divider, Button } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

type IProps = {
  data: HotelCommentInfo
}

const CommentsDrawer: React.FC<IProps> = ({ data }) => {
  const { comments } = data
  const [slideSize, setSlideSize] = useState('100%')

  useEffect(() => {
    const handleResize = () => {
      setSlideSize(window.innerWidth >= 768 ? '30%' : '100%')
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <div className='mt-5 gap-2 rounded bg-gray-50 p-3'>
        <div className='flex items-center justify-between rounded border-b-20 border-b-gray-50 bg-white p-5'>
          <div className='hidden items-center gap-2 self-end text-blue-800 md:grid'>
            <div className='flex items-center gap-2'>
              <div className='rounded-md bg-blue-100 p-5 text-3xl leading-none font-bold'>
                {data?.averageScore}
              </div>
              <div className='grid items-center'>
                <div className='items-center text-2xl font-semibold'>
                  Mükemmel
                </div>
                <Button
                  className='border-0 bg-white p-0 font-normal text-black'
                  size='md'
                >
                  {data?.comments?.length ?? 0} değerlendirme
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {comments.map((comment, index) => (
            <Card
              key={index}
              className='w-full bg-blue-50 text-sm font-medium'
              padding='lg'
              shadow='sm'
              radius='md'
            >
              <Group mb='xs'>
                <Text size='sm' className='font-medium'>
                  Çok iyi
                </Text>
                <Badge color='blue' size='lg' radius='md'>
                  {comment.averageScore}
                </Badge>
              </Group>
              <Text size='sm' className='font-medium'>
                {comment.withWhoLabel} {comment.reasonLabel}
              </Text>
              <div className='h-full overflow-hidden pt-2 text-sm'>
                <Text lineClamp={6} fz={'sm'}>
                  {comment.positiveCotent}
                </Text>
              </div>
              <Divider my={'sm'} />
              <div>
                {comment.name} {comment.surname}
              </div>
              <div>{dayjs(comment.commentDate).format('MMMM YYYY')}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export { CommentsDrawer }
