import { useEffect, useRef, useState } from 'react'
import { TableOfContents } from '@mantine/core'
import classes from './Toc.module.css'
import { TourDetailApiResponse } from '@/modules/tour/type'

type IProps = {
  tourInfo?: TourDetailApiResponse
  detailQuery?: TourDetailApiResponse
}

const TourTableOfContents: React.FC<IProps> = ({ tourInfo, detailQuery }) => {
  const [isSticky, setIsSticky] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  const ScrollRooms = () => {
    const roomsSection = document.getElementById('rooms')
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )
    const current = stickyRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, []) //thanks ai

  return (
    <>
      <div ref={stickyRef} className='-mt-3 -mb-3 h-0 overflow-hidden'></div>
      <div
        className={`${
          isSticky ? 'fixed top-0 left-0 w-full shadow-xl' : 'sticky top-0'
        } z-[99] rounded-md bg-gray-50`}
      >
        <div className='mx-auto max-w-6xl'>
          {isSticky && (
            <>
              <div className='hidden items-center px-3 font-medium md:flex md:gap-10 md:text-xl'>
                <div className='font-semibold text-gray-700'>
                  {tourInfo?.package.region.title}
                </div>
                {/* <div className='flex items-center gap-1 text-sm font-semibold text-blue-800'>
                  <RiMapPin2Line size={18} className='inline' />
                  {}
                </div> */}
              </div>
            </>
          )}
          <div className='flex items-center justify-center gap-4 md:mt-0 md:flex-row md:justify-between'>
            <TableOfContents
              classNames={classes}
              variant='filled'
              color='blue'
              size='xs'
              radius='xs'
              scrollSpyOptions={{
                selector: ' #general, #tour-program, #transport',
              }}
              getControlProps={({ data }) => ({
                onClick: () =>
                  data.getNode().scrollIntoView({
                    behavior: 'smooth',
                  }),
                children: data.value,
              })}
            />
            {/* <Button
              size='sm'
              radius='md'
              className='ms-auto hidden px-7 md:flex'
              onClick={ScrollRooms}
            >
              Odaları Gör
            </Button> */}
          </div>
        </div>
      </div>
    </>
  )
}

export { TourTableOfContents }
