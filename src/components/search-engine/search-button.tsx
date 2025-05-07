import { Button } from '@mantine/core'

export const SearchEngineButton = ({
  title = 'Ara',
}: {
  title?: React.ReactNode
}) => {
  return (
    <Button w={'100%'} type='submit' className='rounded-lg' size='xl'>
      {title}
    </Button>
  )
}
