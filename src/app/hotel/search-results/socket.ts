import { io } from 'socket.io-client'

export const hotelSocket = ({ searchToken }: { searchToken: string }) => {
  return io(process.env.NEXT_PUBLIC_HOTEL_SOCKET_URL, {
    // autoConnect: false,
    // reconnection: false,
  })
}
