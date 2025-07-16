type IProps = {
  children: React.ReactNode
}

export const BookDetailCard: React.FC<IProps> = ({ children }) => {
  return <div className='rounded-md border p-3 md:p-5'>{children}</div>
}
