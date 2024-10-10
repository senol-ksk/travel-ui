export const formatCurrency = (
  amount: number,
  currency?: 'TRY' | 'USD' | 'EUR'
) => {
  if (!currency) currency = 'TRY'

  return new Intl.NumberFormat('tr', {
    style: 'currency',
    currency,
  }).format(amount)
}
