'use client'

import { useState } from 'react'
import { Alert, Modal, Skeleton } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { SavedInvoicesResponse } from '../types'
import { SaveInvoiceCard } from './saved-invoice-cards'
import { InvoiceType } from '@/types/global'
import { IndividualForm, IndividualFormSchemaType } from './individual-form'
import { CorporateForm, CorporateFormSchemaType } from './corporate-form'
import { serviceRequest } from '@/network'

const SavedInvoices = () => {
  const queryClient = useQueryClient()
  const [isEditModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false)
  const [selectedInvoice, setSelectedInvoice] =
    useState<SavedInvoicesResponse | null>(null)

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
    mutationKey: ['remove-invoice-info'],
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
      notifications.show({
        title: 'Kayıtlı fatura mesajı',
        message: 'sectiğiniz fatura silindi.',
        position: 'top-center',
      })
    },
  })

  const editInvoiceMutation = useMutation({
    mutationKey: ['edit-invoice-info'],
    mutationFn: async (
      data: IndividualFormSchemaType | CorporateFormSchemaType
    ) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/editBillingInfo',
          method: 'post',
          data,
        },
      })

      return response
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['saved-invoices'],
      })
      closeEditModal()
      notifications.show({
        title: 'Kayıtlı fatura mesajı',
        message: 'sectiğiniz fatura başarılı şekilde düzenlendi.',
        position: 'top-center',
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
    <>
      <div>
        {!!invoiceQuery?.data && invoiceQuery?.data?.length > 0 ? (
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            {invoiceQuery?.data.map((invoice) => (
              <SaveInvoiceCard
                key={invoice.id}
                invoice={invoice}
                onDelete={() => {
                  removeInvoiceMutation.mutate(invoice.id)
                }}
                onEdit={() => {
                  setSelectedInvoice(invoice)
                  openEditModal()
                }}
                isDeleting={removeInvoiceMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <Alert color='yellow'>Kayıtlı fatura bulunamadı.</Alert>
        )}
      </div>
      <Modal
        opened={isEditModalOpened}
        onClose={closeEditModal}
        title={selectedInvoice?.billingInfoName}
      >
        {selectedInvoice?.type.toString() === InvoiceType.Corporate && (
          <div>
            <CorporateForm
              onFormSubmit={(data) => {
                editInvoiceMutation.mutate(data)
              }}
              defaultValues={selectedInvoice}
              isSubmitting={editInvoiceMutation.isPending}
            />
          </div>
        )}
        {selectedInvoice?.type.toString() === InvoiceType.Individual && (
          <div>
            <IndividualForm
              defaultValues={selectedInvoice}
              onFormSubmit={(data) => {
                editInvoiceMutation.mutate(data)
              }}
              isSubmitting={editInvoiceMutation.isPending}
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export { SavedInvoices }
