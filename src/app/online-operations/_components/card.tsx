import { twMerge } from 'tailwind-merge'

type IProps = {
  children: React.ReactNode
  className?: HTMLDivElement['className']
}

export const BookDetailCard: React.FC<IProps> = ({ children, className }) => {
  return (
    <div className={twMerge('rounded-md border p-3 md:p-5', className)}>
      {children}
    </div>
  )
}
