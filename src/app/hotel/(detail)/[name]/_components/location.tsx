import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { AspectRatio, Modal } from '@mantine/core'

interface LocationProps {
  location: [number, number]
}

const Location: React.FC<LocationProps> = ({ location }) => {
  return (
    <>
      <div className='bg-sky-50 p-3'>
        <AspectRatio ratio={24 / 6} style={{ width: '100%', height: 'auto' }}>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={{ lat: location[0], lng: location[1] }}
              style={{ width: '100%', height: '100%' }}
              defaultZoom={17}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <Marker position={{ lat: location[0], lng: location[1] }} />
            </Map>
          </APIProvider>
        </AspectRatio>
        <div className='mt-3 flex p-3 text-xs md:text-sm'>
          <div className='col-4'>
            <div className='font-bold'>Yerleşim Merkezi</div>
            <div>
              Merkeze 10 km uzaklıkta bir alanda çevrelenmiş orman içinde{' '}
            </div>
          </div>
          <div className='col-4'>
            <div className='font-bold'>Yerleşim Merkezi</div>
            <div>
              Merkeze 10 km uzaklıkta bir alanda çevrelenmiş orman içinde{' '}
            </div>
          </div>
          <div className='col-4'>
            <div className='font-bold'>Yerleşim Merkezi</div>
            <div>
              Merkeze 10 km uzaklıkta bir alanda çevrelenmiş orman içinde{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { Location }
