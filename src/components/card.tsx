export const CheckoutCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className='grid gap-3 rounded-md border bg-white p-2 shadow md:gap-6 md:p-6'>
    {children}
  </div>
)
