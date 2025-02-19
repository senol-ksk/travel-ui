import { CheckoutCard } from '@/components/card'
import {
  ProductPassengerApiResponseModel,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { NativeSelect, NativeSelectProps, Title } from '@mantine/core'

type IProps = {
  data: ProductPassengerApiResponseModel
}

const TourExtraServices: React.FC<IProps> = ({ data }) => {
  const passengers = data.treeContainer
  const tourExtraData = data.viewBag.AdditionalData
    ?.additionalData as TourExtraOptionsTypes

  const extraDataArr = tourExtraData.subGroups

  return (
    <CheckoutCard>
      <Title order={4}>Ekstra Servisler</Title>

      <Title order={5} pt={10} pb={5}>
        Otobüs Biniş Noktasını Seçiniz
      </Title>
      <div className='grid grid-cols-2 gap-5'>
        {passengers.childNodes.map(
          (passengerChildNode, passengerChildNodeIndex) =>
            passengerChildNode.childNodes.map((subChildNode) => (
              <div key={subChildNode.orderId}>
                {extraDataArr.map((extraData) =>
                  extraData.subGroups.map((extraItems) => {
                    return extraItems.items.map((extraItem) => {
                      const values = extraItem.filters
                        .find((item) => item.key === 'PickUpPointCode')
                        ?.value.split('@') as string[]

                      const labels = extraItem.filters
                        .find((item) => item.key === 'PickUpPointExplain')
                        ?.value.split('@') as string[]

                      const options = values.map((value, valueIndex) => {
                        return {
                          label: labels[valueIndex] ?? '',
                          value: `${value}|${labels[valueIndex] ?? ''}|${labels[valueIndex] ?? ''}`,
                        }
                      })

                      return (
                        <div key={extraData.owner.identifier}>
                          <NativeSelect
                            name={extraItem.code}
                            label={extraItem.description}
                            data={options}
                            defaultValue={options[0].value}
                            onChange={({ currentTarget: { value } }) => {
                              console.log(extraItem, value)
                            }}
                          />
                          <input
                            type='hidden'
                            name='SSR_UniqueIdentifier'
                            value={`SSRItem_${extraItem.code}_${extraItem.uniqueIdentifier}`}
                          />
                          <input
                            type='hidden'
                            name='SSR_ReleatedObjectId'
                            value={passengerChildNodeIndex + 1}
                          />
                          <input
                            type='hidden'
                            name='SSR_Code'
                            value={extraItem.code}
                          />
                        </div>
                      )
                    })
                  })
                )}
              </div>
            ))
        )}
      </div>
    </CheckoutCard>
  )
}

export { TourExtraServices }
