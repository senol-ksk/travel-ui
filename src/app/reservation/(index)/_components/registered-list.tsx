'use client'

import { OrderPassengerModel } from '@/app/account/reservations/types'
import { serviceRequest } from '@/network'
import { Button, Menu, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'

interface RegisteredListProps {
  onPassengerSelect?: (passenger: OrderPassengerModel) => void
}

export const RegisteredList = ({ onPassengerSelect }: RegisteredListProps) => {
  const [data, setData] = useState<OrderPassengerModel[]>([])

  useEffect(() => {
    const response = async () => {
      const response = await serviceRequest<OrderPassengerModel[]>({
        axiosOptions: {
          url: `/api/account/register-list`,
          method: 'get',
        },
      })
      if (response?.data) {
        setData(response.data)
      }
    }
    response()
  }, [])

  const handlePassengerSelect = (passenger: OrderPassengerModel) => {
    console.log('passenger selected:', passenger)
    onPassengerSelect?.(passenger)
  }
  const methods = data.map((passenger, item) => {})
  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <Button
          variant='transparent'
          size='xs'
          rightSection={<HiChevronDown size={10} />}
        >
          +Kayıtlı Kişilerden Seç
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {data.map((passenger) => (
          <Menu.Item
            key={passenger.passengerId}
            onClick={() => handlePassengerSelect(passenger)}
          >
            <Text size='sm'>
              {passenger.FirstName} {passenger.LastName}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
