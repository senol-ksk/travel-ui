export const AgreementContentTableWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <table className='w-full table-auto [&_td]:border-b [&_td]:py-2'>
    {children}
  </table>
)
