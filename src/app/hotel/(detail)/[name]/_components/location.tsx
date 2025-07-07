import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { AspectRatio } from '@mantine/core'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'

interface LocationProps {
  location: [number, number]
  data: HotelDetailResponseHotelInfo | undefined
}

const Location: React.FC<LocationProps> = ({ location, data }) => {
  const hotelInfos = Object.entries(data ?? {})
  if (!location || !hotelInfos) return null

  return (
    <>
      <div className='rounded bg-gray-50 p-3'>
        <AspectRatio ratio={24 / 6} className='overflow-hidden rounded-md'>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={{ lat: location[0], lng: location[1] }}
              defaultZoom={17}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <Marker position={{ lat: location[0], lng: location[1] }} />
            </Map>
          </APIProvider>
        </AspectRatio>
        <div className='my-3 rounded-md bg-white py-3'>
          <div className='gap-3 md:grid md:grid-cols-3'>
            {data?.hotel?.nearby_info &&
              data?.hotel?.nearby_info.length > 0 && (
                <div className='p-3'>
                  <div className='font-bold'>Yakın Çevreyi Tanıyın</div>
                  <div>
                    {data.hotel.nearby_info.map((item, index) => (
                      <div key={index}>
                        {item.name} {item.distance}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {data?.hotel?.nearby && data?.hotel?.nearby.length > 0 && (
              <div className='p-3'>
                <div className='font-bold'>Yerleşim Merkezi</div>
                <div>{data.hotel.nearby}</div>
              </div>
            )}

            {data?.hotel?.descriptions?.locationInformation?.trim() &&
              data?.hotel?.descriptions?.locationInformation?.trim().length >
                0 && (
                <div className='p-3'>
                  <div className='font-bold'>Gezilecek Yerler </div>
                  <div>
                    {data.hotel.descriptions.locationInformation.trim()}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export { Location }
