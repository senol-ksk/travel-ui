import {
  FlightAdditionalDataSubGroup,
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { Collapse, Title, UnstyledButton } from '@mantine/core'
import { BaggageSelect } from '../components/flight/baggage-select'
import { useDisclosure } from '@mantine/hooks'
import { CheckoutCard } from '@/components/card'

type IProps = {
  flightInfos: FlightReservationSummary
  data: FlightAdditionalDataSubGroup[]
  passengers: ProductPassengerApiResponseModel['treeContainer']['childNodes']
}

const FlightOptionalServices: React.FC<IProps> = ({
  data,
  passengers,
  flightInfos,
}) => {
  const [opened, { toggle }] = useDisclosure(false)
  const serviceTypes = [
    ...new Set(
      data.flatMap((item) =>
        item.subGroups.flatMap((subgroup) =>
          subgroup.items.map((sub) => sub.code)
        )
      )
    ),
  ]

  if (!serviceTypes.length || !serviceTypes.includes('XBAG')) return null

  const baggageServiceArray = data.flatMap((item) =>
    item.subGroups.map((subgroup) =>
      subgroup.items.filter((sub) => sub.code === 'XBAG')
    )
  )

  return (
    <CheckoutCard>
      <div className='grid gap-5'>
        <UnstyledButton
          className='text-lg font-semibold'
          onClick={toggle}
          type='button'
        >
          İsteğe Bağlı Özel Tercihler
        </UnstyledButton>
        <Collapse in={opened}>
          <div className='grid gap-5'>
            {passengers
              ?.filter((passenger) => passenger.key !== 'Infant') // Infant passengers can not select baggage
              .map((passenger) => (
                <div key={passenger.orderId} className='grid gap-1'>
                  <Title order={6} fz='h5'>
                    {passenger.orderId}.Yolcu
                  </Title>

                  {baggageServiceArray.map((item, itemIndex) => {
                    const relatedFlightData = flightInfos.flightList[itemIndex]
                    return (
                      item.length > 0 && (
                        <div key={itemIndex}>
                          <BaggageSelect
                            label={
                              relatedFlightData.flightDetail.groupId === 0
                                ? 'Gidiş Uçuşu'
                                : 'Dönüş Uçuşu'
                            }
                            data={item}
                            onChange={(item) => {
                              console.log(item)
                            }}
                          />
                        </div>
                      )
                    )
                  })}
                </div>
              ))}
          </div>
        </Collapse>
      </div>
    </CheckoutCard>
  )
}

export { FlightOptionalServices }
