import { useState } from 'react'
import { Checkbox, Group, Text, Title } from '@mantine/core'

import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useCheckoutMethods } from '@/app/reservation/checkout-query'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']['HotelCancelWarrantyPriceStatusModel']
}

enum InsuranceValues {
  Insurance = 'insurance',
  PartialPayment = 'partialPayment',
}

type InsuranceOption = {
  title: string
  checked: boolean
  id: ID
  price?: number
  value: InsuranceValues
}

const EarlyReservationInsurance: React.FC<IProps> = ({ data }) => {
  const {
    earlyReservationInsuranceMutation,
    partialPaymentMutation,
    checkoutDataQuery,
  } = useCheckoutMethods()
  const isMutationsInAction =
    earlyReservationInsuranceMutation.isPending ||
    partialPaymentMutation.isPending ||
    checkoutDataQuery.isRefetching
  const [insuranceOptions, setInsuranceOptions] = useState<InsuranceOption[]>([
    {
      title: 'İptal Güvence Paketi İstiyorum',
      checked: data.hasHotelWarranty,
      id: 1,
      price: data.cancelWarrantyPrice,
      value: InsuranceValues.Insurance,
    },
    {
      title: '%25 Ön Ödeme yapmak istiyorum',
      checked: data.hotelWarrantyDiscountSelected,
      id: 2,
      value: InsuranceValues.PartialPayment,
    },
  ])

  const handleOnChange = async (
    insuranceChoice: InsuranceOption,
    checked: boolean
  ) => {
    const nextState: InsuranceOption[] = []

    const isInsurance = insuranceChoice.value === InsuranceValues.Insurance
    const isPartial = insuranceChoice.value === InsuranceValues.PartialPayment

    const insurancePackage = insuranceOptions.find(
      (item) => item.value === InsuranceValues.Insurance
    )

    const partialPayment = insuranceOptions.find(
      (item) => item.value === InsuranceValues.PartialPayment
    )

    // Insurance package is selected, then hit the api with `checked` value.
    // Partial payment is checked as `true` value and then also `Insurance` api must be called first
    const earlyReservationRespone =
      (isInsurance || (isPartial && !insurancePackage?.checked)) &&
      (await earlyReservationInsuranceMutation.mutateAsync(checked))

    // Partial payment is checked, and Insurance is checked, then , call the partial payment api
    // Insurance is not checked and partial payment is checked then we need to call insurance api and then partial payment api
    const partialPaymentResponse =
      (isPartial || (isInsurance && !checked && partialPayment?.checked)) &&
      (await partialPaymentMutation.mutateAsync(checked))

    insuranceOptions.forEach((insurance, insuranceIndex, insuranceArr) => {
      if (
        insurance.value === InsuranceValues.Insurance &&
        earlyReservationRespone &&
        earlyReservationRespone.success
      ) {
        insurance.checked = checked
      }

      if (partialPaymentResponse && partialPaymentResponse.success) {
        insuranceArr[1].checked = checked
      }

      nextState.push(insurance)
    })

    setInsuranceOptions(nextState)

    checkoutDataQuery.refetch()
  }

  return (
    <CheckoutCard>
      <Title order={3} fz={'lg'}>
        Erken Rezervasyon Güvence Paketi
      </Title>
      <Text fz='sm' mt={6}>
        Tatil planınızda değişiklik mi oldu? Sorun değil, çünkü İptal Güvence
        Paketi ile 72 saate kadar koşulsuz değişiklik ve iptal haklarınız
        güvende.
      </Text>
      <div className='pt-4'>
        <Checkbox.Group>
          <div className='grid gap-4'>
            {insuranceOptions.map((insurance, insuranceIndex) => {
              return (
                <Checkbox.Card
                  key={insuranceIndex}
                  p={7}
                  name='cancelInsuranceCheckbox'
                  checked={insurance.checked}
                  value={insurance.value}
                  onChange={(checked) => {
                    handleOnChange(insurance, checked)
                  }}
                  disabled={isMutationsInAction}
                >
                  <Group>
                    <Checkbox.Indicator disabled={isMutationsInAction} />
                    <div className='flex items-center gap-2'>
                      <div>{insurance.title}</div>
                      {insurance.price && (
                        <strong className='text-sm'>
                          {formatCurrency(insurance.price)}
                        </strong>
                      )}
                    </div>
                  </Group>
                </Checkbox.Card>
              )
            })}
          </div>
        </Checkbox.Group>
      </div>
    </CheckoutCard>
  )
}

export { EarlyReservationInsurance }
