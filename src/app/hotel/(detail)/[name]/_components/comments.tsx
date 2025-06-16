import { HotelCommentInfo } from '@/app/hotel/types'
import { Card, Badge, Text, Group, Divider } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  data: HotelCommentInfo
}

const Comments: React.FC<IProps> = ({ data }) => {
  const { comments } = data
  return (
    <div className='flex space-x-4 overflow-x-auto p-4'>
      {comments.map((comment, index) => (
        <Card
          key={index}
          className='xl:w-/5 w-50 flex-shrink-0 bg-blue-50 text-sm sm:w-1/2 lg:w-1/5'
          padding='lg'
          shadow='sm'
          radius='md'
        >
          <Group mb='xs'>
            <Text size='sm'>Çok iyi</Text>
            <Badge color='green' size='lg' radius='md'>
              {comment.averageScore}
            </Badge>
          </Group>
          <Text size='sm'>
            {comment.withWhoLabel} | {comment.reasonLabel}
          </Text>

          <div className='h-[150px] overflow-hidden pt-2 text-sm'>
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
  )
}

export { Comments }
