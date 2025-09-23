import { AiFillInfoCircle } from 'react-icons/ai'
import { Alert, Image, Table } from '@mantine/core'
import { HiExclamationCircle } from 'react-icons/hi2'
import { ParafParaPaymentResponse } from '../types'
import { formatCurrency } from '@/libs/util'
import NumberFlow from '@number-flow/react'

type IProps = {
  data: ParafParaPaymentResponse
}

export const ParafParaView: React.FC<IProps> = ({ data }) => {
  const multiplier = data.multiplier
  const remainingFund = data.remainingFund
  const total = data.total

  const usedToBeBonus = data.calculatedBonus.bonus
  const usedToBeAdvance = data.calculatedBonus.advance
  const totalUsedToParafPrice = usedToBeBonus + usedToBeAdvance
  const tlUsedToBeBonus = usedToBeBonus * multiplier
  const tlUsedToBeAdvance = usedToBeAdvance * multiplier
  const tlTotalUsedToParafPrice =
    tlUsedToBeBonus + tlUsedToBeAdvance > remainingFund
      ? remainingFund
      : tlUsedToBeBonus + tlUsedToBeAdvance
  const parafPrice =
    totalUsedToParafPrice > total / multiplier
      ? totalUsedToParafPrice
      : total / multiplier
  const parafPriceToTL =
    tlTotalUsedToParafPrice > total ? tlTotalUsedToParafPrice : total
  const ccTotal = data.calculatedBonus.remaining

  return (
    <div className='grid gap-3 md:gap-5'>
      <div className='grid gap-3 md:grid-cols-3'>
        <div className='col-span-2'>
          <div className='rounded-md border'>
            <Table
              fz={'md'}
              verticalSpacing={'sm'}
              horizontalSpacing={'lg'}
              lh={'xs'}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td w={300}>Toplam ParafParanız</Table.Td>
                  <Table.Td align='right' fz={'lg'} c={'blue'} fw={600}>
                    {data.bonus}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Avans ParafParanız</Table.Td>
                  <Table.Td align='right' fz={'lg'} c={'blue'} fw={600}>
                    {data.advance.toFixed(2)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    Paraf Premium&apos;dan karşılanan katlı parafpara limitiniz
                  </Table.Td>
                  <Table.Td align='right' fz={'lg'} c={'blue'} fw={600}>
                    {formatCurrency(data.remainingFund)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <div>
            <Image
              src='https://paraflystatic.mncdn.com/7/Content/img/paraf_premium.png'
              alt='Paraf Kart'
              maw={105}
            />
          </div>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-3 rounded-2xl bg-blue-100 p-3 text-sm text-blue-900 md:p-5'>
          <div>
            <AiFillInfoCircle size={20} />
          </div>
          <div>
            Alacağınız ürünlerde kendi ParafParanız/avans parafparanız dışında
            kalan katsayılı tutar bir takvim yılı için 50.000 TL’ ye kadar Paraf
            Premium’ dan karşılanır. Söz konusu limitiniz dahilinde
            Parafparalarınızı katlı olarak kullanabilirsiniz. Limitinizin
            bitmesi halinde ParafParalarınızı katlı /değerli olarak
            kullanamazsınız.
          </div>
        </div>
      </div>
      <div className='flex items-center gap-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800 md:p-5'>
        <div>
          <HiExclamationCircle size={20} />
        </div>
        <div>
          Parafly&apos;dan karşılanan katlı parafpara limitiniz işlem tutarını
          karşılamamaktadır. Aşan tutar kredi kartınızdan tahsil edilecektir.
        </div>
      </div>
      <div>
        <Table
          verticalSpacing={'md'}
          horizontalSpacing={'md'}
          fz={{
            xs: 'sm',
            md: 'md',
          }}
          withTableBorder
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>İşlem</Table.Th>
              <Table.Th>ParafPara</Table.Th>
              <Table.Th>TL Değeri</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Kullanılacak ParafPara</Table.Td>
              <Table.Td>
                {usedToBeBonus}x{multiplier}
              </Table.Td>
              <Table.Td>{formatCurrency(tlUsedToBeBonus)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Kullanılacak Avans ParafPara</Table.Td>
              <Table.Td>
                {usedToBeAdvance}x{multiplier}
              </Table.Td>
              <Table.Td>{formatCurrency(tlUsedToBeAdvance)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Toplam ParafPara</Table.Td>
              <Table.Td>
                {parseFloat('' + totalUsedToParafPrice).toFixed(2)}x{multiplier}
              </Table.Td>
              <Table.Td>{formatCurrency(tlTotalUsedToParafPrice)}</Table.Td>
            </Table.Tr>
            <Table.Tr bg={'blue.5'} c={'white'}>
              <Table.Td colSpan={2}>Kredi kartınızdan Çekilecek tutar</Table.Td>
              <Table.Td>{formatCurrency(ccTotal)}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <Alert
        title='ParafPara Hakkında Bilgilendirme'
        icon={<AiFillInfoCircle size={20} />}
      >
        <div className='text-blue-900'>
          Almak istediğiniz <strong>{formatCurrency(total)}</strong>‘lik ürün
          karşılığından <strong>{usedToBeBonus}</strong> ParafPara tutarında
          ParafPara,
          <strong> {usedToBeAdvance}</strong> ParafPara tutarında Avans
          ParafPara kullanacaksınız. Kullanacağınız Avans ParafPara’ larınızı 1
          yıl içinde yapacağınız alışverişlerinizden kazanacağınız
          ParafParalarınız ile kapatabilirsiniz. Bir yıl içerisinde, kartınızın
          kullanıma kapatılması durumunda veya çekilen Avans ParafPara’nın
          kapatılmaması durumunda kalan Avans ParafPara tutarı yararlandığınız
          katsayı ile çarpılarak ekstrenize borç yansıtılacaktır. İşleme devam
          etmeniz halinde ParafPara / Avans ParafPara kullanırken ParafPara
          /Avans ParafPara kullanım kurallarını bildiğinizi kabul, beyan ve
          taahhüt edersiniz.
        </div>
      </Alert>
      <Alert icon={<AiFillInfoCircle size={20} />}>
        <div className='text-blue-900'>
          ParafPara ile yapılan işlemlerde banka tarafından gönderilen 3D şifre
          bilgilendirme sms’inde satın almış olduğunuz seyahat ürününün
          ParafPara karşılığı, TL olarak gösterilmektedir.
        </div>
      </Alert>
    </div>
  )
}
