import { AspectRatio, Modal } from '@mantine/core'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { HotelSearchResultHotelInfo } from '../../types'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo | undefined
}

const HotelMap: React.FC<IProps> = ({ hotelInfo }) => {
  const positions = {
    lat: hotelInfo?.location[0] ?? 0,
    lng: hotelInfo?.location[1] ?? 0,
  }

  return (
    <div>
      <AspectRatio>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={positions}
            style={{ width: '100%', height: '100%' }}
            defaultZoom={17}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            <Marker position={positions} />
          </Map>
        </APIProvider>
      </AspectRatio>
    </div>
  )
}

export { HotelMap }
