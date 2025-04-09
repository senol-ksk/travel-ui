'use client'

import { Button, Modal, Title } from '@mantine/core'
import { type FormSchemaType, PassengerForm } from './form'
import { IoPersonAddOutline } from 'react-icons/io5'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

export const SavePassenger = () => {
  const [opened, { open, close }] = useDisclosure(false)

  const addNewPassengerMutation = useMutation({
    mutationKey: ['add-new-passenger'],
    mutationFn: async (formData: FormSchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/addNewPassenger',
          method: 'post',
          data: formData,
        },
      })

      return response
    },
  })

  return (
    <div>
      <Button leftSection={<IoPersonAddOutline size={20} />} onClick={open}>
        Yeni Yolcu Ekleyin
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title='Yeni Yolcu Ekleyin'
        size={'lg'}
      >
        <PassengerForm
          onSubmit={(data) => addNewPassengerMutation.mutate(data)}
          isSubmitting={addNewPassengerMutation.isPending}
        />
      </Modal>
    </div>
  )
}
