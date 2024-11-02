import dayjs from 'dayjs'

export const formatCurrency = (
  amount: number,
  currency: 'TRY' | 'USD' | 'EUR' = 'TRY'
) =>
  new Intl.NumberFormat('tr', {
    style: 'currency',
    currency,
  }).format(amount)

export const days = (): string[] =>
  Array.from(Array(31).keys()).map((day) =>
    (day < 9 ? `0${++day}` : ++day).toString()
  )

export const yearList = (
  startYear: number,
  currentYear: number = new Date().getFullYear()
): number[] => {
  const years = []

  while (startYear <= currentYear) {
    years.push(startYear++)
  }
  return years
}
