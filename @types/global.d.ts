type ID = string | number

type ServicePriceType = {
  value: number
  currency: 'TRY' | 'EUR' | undefined | null
  rateValue: null
}

interface ServiceFeePriceType {
  code: string | number | null
  price: ServicePriceType
}
