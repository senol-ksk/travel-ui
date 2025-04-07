'use client'

import { serviceRequest } from '@/network'
import { Skeleton, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'

const SavedInvoices = () => {
  const invoiceQuery = useQuery({
    queryKey: ['saved-invoices'],
    queryFn: async () => {
      const response = await serviceRequest<
        {
          id: ID
          title: string
          name: string
          lastName: string
          type: number
          tcKimlikNo: string
          vergiNo: null
          vergiDairesi: null
          countryCode: string
          city: string
          district: string
          address: string
          mobilPhoneNumber: string
          phoneNumber: null
          faxNumber: null
          billingInfoName: string
          fullName: string
          email: string
          hesAddress: null
        }[]
      >({
        axiosOptions: {
          url: 'api/account/getRegisteredInvoices',
        },
      })

      return response?.data
    },
  })
  if (!invoiceQuery.data && invoiceQuery.isLoading)
    return (
      <div>
        <Skeleton h={20} radius={'md'} />
      </div>
    )

  return (
    <div>
      {!!invoiceQuery?.data && invoiceQuery?.data?.length > 0 ? (
        <div className='grid grid-cols-4 gap-3'>
          {invoiceQuery?.data.map((invoice) => (
            <div key={invoice.id} className='rounded border p-3'>
              <Title order={5}>{invoice.billingInfoName}</Title>
              <div>{invoice.fullName}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>Kayıtlı fatura bulunamadı.</div>
      )}
    </div>
  )
}

export { SavedInvoices }
