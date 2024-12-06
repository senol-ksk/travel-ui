import io from 'socket.io-client'

export const socket = ({
  sessionToken,
  searchToken,
}: {
  sessionToken: string
  searchToken: string
}) =>
  io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    reconnectionAttempts: 5,
    autoConnect: false,
  }).emit('Auth', { sessionToken, searchToken })

// socket.on('AvailabilityStatus', (data) => {
//   console.log(data)
// })
