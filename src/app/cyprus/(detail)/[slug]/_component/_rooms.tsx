'use client'

import {
  cyprusHotelDetailSearchParams,
  cyprusHotelDetailSerializer,
} from '@/app/cyprus/searchParams'
import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { useSelectedRoomDetailMutation } from '@/app/cyprus/useSelectedRoomDetailQuery'
import { reservationParsers } from '@/app/reservation/searchParams'
import { Button } from '@mantine/core'
import { Route } from 'next'
import { Link, useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'

type IProps = {
  roomGroups: CyprusHotelDetailApiResponse['hotelDetailResponse']['items']
  roomDetails: CyprusHotelDetailApiResponse['hotelDetailResponse']['roomDetails']
}

export const CyprusRooms: React.FC<IProps> = ({ roomGroups, roomDetails }) => {
  const [searchParams] = useQueryStates(cyprusHotelDetailSearchParams)
  const router = useTransitionRouter()
  const reservationParams = createSerializer(reservationParsers)
  const roomDetailMutation = useSelectedRoomDetailMutation()
  const handleRedirect = ({
    roomGroupKey,
    roomKey,
  }: {
    roomKey: string
    roomGroupKey: string
  }) => {
    if (searchParams.isTransfer || searchParams.isFlight) {
      const url = cyprusHotelDetailSerializer('/cyprus/transfer', {
        ...searchParams,
        roomKey,
        roomGroupKey,
      })
      return router.push(url)
    }
    roomDetailMutation.mutate(
      {
        queryParams: searchParams,
        roomKey: roomGroupKey,
        selectedDepartureFlight: null,
        selectedReturnFlight: null,
        selectedTransfer: null,
      },
      {
        onSuccess: (query) => {
          const url = reservationParams('/reservation', {
            productKey: roomGroupKey,
            searchToken: searchParams.searchToken,
            sessionToken: searchParams.sessionToken,
          })

          return router.push(url)
        },
      }
    )
  }

  return roomGroups?.map((roomGroup) => {
    const rooms = roomGroup.rooms
    const roomKeys = rooms.map((s) => s.key)
    const roomDetailsKeys = Object.entries(roomDetails)
    const details = roomDetailsKeys
      .filter((x) => roomKeys.includes(x[0]))
      .map((x) => x[1])

    return (
      <div key={roomGroup.key}>
        {rooms.map((room) => {
          const detail = details[0]

          return (
            <div key={room.key}>
              <div>{detail.roomType}</div>
              <div>
                <Button
                  onClick={() => {
                    handleRedirect({
                      roomGroupKey: roomGroup.key,
                      roomKey: room.key,
                    })
                  }}
                >
                  Devam
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  })
}
