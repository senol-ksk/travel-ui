import 'intl-tel-input/styles'

const Checkout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='container pt-2 md:pt-5'>
      <div className='grid gap-3 md:grid-cols-3 md:gap-4'>
        <div className='order-2 md:order-1 md:col-span-2'>{children}</div>
        <div className='text-sm md:order-2'>
          <CheckoutCard>summary section</CheckoutCard>
        </div>
      </div>
    </div>
  )
}

const CheckoutCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className='rounded-md border bg-white p-2 shadow-sm md:p-6'>
    {children}
  </div>
)

export default Checkout
