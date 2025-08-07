'use client'
import { Skeleton } from '@mantine/core'
import { useSession } from 'next-auth/react'

export default function PersonLetters() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    <Skeleton visible={loading}>
      <div className='flex items-center rounded-md border p-3 shadow'>
        <div>
          <div className='col-span-1 flex size-[52px] flex-col items-center justify-center rounded-full border bg-blue-800 p-2 text-center text-xl font-bold text-white'>
            {session?.user.name
              ? `${session.user.name.split(' ')[0][0].toUpperCase()}${session.user.name.split(' ').slice(-1)[0][0].toUpperCase()}`
              : ''}
          </div>
        </div>
        <div className='ps-2'>
          <div className='flex items-center gap-1 text-xl leading-5 font-bold'>
            {session?.user.name}
          </div>
          <div className='text-xs text-gray-600'>{session?.user.email}</div>
        </div>
      </div>
    </Skeleton>
  )
}
