import { Button, Collapse, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

type IProps = {
  content: React.ReactNode
}

const InstallmentBankDescription: React.FC<IProps> = ({ content }) => {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <div>
      <div className='text-end'>
        <Button
          type='button'
          variant='white'
          size='xs'
          onClick={toggle}
          rightSection={
            !opened ? <BsChevronDown size={16} /> : <BsChevronUp size={16} />
          }
        >
          Taksit ve Kampanya
        </Button>
      </div>
      <Collapse in={opened}>
        <div>{content}</div>
      </Collapse>
    </div>
  )
}

export { InstallmentBankDescription }
