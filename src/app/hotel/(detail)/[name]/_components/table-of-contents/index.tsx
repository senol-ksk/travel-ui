import { Button, TableOfContents } from '@mantine/core'

import classes from './Toc.module.css'

function HotelTableOfContents() {
  const ScrollRooms = () => {
    const roomsSection = document.getElementById('rooms')
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <>
      <TableOfContents
        classNames={classes}
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
      <Button size='sm' radius='md' className='m-3 px-7' onClick={ScrollRooms}>
        Odaları Gör
      </Button>
    </>
  )
}

export { HotelTableOfContents }
