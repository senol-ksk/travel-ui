import { CarSummaryResponse } from '@/app/reservation/types'
import { CheckoutCard } from '@/components/card'
import { Column, Img, Link, Row } from '@react-email/components'
import dayjs from 'dayjs'

type IProps = {
  data: CarSummaryResponse
}

export const CarSummary: React.FC<IProps> = ({ data }) => {
  const car = data.detailResponse.items[0].carDetail
  const carExtraOptions = data.detailResponse.items[0].carExtraOption
  const carInsurances = data.detailResponse.items[0].carInsurances
  const pickup = data.pickupStation
  const drop = data.returnStation
  const dayCount = dayjs(car.returnDate).diff(dayjs(car.pickupDate), 'day')
  const hasSelectedExtras =
    carExtraOptions?.some((option) => option.selected) ||
    carInsurances?.some((insurance) => insurance.selected)
  function getFuelLabel(fuelType?: number) {
    if (fuelType === 1) return 'Benzin'
    if (fuelType === 2) return 'Dizel'
    if (fuelType === 3) return 'LPG'
    return '—'
  }

  return (
    <div className='grid gap-3'>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          height={200}
          className='mb-3'
          src='https://ykmturizm.mncdn.com/11/Files/638932871618301570.png'
        />
      </Link>
      <CheckoutCard title={'Araç Bilgisi'}>
        <div className='grid gap-3 md:grid-cols-6'>
          <div className='md:col-span-2'>
            <Img src={car.imageUrl} alt={car.name} width={200} />
          </div>
          <div className='md:col-span-4'>
            <div>
              <strong className='text-lg'>
                {car.brand ? `${car.brand} ` : ''}
                {car.name}, {car.carGroupName}
              </strong>
            </div>
            <div className='mt-3 space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='w-20 text-sm font-medium'>Özellikler</div>
                <div>:</div>
                <div className='text-sm text-gray-700'>
                  {car.airConditioning ? 'Klima Var' : 'Klima Yok'},{' '}
                  {car.automaticTransmission
                    ? 'Otomatik Vites'
                    : 'Manuel Vites'}
                  , {car.seatCount} koltuk , {getFuelLabel(car.fuelType)}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-20 text-sm font-medium'>Süre</div>
                <div>:</div>
                <div className='text-sm text-gray-700'>{dayCount} Gün</div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-20 text-sm font-medium'>Firma</div>
                <div>:</div>
                <div className='text-sm text-gray-700'>{car.vendorName}</div>
              </div>
            </div>
          </div>
        </div>
      </CheckoutCard>

      <CheckoutCard title={'Alış Yeri ve Tarihi'}>
        <div className='space-y-2'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Tarih</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm text-gray-700'>
              {dayjs(car.pickupDate).format('DD MMMM YYYY, dddd')} Saat:{' '}
              {dayjs(car.pickupDate).format('HH:mm')}
            </div>
          </div>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Adres</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm break-words text-gray-700'>
              {pickup.location.name}
            </div>
          </div>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Adres Detay</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm break-words text-gray-700'>
              {pickup.address.addressName}
            </div>
          </div>
          {pickup.phoneNumbers[0].number && (
            <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
              <div className='w-24 text-sm font-medium'>Ofis Telefonu</div>
              <div className='hidden sm:block'>:</div>
              <div className='text-sm break-words text-gray-700'>
                {pickup.phoneNumbers[0].number}
              </div>
            </div>
          )}
        </div>
      </CheckoutCard>

      <CheckoutCard title={'Bırakış Yeri ve Tarihi'}>
        <div className='space-y-2'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Tarih</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm text-gray-700'>
              {dayjs(car.returnDate).format('DD MMMM YYYY, dddd')} Saat:{' '}
              {dayjs(car.returnDate).format('HH:mm')}
            </div>
          </div>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Adres</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm break-words text-gray-700'>
              {drop.location.name}
            </div>
          </div>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <div className='w-24 text-sm font-medium'>Adres Detay</div>
            <div className='hidden sm:block'>:</div>
            <div className='text-sm break-words text-gray-700'>
              {drop.address.addressName}
            </div>
          </div>
          {drop.phoneNumbers[0].number && (
            <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
              <div className='w-24 text-sm font-medium'>Ofis Telefonu</div>
              <div className='hidden sm:block'>:</div>
              <div className='text-sm break-words text-gray-700'>
                {drop.phoneNumbers[0]?.number || ''}
              </div>
            </div>
          )}
        </div>
      </CheckoutCard>
      {hasSelectedExtras && (
        <CheckoutCard title={'Ekstra Seçenekler'}>
          <div className='space-y-3'>
            {carInsurances
              ?.filter((insurance) => insurance.selected)
              .map((insurance, index) => (
                <div
                  key={`insurance-${index}`}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                >
                  <div className='flex-1'>
                    <div className='text-sm font-medium'>
                      {insurance.description}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {insurance.code}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>
                      {insurance.isFree
                        ? 'Ücretsiz'
                        : `${insurance.totalPrice.value} ${insurance.totalPrice.currency}`}
                    </div>
                  </div>
                </div>
              ))}
            {carExtraOptions
              ?.filter((option) => option.selected)
              .map((option, index) => (
                <div
                  key={`extra-${index}`}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                >
                  <div className='flex-1'>
                    <div className='text-sm font-medium'>{option.name}</div>
                    <div className='text-sm text-gray-600'>{option.code}</div>
                    {option.maxDay > 0 && (
                      <div className='text-sm text-gray-600'>
                        Maksimum {option.maxDay} gün
                      </div>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>
                      {option.isFree
                        ? 'Ücretsiz'
                        : `${option.totalPrice.value} ${option.totalPrice.currency}`}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CheckoutCard>
      )}

      <CheckoutCard title={'Kiralama Koşulları'}>
        <div className='space-y-4'>
          <div>
            <div className='text-sm font-bold'>Sürücü Yaşı</div>
            <div className='mt-1 text-sm'>
              {car.minDriverAge} yaşından büyük sürücü
            </div>
          </div>
          <div>
            <div className='text-sm font-bold'>Depozito</div>
            <div className='mt-1 text-sm'>
              {car.deposit.value} TL <br />
              Yolculuğunuzda HGS-KGS gibi ödemeleri güvence altına almak
              amacıyla kredi kartınızda bu tutar bloke edilir. Aracı teslim
              etmenizin ardından bloke işlemi kaldırılır.
            </div>
          </div>
          <div>
            <div className='text-sm font-bold'>Ehliyet Süresi</div>
            <div className='mt-1 text-sm'>
              En az {car.licenseYear} yıllık ehliyet
            </div>
          </div>
          {car.addKmRate.value > 0 && (
            <div>
              <div className='text-sm font-bold'>Ekstra Km</div>
              <div className='mt-1 text-sm'>
                Aracınızın kilometre limitini aştığında her kilometre için bu
                tutar {car.addKmRate.value} TL ödenir.
              </div>
            </div>
          )}
        </div>
      </CheckoutCard>
    </div>
  )
}
