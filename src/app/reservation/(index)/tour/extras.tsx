import { CheckoutCard } from '@/components/card'
import {
  ProductPassengerApiResponseModel,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { Title } from '@mantine/core'
import { PickUpPointSelect } from './pickup-point'
import { VisaReason } from './visa-reason'
import { BedType } from './bed-type'

type IProps = {
  data: ProductPassengerApiResponseModel
}

const TourExtraServices: React.FC<IProps> = ({ data }) => {
  const passengers = data.treeContainer
  const tourExtraData = data.viewBag.AdditionalData
    ?.additionalData as TourExtraOptionsTypes

  const extraDataArr = tourExtraData.subGroups
  const extraDataIterate = extraDataArr.flatMap((innerExtraData) =>
    innerExtraData.subGroups.flatMap((item) =>
      item.items.flatMap((item2) => item2)
    )
  )

  return (
    <CheckoutCard>
      <Title order={4}>Ekstra Servisler</Title>

      {extraDataIterate.map((item) => {
        const extraDataType = item.code

        return (
          <div key={item.uniqueIdentifier}>
            {
              <Title order={5} pt={20} pb={5}>
                <span>
                  {extraDataType === 'BedType' && 'Yatak Secimi'}
                  {extraDataType === 'VisaReason' &&
                    'Vize Almama Nedenini Seçiniz'}
                  {extraDataType === 'PickUpPoint' &&
                    'Otobüs Biniş Noktasını Seçiniz'}
                </span>
              </Title>
            }
            {passengers.childNodes.map((passenger, passengerChildNodeIndex) => {
              return (
                <div key={passenger.orderId} className='grid grid-cols-2 gap-5'>
                  {passenger.childNodes.map((childNode) => (
                    <div key={childNode.orderId}>
                      {/* {extraDataType} */}
                      {extraDataType === 'PickUpPoint' && (
                        <PickUpPointSelect data={item} />
                      )}
                      {extraDataType === 'VisaReason' && (
                        <VisaReason data={item} />
                      )}
                      {extraDataType === 'BedType' && <BedType data={item} />}

                      <input
                        type='hidden'
                        name='SSR_UniqueIdentifier'
                        value={`SSRItem_${item.code}_${item.uniqueIdentifier}`}
                      />
                      <input
                        type='hidden'
                        name='SSR_ReleatedObjectId'
                        value={passengerChildNodeIndex + 1}
                      />
                      <input type='hidden' name='SSR_Code' value={item.code} />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}
    </CheckoutCard>
  )
}

export { TourExtraServices }
