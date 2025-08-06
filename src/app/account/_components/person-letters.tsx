'use client'
import { Skeleton } from '@mantine/core'
import { useSession } from 'next-auth/react'

export default function PersonLetters() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  return (
    <>
      <Skeleton
        className='grid grid-cols-5 items-center rounded-md border p-2 shadow'
        visible={loading}
      >
        <div className='col-span-1 flex flex-col items-center justify-center rounded-full border bg-blue-800 p-4 text-center text-xl font-bold text-white md:p-2'>
          {session?.user.name
            ? `${session.user.name.split(' ')[0][0].toUpperCase()}${session.user.name.split(' ').slice(-1)[0][0].toUpperCase()}`
            : ''}
        </div>
        <div className='col-span-3 mx-auto'>
          <div className='flex items-center gap-1 text-xl font-bold'>
            {session?.user.name}
          </div>
        </div>
      </Skeleton>
    </>
  )
}
