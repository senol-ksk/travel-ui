'use client'

import { InvoiceType } from '@/types/global'
import {
  Group,
  LoadingOverlay,
  Radio,
  RadioGroup,
  rem,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  IndividualForm,
  type IndividualFormSchemaType,
} from './individual-form'
import { CorporateForm, type CorporateFormSchemaType } from './corporate-form'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

const InvoiceForm = () => {
  const queryClient = useQueryClient()
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    InvoiceType.Individual
  )

  const addBillingInfoMutation = useMutation({
    mutationFn: async (
      data: IndividualFormSchemaType | CorporateFormSchemaType
    ) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/addBillingInfo',
          method: 'post',
          data: { ...data },
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

  return (
    <>
      <Title pb={rem(20)} fz={'h3'}>
        Fatura Bilgisi Ekle
      </Title>

      <RadioGroup
        name='invoiceType'
        value={invoiceType}
        onChange={(value) => {
          setInvoiceType(value as InvoiceType)
        }}
      >
        <Group>
          <Radio label='Bireysel' value={InvoiceType.Individual} />
          <Radio label='Kurumsal' value={InvoiceType.Corporate} />
        </Group>
      </RadioGroup>

      {invoiceType === InvoiceType.Individual && (
        <div>
          <IndividualForm
            onFormSubmit={(data) => {
              addBillingInfoMutation.mutate(data)
            }}
          />
        </div>
      )}
      {invoiceType === InvoiceType.Corporate && (
        <div>
          <CorporateForm
            onFormSubmit={(data) => {
              addBillingInfoMutation.mutate(data)
            }}
          />
        </div>
      )}

      <LoadingOverlay visible={addBillingInfoMutation.isPending} />
    </>
  )
}

export { InvoiceForm }
