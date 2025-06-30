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

        <div className='mt-3 flex p-3 text-xs md:text-sm'>
          {data?.hotel?.descriptions?.locationInformation?.trim() &&
            data?.hotel?.descriptions?.locationInformation?.trim().length >
              0 && (
              <div className='col-4 p-3'>
                <div className='font-bold'>Yerleşim Merkezi</div>
                <div>{data.hotel.descriptions.locationInformation.trim()}</div>
              </div>
            )}
          {data?.hotel?.nearby_info && data?.hotel?.nearby_info.length > 0 && (
            <div className='col-4 p-3'>
              <div className='font-bold'>Yerleşim Merkezi</div>
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
            <div className='col-4 p-3'>
              <div className='font-bold'>Yerleşim Merkezi</div>
              <div>{data.hotel.nearby}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export { Location }
