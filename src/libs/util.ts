import dayjs from 'dayjs'

export const formatCurrency = (
  amount: number,
  currency: 'TRY' | 'USD' | 'EUR' | undefined | null = 'TRY'
) =>
  new Intl.NumberFormat('tr', {
    style: 'currency',
    currency: currency ?? 'TRY',
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

export const generateUUID = () => crypto.randomUUID()

export const delayCodeExecution = (ms: number) =>
  new Promise((res) => setTimeout(res, ms))

// removes nullish values from object
export function cleanObj<T>(obj: T): T {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

export function slugify(input: string | number): string {
  if (!input) return ''
  let slug = input.toLocaleString().toLowerCase().trim()
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim()
  slug = slug.replace(/[\s-]+/g, '-')

  return slug
}
