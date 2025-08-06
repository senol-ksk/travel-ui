'use client'

import { useState } from 'react'
import { Alert, Button, Modal, Skeleton, Title } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { serviceRequest } from '@/network'
import { type SavePassengerServiceResponse } from '../types'
import { SavedPassengerItem } from './saved-passenger-item'
import { FormSchemaType, PassengerForm } from './form'

const SavedPassengerList = () => {
  const [selectedPassenger, setSelectedPassenger] =
    useState<SavePassengerServiceResponse | null>(null)
  const [isEditModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false)
  const savedPassengersQuery = useQuery({
    queryKey: ['saved-passengers'],
    queryFn: async () => {
      const response = await serviceRequest<SavePassengerServiceResponse[]>({
        axiosOptions: {
          url: 'api/account/getSavedPassengers',
        },
      })

      return response?.data ?? []
    },
  })

  const deletePassenger = useMutation({
    mutationKey: ['delete-saved-passenger'],
    mutationFn: async (id: ID) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/deleteSavedPassenger',
          method: 'delete',
          data: id,
        },
      })

      return response
    },
    onSuccess() {
      savedPassengersQuery.refetch()
    },
  })

  const updatePassengerMutation = useMutation({
    mutationKey: ['update-passenger'],
    mutationFn: async (data: FormSchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/updateSavedPassenger',
          method: 'post',
          data: {
            ...data,
            _passengerId: selectedPassenger?._passengerId,
            model_PassengerId: selectedPassenger?.model_PassengerId,
            registeredPassengerId: selectedPassenger?.registeredPassengerId,
            id: selectedPassenger?.registeredPassengerId,
            passengerKey: selectedPassenger?.passengerKey,
          },
        },
      })

      return response
    },
    onSuccess(data) {
      if (data?.success) {
        closeEditModal()
        savedPassengersQuery.refetch()
        notifications.show({
          title: 'İşlem Başarılı',
          message: 'Yolcu güncellendi.',
          position: 'top-right',
          color: 'white',
          bg: 'green',
          withBorder: true,
          classNames: {
            description: 'text-black',
            title: 'text-white',
          },
        })
      }
    },
  })

  return (
    <div>
      <div>
        <Title fz={'h5'} pb={'md'}>
          Kayıtlı Yolcular
        </Title>
        {!savedPassengersQuery.data && savedPassengersQuery.isLoading && (
          <div className='grid grid-cols-2 gap-3'>
            <Skeleton h={40} radius={'md'} />
            <Skeleton h={40} radius={'md'} />
            <Skeleton h={40} radius={'md'} />
            <Skeleton h={40} radius={'md'} />
          </div>
        )}
        {savedPassengersQuery.data?.length === 0 && (
          <Alert color='yellow'>Kayıtlı yolcu bulunamadı.</Alert>
        )}
        {savedPassengersQuery.data && savedPassengersQuery.data.length > 0 && (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {savedPassengersQuery.data.map((passenger) => (
              <SavedPassengerItem
                key={passenger.registeredPassengerId}
                passenger={passenger}
                onDelete={() => {
                  deletePassenger.mutate(passenger.registeredPassengerId)
                }}
                isDeleting={deletePassenger.isPending}
                onSelect={() => {
                  openEditModal()
                  setSelectedPassenger(passenger)
                }}
              />
            ))}
          </div>
        )}
      </div>
      <Modal
        opened={isEditModalOpened}
        onClose={closeEditModal}
        title={`${selectedPassenger?.firstName} ${selectedPassenger?.lastName}`}
        size={'lg'}
      >
        {selectedPassenger && (
          <PassengerForm
            defaultValues={selectedPassenger}
            onSubmit={(data) => {
              updatePassengerMutation.mutate(data)
            }}
            isSubmitting={updatePassengerMutation.isPending}
          />
        )}
      </Modal>
    </div>
  )
}

export { SavedPassengerList }
