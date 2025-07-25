'use client'
import { FlightReservationSummary } from '@/types/passengerViewModel'
import { Button, Modal, Title } from '@mantine/core'
import { upperFirst, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { AirlineLogo } from '@/components/airline-logo'
import { IoAirplaneSharp } from 'react-icons/io5'
import { FlightTransferSummary } from './transfer'
import dayjs from 'dayjs'

type Iprops = {
  data: FlightReservationSummary
}
const FlightRules: React.FC<Iprops> = ({ data }) => {
  const flightData = data
  const airlines = flightData.airlineList
  const airports = flightData.airportList
  const fareInfo = flightData.flightFareInfo
  const { passengerPrices } = fareInfo

  const [opened, { open, close }] = useDisclosure(false)
  const firstFlight = flightData.flightList[0]
  const { flightDetail, flightSegments } = firstFlight
  const flightSegmentsFirstItem = flightSegments[0]
  const flightSegmentsLastItem = flightSegments.at(-1)!
  const hasTransfer = flightSegments.length > 1

  const firstDepartureTime = dayjs(flightSegmentsFirstItem.departureTime)
  const lastArrivalTime = dayjs(flightSegmentsLastItem.arrivalTime)
  const totalFlightDuration = dayjs.duration(
    lastArrivalTime.diff(firstDepartureTime)
  )

  return (
    <>
      <Button className='text-blue-500' variant='transparent' onClick={open}>
        <div className='text-sm font-normal'>Uçuş Kuralları</div>
      </Button>
      <Modal
        size={'xl'}
        opened={opened}
        onClose={close}
        title={<div className='text-xl'>Uçuş Kuralları</div>}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div className='mb-3 flex items-center justify-around gap-2 border p-2'>
          {flightData.flightList
            .sort((a, b) => a.flightDetail.groupId - b.flightDetail.groupId)
            .map((flightItem) => {
              const { flightDetail, flightSegments } = flightItem

              const flightSegmentsFirstItem = flightSegments[0]
              const flightSegmentsLastItem = flightSegments.at(
                -1
              ) as typeof flightSegmentsFirstItem
              const hasTransfer = flightSegments.length > 1
              const firstDepartureTime = dayjs(
                flightSegmentsFirstItem.departureTime
              )
              const lastArrivalTime = dayjs(flightSegmentsLastItem?.arrivalTime)
              const totalFlightDuration = dayjs.duration(
                lastArrivalTime.diff(firstDepartureTime)
              )

              return (
                <div key={flightDetail.key} className='grid gap-1'>
                  <div className='flex justify-between'>
                    <Title order={5}>
                      {flightDetail.groupId === 0 ? 'Gidiş' : 'Dönüş'}
                    </Title>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div>
                      {airports[flightSegmentsFirstItem.origin.code].city} (
                      {flightSegmentsFirstItem.origin.code})
                    </div>
                    <div>
                      <IoAirplaneSharp />
                    </div>
                    <div>
                      {airports[flightSegmentsLastItem?.destination.code].city}(
                      {flightSegmentsLastItem?.destination.code})
                    </div>
                  </div>
                  <div>
                    {lastArrivalTime.format('DD MMMM YYYY dddd')} (
                    {totalFlightDuration.format('H')}s{' '}
                    {totalFlightDuration.format('mm')}dk)
                  </div>
                </div>
              )
            })}
        </div>
        <div>
          <div className='text-lg font-semibold'>Genel Kurallar</div>
          <ul className='list-disc p-3'>
            <li>
              Havayolları genellikle biletlerin sıralı olarak kullanılmasını
              şart koşar. Bu nedenle gidişi kullanılmayan biletlerin dönüşleri
              havayolu şirketleri tarafından otomatik olarak iptal edilir.
            </li>
            <li>
              Herhangi bir gecikme yaşamamak adına uçuştan 180 dakika önce
              havalimanında olarak bagaj kontrolü ve check-in işlemlerinizi
              tamamlamanız tavsiye edilir.
            </li>
            <li>
              Değişiklik işlemlerinde mevcut sınıftan daha yüksek bir sınıfa
              değişiklik yapılıyorsa, sınıf ve/veya paket farkı ücreti alınır.
            </li>
          </ul>
        </div>
      </Modal>
    </>
  )
}

export { FlightRules }
