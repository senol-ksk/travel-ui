import { HotelCommentInfo } from '@/app/hotel/types'
import { Carousel } from '@mantine/carousel'
import { Card, Badge, Text, Group, Divider } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

type IProps = {
  data: HotelCommentInfo
  onCommentClick?: () => void
}

const Comments: React.FC<IProps> = ({ data, onCommentClick }) => {
  const { comments } = data
  const [slideSize, setSlideSize] = useState('100%')

  useEffect(() => {
    const handleResize = () => {
      setSlideSize(window.innerWidth >= 768 ? '25%' : '100%')
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <Carousel
        className='p-3'
        slideSize={slideSize}
        slideGap='md'
        emblaOptions={{ align: 'start' }}
      >
        {comments.map((comment, index) => (
          <Carousel.Slide key={index}>
            <Card
              className='h-full cursor-pointer bg-blue-50 text-sm hover:bg-blue-100'
              padding='lg'
              shadow='sm'
              radius='lg'
              onClick={onCommentClick}
            >
              {comment.averageScore > 0 && (
                <Group mb='xs'>
                  <Text size='sm'>Çok iyi</Text>
                  <Badge color='green' size='lg' radius='md'>
                    {comment.averageScore}
                  </Badge>
                </Group>
              )}
              <Text size='sm' className='truncate font-medium'>
                {comment.withWhoLabel} {comment.reasonLabel}
              </Text>

              <div className='flex-1 pt-2 text-sm'>
                <Text lineClamp={4} fz={'sm'} className='h-20'>
                  {comment.positiveCotent}
                </Text>
              </div>
              <Divider my={'sm'} />
              <div className='text-xs'>
                <div className='truncate'>
                  {comment.name} {comment.surname}
                </div>
                <div>{dayjs(comment.commentDate).format('MMMM YYYY')}</div>
              </div>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}

export { Comments }
