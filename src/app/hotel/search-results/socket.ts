import { io } from 'socket.io-client'

const hotelSocket = io(process.env.NEXT_PUBLIC_HOTEL_SOCKET_URL, {
  autoConnect: false,
  reconnection: false,
})

export { hotelSocket }
