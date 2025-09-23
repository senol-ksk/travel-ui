'use client'
import { FlightReservationSummary } from '@/types/passengerViewModel'
import { Button, Modal, Spoiler, Title } from '@mantine/core'
import { upperFirst, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { AirlineLogo } from '@/components/airline-logo'
import { IoAirplaneSharp } from 'react-icons/io5'
import { FlightDetailSummary } from './details'
import dayjs from 'dayjs'
import { PackagesDatas } from './packages-datas'
import { ClientDataType } from '@/app/flight/type'
import { RiFlightTakeoffLine } from 'react-icons/ri'

type Iprops = {
  data: FlightReservationSummary
  flightType: 'departure' | 'return'
}
const FlightRules: React.FC<Iprops> = ({ data, flightType }) => {
  const flightData = data
  const airports = flightData.airportList
  const [opened, { open, close }] = useDisclosure(false)

  const filteredFlights = flightData.flightList.filter((flight) => {
    if (flightType === 'departure') {
      return flight.flightDetail.groupId === 0
    } else {
      return flight.flightDetail.groupId === 1
    }
  })
  const firstFlight = filteredFlights[0]
  if (!firstFlight) return null

  return (
    <>
      <Button className='text-blue-500' variant='transparent' onClick={open}>
        <div className='text-sm font-normal'>Uçuş Kuralları</div>
      </Button>
      <Modal
        size={'xl'}
        opened={opened}
        onClose={close}
        title={`${flightType === 'departure' ? 'Gidiş' : 'Dönüş'} Uçuşu Kuralları`}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div className='mb-3 flex items-center gap-2 rounded-md bg-blue-50 py-2 text-sm'>
          {filteredFlights.map((flightItem) => {
            const { flightDetail, flightSegments } = flightItem

            const flightSegmentsFirstItem = flightSegments[0]
            const flightSegmentsLastItem = flightSegments.at(
              -1
            ) as typeof flightSegmentsFirstItem
            const firstDepartureTime = dayjs(
              flightSegmentsFirstItem.departureTime
            )
            const lastArrivalTime = dayjs(flightSegmentsLastItem?.arrivalTime)
            const totalFlightDuration = dayjs.duration(
              lastArrivalTime.diff(firstDepartureTime)
            )

            return (
              <div
                key={flightDetail.key}
                className='grid items-center gap-2 rounded-md p-2 md:flex'
              >
                <Title order={6} className='flex items-center gap-2'>
                  <RiFlightTakeoffLine size={24} className='text-blue-800' />
                  <div>
                    {flightDetail.groupId === 0
                      ? 'Gidiş Uçuşu :'
                      : 'Dönüş Uçuşu :'}
                  </div>
                </Title>

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
        <PackagesDatas
          flightData={flightData}
          selectedFlight={filteredFlights[0]}
        />

        <div className='my-4'>
          <div className='text-sm font-semibold text-blue-800'>
            Önemli Bilgilendirme
          </div>
          <Spoiler
            maxHeight={220}
            hideLabel={
              <div className='px-4 text-sm font-semibold'>
                Daha Az Görüntüle
              </div>
            }
            showLabel={
              <div className='px-4 text-sm font-semibold'>Devamını Göster</div>
            }
          >
            <ul className='list-disc space-y-2 p-4'>
              <li className='text-sm text-gray-700'>
                Uçuşunuzda herhangi bir tarife değişikliği olması halinde, olası
                değişiklikler, havayolu tarafından sms ve/veya mail yoluyla
                bildirilmektedir.Herhangi bir aksaklık yaşanmaması adına, lütfen
                uçuşunuzdan önce, check-in işleminizi yaparak uçuş detaylarınızı
                teyit ediniz.İletişim bilgilerinizin doğruluğundan emin olunuz.
                Hatalı bilgiler nedeniyle, havayolu tarafından güncel uçuş
                bilgilendirmelerinin yolcuya ulaşmaması durumunda, yolcunun
                uçuşu gerçekleştirememesinden, Parafly Travel sorumlu değildir.
              </li>
              <li className='text-sm text-gray-700'>
                Bilet satın alma işlemlerinde, hava yolundan kaynaklanan sistem
                hataları, teknik problemler nedeniyle havayolu firması
                tarafından kesilemeyen düzenlenemeyen biletlerden veya havayolu
                firması tarafından acente sistemlerine eksik ya da hatalı
                yansıtılan fiyatlar vb. nedenlerle oluşabilecek durumlardan
                dolayı acentenin herhangi bir sorumluluğu yoktur.
              </li>
              <li className='text-sm text-gray-700'>
                Havayolları genellikle biletlerin sıralı olarak kullanılmasını
                şart koşar. Gidişi kullanılmayan biletlerin dönüşleri havayolu
                şirketleri tarafından otomatik olarak iptal edilir.
              </li>
              <li className='text-sm text-gray-700'>
                Değişiklik işlemlerinde mevcut sınıftan daha yüksek bir sınıfa
                değişiklik yapılıyorsa, sınıf farkı ücreti alınır.
              </li>
              <li className='text-sm text-gray-700'>
                İptal işlemlerinde havayolu şirketinin iptal politikaları
                geçerlidir.
              </li>
              <li className='text-sm text-gray-700'>
                Bilet değişiklikleri ve iptalleri için aldığınız kurum ile
                iletişime geçin.
              </li>
              <li className='text-sm text-gray-700'>
                Yapılan bir rezervasyon bir başkasına devredilemez, isim
                değişikliği yapılamaz.
              </li>
              <li className='text-sm text-gray-700'>
                Satın alma işleminizden sonra, 7-10 gün içerisinde, üyelik
                bilgileriniz alanında yer alan rezervasyonlarım sekmesindeki
                detay kısmından fatura bilgilerinize ulaşabilirsiniz
              </li>
              <li className='text-sm text-gray-700'>
                Seyahat edecek tüm yolcuların kontuarda resimli bir kimlik
                belgesi (nüfus cüzdanı, ehliyet, pasaport veya , indirime tabi
                ise öğrenci belgesi) ibraz etmesi gereklidir.
              </li>
              <li className='text-sm text-gray-700'>
                Herhangi bir gecikme yaşamamak adına uçuştan 180 dakika önce
                havalimanında olarak bagaj kontrolü ve check-in işlemlerinizi
                tamamlamanız tavsiye edilir.
              </li>
              <li className='text-sm text-gray-700'>
                Bilet ve bagaj kontrolü için tarifeli kalkış saatinden 120
                dakika önce check in işleminizi tamamlayınız. Yoğun sezonlarda
                önerilen saatten daha önce hava alanında bulunmaya dikkat
                ediniz.
              </li>
              <li className='text-sm text-gray-700'>
                Bagaj kuralları havayolu şirketine göre değişiklik gösterebilir.
              </li>
            </ul>
          </Spoiler>
        </div>
      </Modal>
    </>
  )
}

export { FlightRules }
