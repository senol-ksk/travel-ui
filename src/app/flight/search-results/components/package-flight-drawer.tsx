import { Button, rem, Stack } from '@mantine/core'
import { MdCheck } from 'react-icons/md'
import { IoChevronForwardOutline, IoClose } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa6'

import clsx from 'clsx'
import { useState } from 'react'
import type {
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
  flightDetails: FlightDetail
}

type IProps = {
  data: {
    packages: SelectedPackageStateProps[] | undefined | null
    flights: ClientDataType[]
    providerName?: string
  }
  onSelect: (selectedPackage: SelectedPackageStateProps) => void
}

const PackageFlightDrawer: React.FC<IProps> = ({ data, onSelect }) => {
  const selectedFlightItemPackages = data
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(0)

  // base price defined
  const mainPricePackage = data.flights.at(-1)?.fareInfo.totalPrice.value ?? 0

  const handlePackageSelect = (index: number) => {
    setSelectedPackageIndex(index)
  }

  const handleContinue = () => {
    if (data.packages && data.packages[selectedPackageIndex]) {
      onSelect(data.packages[selectedPackageIndex])
    }
  }
  console.log(selectedFlightItemPackages)

  return (
    <div className='space-y-4'>
      <div className='sm:grid sm:grid-flow-col sm:grid-rows-1 sm:gap-3'>
        {selectedFlightItemPackages?.packages?.map((selectedPackage, index) => {
          const isSelected = index === selectedPackageIndex
          const packagePrice =
            selectedPackage.flightFareInfo.totalPrice.value - mainPricePackage

          const brandCode =
            selectedPackage.flightDetailSegment.freeVolatileData.BrandCode
          const bookingCode = selectedPackage.flightDetailSegment.bookingCode
          const brandName =
            selectedPackage.flightDetailSegment.freeVolatileData.BrandName
          const operatingAirline =
            selectedPackage.flightDetailSegment.operatingAirline.code
          const baggageAllowance =
            selectedPackage.flightDetailSegment.baggageAllowance
          const isDomestic = selectedPackage.flightDetails.isDomestic
          return (
            <div
              key={selectedPackage.flightFareInfo.key}
              className={clsx(
                `relative my-10 flex transform-gpu cursor-pointer flex-col items-start gap-2 rounded-lg p-4 shadow-xl transition-all duration-400 ease-out hover:scale-102 md:gap-1`,
                isSelected ? `border-4 border-blue-800 bg-blue-50` : 'border-4'
              )}
              role='button'
              onClick={() => handlePackageSelect(index)}
            >
              <div className='absolute top-0 right-0'>
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-tr-md rounded-bl-md',
                    isSelected
                      ? 'bg-blue-800 text-white'
                      : 'border-b-4 border-l-4'
                  )}
                >
                  {isSelected && <FaCheck size={24} />}
                </div>
              </div>
              <div className='mb-2 grid w-full cursor-pointer justify-between gap-1'>
                <div className='text-2xl font-bold'>
                  +
                  {new Intl.NumberFormat('tr', {
                    currency: 'TRY',
                  }).format(packagePrice)}{' '}
                  TL
                </div>
                <div className='text-lg font-bold uppercase'>
                  {(() => {
                    switch (brandName) {
                      case 'SUPER_ECO':
                        return 'Light'
                      case 'ECO':
                        return 'Süper Eko'
                      case 'ADVANTAGE':
                        return 'Avantaj'
                      case 'EXTRA':
                        return 'Comfort Flex'
                      default:
                        return brandName
                    }
                  })()}
                </div>
              </div>
              <Stack gap={rem(7)} className='mb-5 text-sm'>
                {/* Turkish Airlines - Business Fly */}
                {operatingAirline === 'TK' &&
                  !(brandCode === 'BF' || brandCode === 'BL') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 X 8 Kg
                      El Bagajı
                    </div>
                  )}
                {/* AJet Airlines */}
                {operatingAirline === 'VF' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 X 8 Kg
                      El Bagajı
                    </div>
                  </>
                )}
                {brandName !== 'SUPER_ECO' && operatingAirline === 'PC' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                    Bagajı (55x40x20)
                  </div>
                )}
                {/* KLM & Air France - El Bagajı */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'LIGHT' ||
                    brandCode === 'STANDARD' ||
                    brandCode === 'FLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 x El
                      bagajı (55 x 35 x 25 cm)*
                    </div>
                  )}
                {/* KLM & Air France - Business El Bagajı */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'BIZSTAND' || brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />2 x El
                      bagajı (55 x 35 x 25 cm)
                    </div>
                  )}
                {baggageAllowance.maxWeight.value > 0 &&
                  data.providerName === 'SabreATPCO' &&
                  (operatingAirline === 'AF' ||
                    operatingAirline === 'KL' ||
                    operatingAirline === 'BA' ||
                    operatingAirline === 'EY' ||
                    operatingAirline === 'EK') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      {baggageAllowance.piece.pieceCount > 0 && (
                        <div>{baggageAllowance.piece.pieceCount} x</div>
                      )}
                      {baggageAllowance.maxWeight.value} Kg Kabin Bagaj Hakkı
                    </div>
                  )}{' '}
                {baggageAllowance.maxWeight.value > 0 &&
                  data.providerName !== 'SabreATPCO' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      {baggageAllowance.piece.pieceCount > 0 && (
                        <div>{baggageAllowance.piece.pieceCount} x</div>
                      )}
                      {baggageAllowance.maxWeight.value} Kg Kabin Bagaj Hakkı
                    </div>
                  )}{' '}
                {!isDomestic && (
                  <>
                    {operatingAirline === 'TK' && (
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        İkram Servisi
                      </div>
                    )}
                    {operatingAirline === 'TK' && brandCode === 'CL' && (
                      <div className='flex items-center gap-2 text-red-800'>
                        <IoClose size={20} className='text-red-800' />
                        Değişiklik yapılamaz &amp; İade edilemez
                      </div>
                    )}
                    {operatingAirline === 'TK' &&
                      (brandCode === 'LG' || brandCode === 'GN') && (
                        <>
                          <div className='flex items-center gap-2'>
                            <MdCheck size={18} className='text-green-800' />
                            Ücretli Değişiklik
                          </div>
                          <div className='flex items-center gap-2'>
                            <MdCheck size={18} className='text-green-800' />
                            %25 Ekstra Ekstra Bonus Mil
                          </div>
                        </>
                      )}
                    {operatingAirline === 'TK' && brandCode === 'FL' && (
                      <div className='flex items-center gap-2 text-green-800'>
                        <MdCheck size={18} className='text-green-800' />
                        Cezasız Değişiklik
                      </div>
                    )}
                    {operatingAirline === 'PC' && (
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />1 Adet
                        Koltuk Altına Sığacak Çanta (40x30x15)
                      </div>
                    )}
                    {operatingAirline === 'VF' && brandName === 'ECOJET' && (
                      <>
                        <div className='flex items-center gap-2'>
                          <MdCheck size={18} className='text-green-800' />
                          Ücretli Değişiklik
                        </div>
                        <div className='flex items-center gap-2 text-red-800'>
                          <IoClose size={20} className='text-red-800' />
                          İade Edilemez
                        </div>
                      </>
                    )}
                  </>
                )}
                {selectedPackage?.flightDetailSegment && (
                  <>
                    {((bookingCode !== 'EF' && bookingCode === 'XF') ||
                      bookingCode === 'PF') && (
                      <>
                        <div className='flex items-center gap-2'>
                          <MdCheck size={18} className='text-green-800' />
                          İkram Hizmeti
                        </div>
                        <div className='flex items-center gap-2'>
                          <MdCheck size={18} className='text-green-800' />
                          24 saat içinde kesintisiz iade
                        </div>
                      </>
                    )}
                  </>
                )}
                {bookingCode === 'PF' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz ön sıra koltuk seçimi
                    </div>
                  </>
                )}
                {bookingCode === 'PF' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    250 Ekstra Bonus Mil
                  </div>
                )}
                {(brandName === 'EXTRA' || brandName === 'ADVANTAGE') && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Sandviç İkramı
                    </div>
                  </>
                )}
                {selectedPackage?.flightDetailSegment && (
                  <>
                    {bookingCode === 'PF' && (
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Kesintisiz iade (son 12 saate kadar)
                      </div>
                    )}
                  </>
                )}
                {operatingAirline === 'VF' &&
                  (brandName === 'PREMIUM' || brandName === 'FLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Sandviç İkramı
                    </div>
                  )}
                {bookingCode === 'PF' ||
                  (bookingCode === 'XF' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart koltuk seçimi
                    </div>
                  ))}
                {selectedPackage.flightDetails.freeVolatileData
                  .AllSeatSelection && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Dilediğiniz Koltuk Seçimi
                  </div>
                )}
                {bookingCode === 'XF' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    150 Ekstra Bonus Mil
                  </div>
                )}
                {selectedPackage.flightDetails.freeVolatileData
                  .StandartSeatSelection && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart Koltuk Seçimi
                  </div>
                )}
                {bookingCode === 'EF' ||
                  (bookingCode === 'XF' && (
                    <div className={'flex items-center gap-1 text-red-800'}>
                      <IoClose size={20} className='text-red-800' />
                      Cezalı Değişiklik
                    </div>
                  ))}
                {brandName === 'FLEX' &&
                  selectedPackage.flightDetailSegment.freeVolatileData.Owner ===
                    'VF' && (
                    <>
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Kesintili İade Hakkı
                      </div>
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Ücretli Değişiklik
                      </div>
                    </>
                  )}
                {brandName === 'PREMIUM' &&
                  selectedPackage.flightDetailSegment.freeVolatileData.Owner ===
                    'VF' && (
                    <>
                      <div className={'grid items-center text-green-800'}>
                        <div className='flex items-center gap-2'>
                          <MdCheck size={18} className='text-green-800' />
                          Ücretsiz Değişiklik{' '}
                        </div>
                      </div>
                    </>
                  )}
                {selectedPackage.flightDetails.freeVolatileData
                  .FlexibleReturnChangeRight && (
                  <div className='grid items-center text-green-800'>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Esnek İade/Değişiklik Hakkı
                    </div>
                    {/* <span className='px-5 text-xs text-gray-600'>
                      (Uçuşa 1 saat kalana kadar)
                    </span> */}
                  </div>
                )}
                {bookingCode === 'PF' && (
                  <div className='flex items-center gap-1 text-green-800'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız Değişiklik
                  </div>
                )}
                {brandName === 'BASIC' && operatingAirline !== 'BA' && (
                  <div className='flex items-center gap-2 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik yapılamaz &amp; İade edilemez
                  </div>
                )}
                {operatingAirline === 'AA' && bookingCode !== 'AAAT-FBUSFL' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    2x32 Kg Bagaj Hakkı
                  </div>
                )}
                {operatingAirline === 'AA' && bookingCode === 'AAAT-FFIRFL' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    3x32 Kg Bagaj Hakkı
                  </div>
                )}
                {operatingAirline === 'AA' &&
                  (bookingCode === 'AAAT-PEC' ||
                    bookingCode === 'AAAT-PECFL') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      2x23 Kg Bagaj Hakkı
                    </div>
                  )}
                {operatingAirline === 'UA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />1 X 8 kg El
                    Bagajı
                  </div>
                )}
                {operatingAirline === 'QR' ||
                  (operatingAirline === 'SQ' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 parça X
                      7 kg El Bagajı
                    </div>
                  ))}
                {operatingAirline === 'LO' ||
                  (operatingAirline === 'AA' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Kabin Bagajı
                    </div>
                  ))}
                {operatingAirline === 'LO' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretli Koltuk Seçimi
                  </div>
                )}
                {operatingAirline === 'UA' ||
                  operatingAirline === 'AA' ||
                  (operatingAirline === 'LO' &&
                    (bookingCode === 'SAVER-PCID' ||
                      bookingCode === 'STANDARD-PCID') && (
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Ekstra Mil Kazancı
                      </div>
                    ))}
                {operatingAirline === 'SQ' && bookingCode === 'FF41-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    50 Ekstra Mil
                  </div>
                )}
                {operatingAirline === 'SQ' && bookingCode === 'FF21-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek Değişim (Uçuşa kadar)
                  </div>
                )}
                {operatingAirline === 'SQ' && bookingCode === 'FF21-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    %100 Ekstra Mil Kazancı
                  </div>
                )}
                {operatingAirline === 'SQ' && bookingCode === 'FF01-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    %125 Ekstra Mil Kazancı
                  </div>
                )}
                {operatingAirline === 'LO' && bookingCode === 'FLEX-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    %150 Ekstra Mil Kazancı
                  </div>
                )}
                {operatingAirline === 'LO' && bookingCode === 'FLEX-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek Değişim (Uçuşa kadar)
                  </div>
                )}
                {operatingAirline === 'SQ' && bookingCode === 'FF21-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz Koltuk Seçimi
                  </div>
                )}
                {operatingAirline === 'SQ' && bookingCode === 'FF31-PCID' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    75 Ekstra Mil
                  </div>
                )}
                {operatingAirline === 'QR' &&
                  bookingCode === 'CLASSIC-PCID' && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='' />
                      Cezalı İade
                    </div>
                  )}
                {operatingAirline === 'QR' &&
                  bookingCode === 'CONVENIENC-PCID' && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='' />
                      Cezalı İade
                    </div>
                  )}
                {operatingAirline === 'QR' &&
                  bookingCode === 'COMFORT-PCID' && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız İade (Son 12 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'QR' &&
                  bookingCode === 'CLASSIC-PCID' && (
                    <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
                  )}
                {operatingAirline === 'QR' &&
                  (bookingCode === 'CONVENIENC-PCID' ||
                    bookingCode === 'COMFORT-PCID') && (
                    <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
                  )}
                {operatingAirline === 'UA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Özel Koltuk Seçimi (Ücretli)
                  </div>
                )}
                {operatingAirline === 'UA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Mil veya ek ödeme ile kabin yükseltme
                  </div>
                )}
                {operatingAirline === 'UA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Öncelikli Boarding (Ücretli)
                  </div>
                )}
                {operatingAirline === 'UA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    İkinci ek bagaj (Ücretli)
                  </div>
                )}
                {operatingAirline === 'AA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Sandviç İkramı
                  </div>
                )}
                {operatingAirline === 'AA' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />
                    Film, Dizi, Müzik, Oyun
                  </div>
                )}
                {operatingAirline === 'AA' && bookingCode !== 'AAAT-BASIC' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' /> Ücretsiz
                    Koltuk Seçimi
                  </div>
                )}
                {operatingAirline === 'AA' && bookingCode === 'AAAT-BASIC' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' /> Ücretsiz
                    Koltuk Seçimi
                  </div>
                )}
                {operatingAirline === 'AA' &&
                  (bookingCode === 'AAAT-PEC' ||
                    bookingCode === 'AAAT-PECFL' ||
                    bookingCode === 'AAAT-FFIRFL' ||
                    bookingCode === 'AAAT-FBUSFL') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Öncelikli Check-In Hakkı
                    </div>
                  )}
                {operatingAirline === 'AA' &&
                  (bookingCode === 'AAAT-PEC' ||
                    bookingCode === 'AAAT-PECFL' ||
                    bookingCode === 'AAAT-FFIRFL' ||
                    bookingCode === 'AAAT-FBUSFL') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Esnek Değişim (Uçuşa kadar)
                    </div>
                  )}
                {operatingAirline === 'AA' &&
                  (bookingCode === 'AAAT-FFIRFL' ||
                    bookingCode === 'AAAT-FBUSFL') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Esnek İptal (Uçuşa kadar)
                    </div>
                  )}
                {data.providerName === 'SabreATPCO' &&
                  operatingAirline !== 'AF' &&
                  operatingAirline !== 'KL' &&
                  operatingAirline !== 'BA' &&
                  operatingAirline !== 'EY' &&
                  operatingAirline !== 'EK' &&
                  selectedPackage.flightDetailSegment.freeVolatileData.BrandFeatures.map(
                    (item, index) => (
                      <div key={index} className='flex items-center gap-1'>
                        <MdCheck size={18} className='text-green-800' />
                        {item}
                      </div>
                    )
                  )}
                {/* SunExpress Airlines - SUNLIGHT */}
                {selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'SUNLIGHT' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />1 Parça 4 kg
                    Kabin bagajı (40x30x20cm)
                  </div>
                )}
                {/* SunExpress Airlines - SUNVALUE */}
                {selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'SUNVALUE' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 Parça 8
                      kg Kabin bagajı (55x40x23cm)
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 parça X
                      15 kg bagaj
                    </div>
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik Yapılamaz
                    </div>
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İptal/İade Yapılamaz
                    </div>
                  </>
                )}
                {/* SunExpress Airlines - SUNECOPLUS */}
                {selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'SUNECOPLUS' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 Parça 8
                      kg Kabin bagaj (55x40x23cm)
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 parça X
                      15 kg bagaj
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart Koltuk Seçimi
                    </div>

                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız Değişiklik (3 Güne kadar + Fiyat Farkı)
                    </div>
                  </>
                )}
                {/* SunExpress Airlines - SUNCOMFORT */}
                {selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'SUNCOMFORT' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 Parça 8
                      kg Kabin bagaj (55x40x23cm)
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 parça X
                      25 kg bagaj
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart Koltuk Seçimi
                    </div>
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız Değişiklik (7 Güne kadar + Fiyat Farkı)
                    </div>
                  </>
                )}
                {operatingAirline === 'TK' && brandCode === 'BL' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />2 parça X 20
                    kg bagaj
                  </div>
                )}
                {/* Turkish Airlines - Business Fly El Bagajı */}
                {(selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BF' ||
                  brandCode === 'BL') &&
                  operatingAirline === 'TK' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />2 X 8 Kg
                      El Bagajı
                    </div>
                  )}
                {/* Turkish Airlines - Bonus Mil */}
                {(selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL' ||
                  brandCode === 'FL') &&
                  operatingAirline === 'TK' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />% 50
                      Ekstra Bonus Mil
                    </div>
                  )}
                {/* Turkish Airlines - Fast Track */}
                {(selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BF' ||
                  brandCode === 'BL' ||
                  brandCode === 'FL') &&
                  operatingAirline === 'TK' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Fast Track (Mevcutsa)
                    </div>
                  )}
                {/* Turkish Airlines - Öncelikli Check-In */}
                {(selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BF' ||
                  brandCode === 'BL') &&
                  operatingAirline === 'TK' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Öncelikli Check-İn
                    </div>
                  )}
                {/* Turkish Airlines - Cezasız İade */}
                {selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL' &&
                  operatingAirline === 'TK' && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız İade
                    </div>
                  )}
                {/* AJet Airlines - BASIC */}
                {operatingAirline === 'VF' && brandCode === 'BASIC' && (
                  <>
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik Yapılamaz
                    </div>
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İade Edilemez
                    </div>
                  </>
                )}
                {operatingAirline === 'VF' &&
                  (brandCode === 'ECOJET' || brandCode === 'FLEX') && (
                    <>
                      <div className='flex items-center gap-2 text-red-600'>
                        <MdCheck size={18} className='text-green-800' />
                        Ücretli Değişiklik
                      </div>
                      <div className='flex items-center gap-2 text-red-600'>
                        <IoClose size={20} className='text-red-800' />
                        İade Edilemez
                      </div>
                    </>
                  )}
                {/* AJet Airlines - FLEX İade */}
                {operatingAirline === 'VF' && brandCode === 'FLEX' && (
                  <div className='flex items-center gap-2 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Kesintili İade Hakkı
                  </div>
                )}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'BIZSTAND' || brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />2 parça X
                      32 kg Kabin bagaj
                    </div>
                  )}
                {/* KLM & Air France - Koltuk Seçimi */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  brandCode === 'LIGHT' && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Koltuk Seçimi
                    </div>
                  )}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'FLEX' ||
                    brandCode === 'BIZSTAND' ||
                    brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz Koltuk Seçimi
                    </div>
                  )}
                {/* KLM & Air France - Lounge Erişimi */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'BIZSTAND' || brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Lounge Erişimi
                    </div>
                  )}
                {/* KLM & Air France - Değişiklik Kuralları */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  brandCode === 'LIGHT' && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik Yapılamaz
                    </div>
                  )}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'STANDARD' || brandCode === 'BIZSTAND') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Değişiklik
                    </div>
                  )}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'FLEX' || brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz Değişiklik
                    </div>
                  )}
                {/* KLM & Air France - İade Kuralları */}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'LIGHT' ||
                    brandCode === 'STANDARD' ||
                    brandCode === 'BIZSTAND') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İptal Edilemez
                    </div>
                  )}
                {(operatingAirline === 'AF' || operatingAirline === 'KL') &&
                  (brandCode === 'FLEX' || brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      İade Edilebilir (Uçuşa kadar)
                    </div>
                  )}
                {/* Lufthansa Airlines */}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' ||
                    brandCode === 'FLEX' ||
                    brandCode === 'BUSINESS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 Küçük
                      çanta (40 x 30 x 10 cm)
                    </div>
                  )}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' || brandCode === 'FLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 x El
                      bagajı (55 x 40 x 23 cm)
                    </div>
                  )}
                {operatingAirline === 'LH' && brandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />2 x El
                    bagajı (55 x 40 x 23 cm)
                  </div>
                )}
                {operatingAirline === 'LH' && brandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-2'>
                    <MdCheck size={18} className='text-green-800' />2 parça X 32
                    kg Kabin bagaj
                  </div>
                )}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' ||
                    brandCode === 'FLEX' ||
                    brandCode === 'BUSINESS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart Koltuk Seçimi
                    </div>
                  )}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' ||
                    brandCode === 'FLEX' ||
                    brandCode === 'BUSINESS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Mil Kazanımı
                    </div>
                  )}
                {operatingAirline === 'LH' && brandCode === 'BUSINESS' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Lounge Erişimi
                    </div>
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz İkram
                    </div>
                  </>
                )}
                {operatingAirline === 'LH' && brandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-2 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik Yapılamaz
                  </div>
                )}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' || brandCode === 'FLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Değişiklik
                    </div>
                  )}
                {operatingAirline === 'LH' &&
                  (brandCode === 'CLASSIC' || brandCode === 'BUSINESS') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İptal Edilemez
                    </div>
                  )}
                {operatingAirline === 'LH' && brandCode === 'FLEX' && (
                  <div className='flex items-center gap-2 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı İade Edilebilir (Uçuşa kadar)
                  </div>
                )}
                {/* British Airways */}
                {operatingAirline === 'BA' &&
                  (brandCode === 'NOBAG' ||
                    brandCode === 'BAG' ||
                    brandCode === 'ECONSEL' ||
                    brandCode === 'ECONFLEX' ||
                    brandCode === 'BUSINESS' ||
                    brandCode === 'BIZSEL' ||
                    brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 x El
                      bagajı 8 Kg
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'BUSINESS' ||
                    brandCode === 'BIZSEL' ||
                    brandCode === 'BIZFLEX') && (
                    <>
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />2 parça
                        X 32 kg Kabin bagaj
                      </div>
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Öncelikli Check-in
                      </div>
                      <div className='flex items-center gap-2'>
                        <MdCheck size={18} className='text-green-800' />
                        Business Lounge
                      </div>
                    </>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'NOBAG' || brandCode === 'BAG') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Koltuk Seçimi
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'ECONSEL' || brandCode === 'ECONFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Koltuk Seçimi
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'NOBAG' ||
                    brandCode === 'BAG' ||
                    brandCode === 'ECONSEL' ||
                    brandCode === 'ECONFLEX' ||
                    brandCode === 'BUSINESS' ||
                    brandCode === 'BIZSEL' ||
                    brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz İkram
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'NOBAG' ||
                    brandCode === 'BAG' ||
                    brandCode === 'BUSINESS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Uçuş Öncesi Ücretli Değişiklik (48 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'ECONSEL' ||
                    brandCode === 'ECONFLEX' ||
                    brandCode === 'BIZSEL' ||
                    brandCode === 'BIZFLEX') && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Uçuş Öncesi Cezasız Değişiklik (48 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'NOBAG' ||
                    brandCode === 'BAG' ||
                    brandCode === 'BUSINESS' ||
                    brandCode === 'BIZSEL') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İptal Edilemez
                    </div>
                  )}
                {operatingAirline === 'BA' &&
                  (brandCode === 'ECONSEL' || brandCode === 'ECONFLEX') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Cezalı İade Edilebilir (Uçuşa kadar)
                    </div>
                  )}
                {operatingAirline === 'BA' && brandCode === 'BIZFLEX' && (
                  <div className='flex items-center gap-2 text-green-800'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade Edilebilir (48 Saate Kadar)
                  </div>
                )}
                {/* Emirates Airlines */}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLEX' || brandCode === 'ECOFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 x El
                      bagajı 7 Kg
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'BSFLEX' || brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />2 x El
                      bagajı 7 Kg
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLEX' ||
                    brandCode === 'ECOFLXPLUS' ||
                    brandCode === 'BSFLEX' ||
                    brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz İkram
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'BSFLEX' || brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Business Lounge
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLEX' ||
                    brandCode === 'ECOFLXPLUS' ||
                    brandCode === 'BSFLEX' ||
                    brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart Koltuk Seçimi
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLEX' || brandCode === 'BSFLEX') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Değişiklik
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLXPLUS' || brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz Değişiklik
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLEX' || brandCode === 'BSFLEX') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Cezalı İade Edilebilir
                    </div>
                  )}
                {operatingAirline === 'EK' &&
                  (brandCode === 'ECOFLXPLUS' || brandCode === 'BSFLXPLUS') && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız İade Edilebilir
                    </div>
                  )}
                {/* Etihad Airways */}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YBASIC' ||
                    brandCode === 'YVALUE' ||
                    brandCode === 'YCOMFORT' ||
                    brandCode === 'YDELUXE' ||
                    brandCode === 'JVALUE' ||
                    brandCode === 'JCOMFORT' ||
                    brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />1 x El
                      bagajı 7 Kg
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'JVALUE' ||
                    brandCode === 'JCOMFORT' ||
                    brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Öncelikli Check-in
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'JCOMFORT' || brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Business Lounge
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YBASIC' ||
                    brandCode === 'YVALUE' ||
                    brandCode === 'YCOMFORT' ||
                    brandCode === 'YDELUXE' ||
                    brandCode === 'JVALUE' ||
                    brandCode === 'JCOMFORT' ||
                    brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz İkram
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YCOMFORT' ||
                    brandCode === 'YDELUXE' ||
                    brandCode === 'JCOMFORT' ||
                    brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Standart Koltuk Seçimi
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YBASIC' || brandCode === 'YVALUE') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik Yapılamaz
                    </div>
                  )}
                {!(bookingCode !== 'EF' && operatingAirline !== 'PC') &&
                  baggageAllowance.maxWeight.value <= 15 && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik yapılamaz &amp; İade edilemez
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YBASIC' ||
                    brandCode === 'YVALUE' ||
                    brandCode === 'JVALUE') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İade Edilemez
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YCOMFORT' ||
                    brandCode === 'JVALUE' ||
                    brandCode === 'JCOMFORT') && (
                    <div className='flex items-center gap-2'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretli Değişiklik (48 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YDELUXE' || brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız Değişiklik (48 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YCOMFORT' || brandCode === 'JCOMFORT') && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Cezalı İade (48 Saate Kadar)
                    </div>
                  )}
                {operatingAirline === 'EY' &&
                  (brandCode === 'YDELUXE' || brandCode === 'JDELUXE') && (
                    <div className='flex items-center gap-2 text-green-800'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız İade (48 Saate Kadar)
                    </div>
                  )}
              </Stack>
            </div>
          )
        })}
      </div>
      <div className='sticky bottom-0 flex items-center md:justify-center'>
        <Button
          type='button'
          radius={'xl'}
          size='lg'
          className='w-full bg-blue-800 text-white shadow-lg hover:bg-blue-700 md:w-[200px]'
          onClick={handleContinue}
          rightSection={<IoChevronForwardOutline />}
        >
          Devam Et
        </Button>
      </div>
    </div>
  )
}

export { PackageFlightDrawer }
