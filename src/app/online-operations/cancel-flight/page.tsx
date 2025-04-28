'use client'

import { Button, Container, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

const schema = z.object({
  bookingCode: z.string().nonempty(),
  surname: z.string().min(2).nonempty(),
})

type FormSchemaType = z.infer<typeof schema>

export default function CancelFlightPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const submitMutation = useMutation({
    mutationFn: async (params: FormSchemaType) => {
      const response = await serviceRequest<{
        modules: number[]
        passengers: {
          type: number
          gender: number
          fullName: string
          birthday: string
          identityNumber: string
          bookingCode: string
          campaignCode: null
          eTicketNumber: string
          firstName: string
          lastName: string
          mobilePhoneNumber: string
          email: string
          marketingAirlineCode: string
          isRoundedTrip: boolean
          module: number
          groupOrderIndex: number
          localPassengerSequenceNo: number
          localRelatedPassengerSequenceNo: null
          discount: ServicePriceType
          productItemId: ID
        }[]
        billingInformation: null
        paymentInformation: {
          basketTotal: number
          basketDiscountTotal: number
          collectingTotal: number
          financellTotal: null
          mlTotal: number
          rateOfInterest: number
          installmentCount: number
          bankName: string
          encryptedCardHolder: string
          encryptedCardNumber: string
          sellingCurrency: string
        }
        ssrList: null
        passengerCargoAddress: null
        bookingDateTime: string
        fromSession: boolean
        authorizeKey: string
        shoppingFileId: ID
        taxAmount: number
        shippingAmount: number
        operationResultPromotionUsageList: null
      }>({
        axiosOptions: {
          url: 'api/product/bookRefundData',
          params,
        },
      })
      return response
    },
    mutationKey: ['book-refund-mutation'],
  })

  return (
    <Container py={'lg'}>
      <Title>Uçak bileti, iptal/iade işlemleri</Title>
      <div>
        Web sitemiz üzerinden satın aldığınız uçak biletlerinizi sadece 2 kolay
        adımda iptal edebilirsiniz.
      </div>
      <form
        className='mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-5 sm:grid-cols-2'
        onSubmit={form.handleSubmit((data) => {
          console.log(data)
          submitMutation.mutate(data)
        })}
      >
        <div>
          <TextInput
            label='PNR No'
            {...form.register('bookingCode')}
            error={form.formState.errors.bookingCode?.message}
          />
        </div>
        <div>
          <TextInput
            label='Soyad'
            {...form.register('surname')}
            error={form.formState.errors.surname?.message}
          />
        </div>
        <div className='col-span-2 flex justify-center'>
          <Button type='submit'>Sorgula</Button>
        </div>
      </form>
    </Container>
  )
}
