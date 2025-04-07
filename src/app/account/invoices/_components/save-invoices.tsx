'use client'

import { serviceRequest } from '@/network'
import { ActionIcon, Button, Popover, Skeleton, Title } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RiDeleteBin5Line, RiEditLine } from 'react-icons/ri'
import { SavedInvoicesResponse } from '../types'
import { SaveInvoiceCard } from './saved-invoice-cards'

const SavedInvoices = () => {
  const queryClient = useQueryClient()

  const invoiceQuery = useQuery({
    queryKey: ['saved-invoices'],
    queryFn: async () => {
      const response = await serviceRequest<SavedInvoicesResponse[]>({
        axiosOptions: {
          url: 'api/account/getRegisteredInvoices',
        },
      })

      return response?.data
    },
  })

  const removeInvoiceMutation = useMutation({
    mutationFn: async (id: ID) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/removeBillingInfoItem',
          method: 'post',
          data: { id: id },
        },
      })

      return response
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['saved-invoices'],
      })
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
            <SaveInvoiceCard
              key={invoice.id}
              invoice={invoice}
              onDelete={() => {
                console.log('delete this id', invoice.id)
                removeInvoiceMutation.mutate(invoice.id)
              }}
            />
          ))}
        </div>
      ) : (
        <div>Kayıtlı fatura bulunamadı.</div>
      )}
    </div>
  )
}

export { SavedInvoices }
