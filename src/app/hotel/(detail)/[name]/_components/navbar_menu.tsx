import { Stack } from '@mantine/core'

function NavbarMenu() {
  const scrollToTarget = (targetId: string) => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className='sticky top-0 z-10 bg-white shadow-sm'>
      <Stack align='start' className='grid grid-cols-12 gap-1 border'>
        <div className='col-span-12 grid cursor-pointer grid-cols-10 gap-1 py-3 md:grid-cols-12'>
          <div
            className='col-span-2 text-center text-xs sm:text-sm'
            role='button'
            onClick={() => scrollToTarget('rooms')}
          >
            Odalar
          </div>
          <div
            className='col-span-2 text-center text-xs sm:text-sm'
            role='button'
            onClick={() => scrollToTarget('location')}
          >
            Konum
          </div>
          <div
            className='col-span-3 text-center text-xs sm:text-sm'
            role='button'
            onClick={() => scrollToTarget('facility-infos')}
          >
            Tesis Bilgileri
          </div>
          <div
            className='col-span-2 text-center text-xs sm:text-sm'
            role='button'
            onClick={() => scrollToTarget('ratings')}
          >
            Değerlendirmeler
          </div>
          {/* <div
            className='col-span-2 text-center text-xs sm:text-sm'
            role='button'
            onClick={() => scrollToTarget('events')}
          >
            Etkinlikler
          </div> */}
        </div>
      </Stack>
    </div>
  )
}

export { NavbarMenu }
