import { Image, Table } from '@mantine/core'
import { HotelDetailInstallmentData } from '@/app/hotel/types'

type IProps = {
  price: number
  installmentData: HotelDetailInstallmentData
}

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
]

const InstallmentTable: React.FC<IProps> = ({ price, installmentData }) => {
  console.log('installmentData', installmentData)
  console.log('price', price)
  const rows = installmentData.items.map((element) => (
    <Table.Tr key={element.bank}>
      <Table.Td>
        <Image src={element.logo} alt={element.bank} />
      </Table.Td>
      {/* <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ))

  return (
    // <Table stickyHeader stickyHeaderOffset={60}>
    //   {price}
    // </Table>

    <Table stickyHeader stickyHeaderOffset={60}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <div className='font-normal'>Tek Çekim</div>
          </Table.Th>
          {installmentData.headers.map((header) => {
            return (
              <Table.Th key={header}>
                <div className='font-normal'>
                  <div>{header} Taksit</div>
                  <div className='text-xs font-semibold'>Toplam</div>
                </div>
              </Table.Th>
            )
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Caption>Scroll page to see sticky thead</Table.Caption>
    </Table>
  )
}

export { InstallmentTable }
