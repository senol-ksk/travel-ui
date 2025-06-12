import { Stack, TableOfContents } from '@mantine/core'

function NavbarMenu() {
  const scrollToTarget = (targetId: string) => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    // <div className='sticky top-0 z-10 rounded bg-gray-50'>
    //   <Stack align='start' className='grid grid-cols-12 gap-1'>
    //     <div className='col-span-12 grid cursor-pointer grid-cols-10 gap-1 py-3 md:grid-cols-12'>
    //       <div
    //         className='col-span-2 text-center'
    //         role='button'
    //         onClick={() => scrollToTarget('rooms')}
    //       >
    //         Odalar
    //       </div>
    //       <div
    //         className='col-span-2 text-center'
    //         role='button'
    //         onClick={() => scrollToTarget('location')}
    //       >
    //         Konum
    //       </div>
    //       <div
    //         className='col-span-3 text-center'
    //         role='button'
    //         onClick={() => scrollToTarget('facility-infos')}
    //       >
    //         Tesis Bilgileri
    //       </div>
    //       <div
    //         className='col-span-2 text-center'
    //         role='button'
    //         onClick={() => scrollToTarget('ratings')}
    //       >
    //         Değerlendirmeler
    //       </div>
    //     </div>
    //   </Stack>
    // </div>
    <div className='sticky top-0 z-30 hidden rounded bg-gray-50 p-3 sm:block'>
      <TableOfContents
        variant='filled'
        color='blue'
        size='sm'
        radius='sm'
        scrollSpyOptions={{
          selector: '#rooms, #location, #facility-infos, #ratings',
        }}
        getControlProps={({ data }) => ({
          onClick: () =>
            data.getNode().scrollIntoView({
              behavior: 'smooth',
            }),
          children: data.value,
        })}
      />
    </div>
  )
}

export { NavbarMenu }
