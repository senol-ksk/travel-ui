import React from 'react'

interface LocationProps {
  location: [number, number]
}

const Location: React.FC<LocationProps> = ({ location }) => {
  const lat = location[0].toString().replace(',', '.')
  const lon = location[1].toString().replace(',', '.')
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lon}&amp;output=embed&amp;hl=en`

  return (
    <>
      <div className='grid gap-2 rounded bg-sky-500/10 p-3'>
        <iframe
          src={mapSrc}
          className='h-100 w-full rounded border-0'
          allowFullScreen
        ></iframe>
        <div className='flex items-center gap-3 rounded bg-white p-5'>
          <div className='col-4'>
            <div className='font-bold'> Yerleşim Merkezi </div>
            <div className='text-xs'>
              {' '}
              Marmaris ve İçmeler sahili arasında yer alan Grand Yazıcı Club
              iyidir...
            </div>
          </div>
          <div className='col-4'>
            <div className='font-bold'> Yerleşim Merkezi </div>
            <div className='text-xs'>
              {' '}
              Marmaris ve İçmeler sahili arasında yer alan Grand Yazıcı Club
              iyidir...
            </div>
          </div>
          <div className='col-4'>
            <div className='font-bold'> Yerleşim Merkezi </div>
            <div className='text-xs'>
              {' '}
              Marmaris ve İçmeler sahili arasında yer alan Grand Yazıcı Club
              iyidir...
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { Location }
