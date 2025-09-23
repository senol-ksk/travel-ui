import { Button, Collapse, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaChevronDown } from 'react-icons/fa'

type IProps = {
  content: React.ReactNode
}

const InstallmentBankDescription: React.FC<IProps> = ({ content }) => {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <div>
      <div className='text-end'>
        <Button
          className='font-normal'
          type='button'
          variant='white'
          size='xs'
          onClick={toggle}
          rightSection={
            !opened ? <FaChevronDown size={12} /> : <BsChevronUp size={12} />
          }
        >
          Kampanya Detayı
        </Button>
      </div>
      <Collapse in={opened}>
        <div>{content}</div>
      </Collapse>
    </div>
  )
}

export { InstallmentBankDescription }
