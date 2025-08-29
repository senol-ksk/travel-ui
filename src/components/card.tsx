import { Title } from '@mantine/core'
import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export const CheckoutCard: React.FC<{
  children: React.ReactNode
  title?: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}> = ({ children, title, className }) => (
  <div
    className={twMerge(
      `grid gap-4 rounded-md border bg-white p-2 shadow-xs md:p-3`,
      className
    )}
  >
    {title && (
      <Title order={3} fz={'lg'} mb={'md'} className='border-b text-base'>
        {title}
      </Title>
    )}
    {children}
  </div>
)
