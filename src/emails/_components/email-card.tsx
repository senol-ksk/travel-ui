import { Heading, Section } from '@react-email/components'

type IProps = {
  title: React.ReactNode
  children: React.ReactNode
}

export const EmailCard: React.FC<IProps> = ({ title, children }) => {
  return (
    <Section className='border-gray mb-4 rounded-lg border border-solid text-sm'>
      <Heading className='border-b-gray m-0 border-0 border-b border-solid p-3 text-base'>
        {title}
      </Heading>
      <div className='p-3'>{children}</div>
    </Section>
  )
}
