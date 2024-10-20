export const formatCurrency = (
  amount: number,
  currency: 'TRY' | 'USD' | 'EUR' = 'TRY'
) => {
  return new Intl.NumberFormat('tr', {
    style: 'currency',
    currency,
  }).format(amount)
}
