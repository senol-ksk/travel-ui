export const CheckoutCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className={`rounded-md border bg-white p-2 shadow md:gap-6 md:p-4`}>
    {children}
  </div>
)
