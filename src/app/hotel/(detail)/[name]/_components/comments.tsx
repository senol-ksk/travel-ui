import { Card, Badge, Text, Group } from '@mantine/core'

const Comments = () => {
  return (
    <div className='flex space-x-4 overflow-x-auto p-4'>
      {[...Array(6)].map((_, index) => (
        <Card
          key={index}
          className='xl:w-/5 w-50 flex-shrink-0 sm:w-1/2 lg:w-1/5'
          padding='lg'
          shadow='sm'
          radius='md'
        >
          <Group mb='xs'>
            <Text size='sm'>Çok iyi</Text>
            <Badge color='green' size='lg' radius='md'>
              7
            </Badge>
          </Group>
          <Text size='sm' color='dimmed'>
            Genç Çift | Tatil
          </Text>
          <Text mt='md' size='sm'>
            Temizlikçi hanımların sabahları koridorlarda bağrışmaları olmazsa
            çok iyiydi
          </Text>
        </Card>
      ))}
    </div>
  )
}

export { Comments }
