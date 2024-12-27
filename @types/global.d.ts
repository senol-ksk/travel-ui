type ID = string | number

type ServicePriceType = {
  value: number
  currency: 'TRY' | null
  rateValue: null
}

interface ServiceFeePriceType {
  code: null
  price: ServicePriceType
}
