import {
  FlightAdditionalDataSubGroup,
  FlightOptionalServicesDataItem,
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { Collapse, LoadingOverlay, Title, UnstyledButton } from '@mantine/core'
import { BaggageSelect } from '../components/flight/baggage-select'
import { shallowEqual, useDisclosure } from '@mantine/hooks'
import { CheckoutCard } from '@/components/card'
import {
  useCheckoutMethods,
  type BaggageRequestDataModel,
} from '../checkout-query'
import { useRef } from 'react'

type IProps = {
  flightInfos: FlightReservationSummary
  data: FlightAdditionalDataSubGroup[]
  passengers: ProductPassengerApiResponseModel['treeContainer']['childNodes']
  isLoading: boolean
}

interface BaggageCollectData {
  baggageData: FlightOptionalServicesDataItem
  passengerIndex: number
  flightLeg: number
}

const FlightOptionalServices: React.FC<IProps> = ({
  data,
  passengers,
  flightInfos,
  isLoading,
}) => {
  const { baggageMutation } = useCheckoutMethods()
  const selectedBaggages = useRef<BaggageCollectData[]>([])

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

  const baggageServiceArray = data.flatMap((item) =>
    item.subGroups.map((subgroup) =>
      subgroup.items.filter((sub) => sub.code === 'XBAG')
    )
  )

  const handleBaggageSelect = (baggageArgs: {
    baggageData: FlightOptionalServicesDataItem
    passengerIndex: number
    flightLeg: number
  }) => {
    const hasItem = selectedBaggages.current.findIndex(
      (selectedBaggage) =>
        selectedBaggage.flightLeg === baggageArgs.flightLeg &&
        selectedBaggage.passengerIndex === baggageArgs.passengerIndex
    )

    if (hasItem > -1) {
      selectedBaggages.current[hasItem] = baggageArgs
    } else {
      selectedBaggages.current.push(baggageArgs)
    }

    const baggageRequestArray: BaggageRequestDataModel[] =
      selectedBaggages.current.map((selectedBaggage) => {
        const { code, data, uniqueIdentifier } = selectedBaggage.baggageData
        const uniqueIdentifierModified = `SSRItem_${code}_${uniqueIdentifier}_${selectedBaggage.flightLeg}_${selectedBaggage.passengerIndex + 1}`
        const modifiedData = `${data.replaceAll(':', '|')}${uniqueIdentifierModified}`

        return {
          code,
          data: modifiedData,
          releatedObjectId: modifiedData,
          uniqueIdentifier: uniqueIdentifierModified,
        }
      })

    baggageMutation.mutateAsync(baggageRequestArray)
  }

  if (!serviceTypes.length || !serviceTypes.includes('XBAG')) return null

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
        <Collapse in={opened} className='relative'>
          <LoadingOverlay visible={isLoading || baggageMutation.isPending} />
          <div className='grid gap-5'>
            {passengers
              ?.filter((passenger) => passenger.key !== 'Infant') // Infant passengers can not select baggage
              .map((passenger, passengerIndex) => (
                <div key={passenger.orderId} className='grid gap-1'>
                  <Title order={6} fz='h5'>
                    {passenger.orderId}.Yolcu
                  </Title>

                  <div className='grid grid-cols-2 gap-3 md:gap-5'>
                    {baggageServiceArray.map((item, flightIndex) => {
                      const relatedFlightData =
                        flightInfos.flightList[flightIndex]
                      return (
                        item.length > 0 && (
                          <div key={flightIndex}>
                            <BaggageSelect
                              label={
                                relatedFlightData.flightDetail.groupId === 0
                                  ? 'Gidiş Uçuşu'
                                  : 'Dönüş Uçuşu'
                              }
                              data={item}
                              onChange={(item) => {
                                handleBaggageSelect({
                                  baggageData: item,
                                  passengerIndex,
                                  flightLeg: flightIndex,
                                  // passengerIndex
                                })
                              }}
                            />
                          </div>
                        )
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>
        </Collapse>
      </div>
    </CheckoutCard>
  )
}

export { FlightOptionalServices }
