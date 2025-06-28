import { ReactNode } from 'react'
import { OnlineOperationButtonLinks } from './_componets/links'
import { Container, ScrollArea } from '@mantine/core'

export default function OnlineOperationsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div className='pb-5'>
      <div className='relative'>
        <div className='before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
          <div className='relative before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
            <Container>
              <ScrollArea>
                <div className='flex gap-2 pt-3 pb-3 whitespace-nowrap md:pt-10 md:pb-7'>
                  <OnlineOperationButtonLinks />
                </div>
              </ScrollArea>
            </Container>
          </div>
          <div className='relative'>
            <div className='before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
              <div className='relative before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
                <Container>
                  <div className='rounded-md border bg-white p-3 md:p-8'>
                    {children}
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
