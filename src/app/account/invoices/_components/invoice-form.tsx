'use client'

import { InvoiceType } from '@/types/global'
import { Group, Radio, RadioGroup, rem, Title } from '@mantine/core'
import { useState } from 'react'

import { IndividualForm } from './individual-form'
import { CorporateForm } from './corporate-form'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

const InvoiceForm = () => {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    InvoiceType.Corporate
  )

  const addBillingInfoMutation = useMutation({
    mutationFn: async () => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/addBillingInfo',
        },
      })

      console.log(response)
      return response
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
              console.log('IndividualForm, ', data)
            }}
          />
        </div>
      )}
      {invoiceType === InvoiceType.Corporate && (
        <div>
          <CorporateForm
            onFormSubmit={(data) => {
              console.log('CorporateForm, ', data)
            }}
          />
        </div>
      )}
    </>
  )
}

export { InvoiceForm }
