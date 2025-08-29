import { Button, rem, Stack } from '@mantine/core'
import { MdCheck } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa6'

import clsx from 'clsx'
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

const DrawerFlight: React.FC<IProps> = ({ data, onSelect }) => {
  const selectedFlightItemPackages = data

  const dynamicBorderColors = [
    'border-t-gray-500',
    'border-t-indigo-900',
    'border-t-purple-600',
    'border-t-pink-500',
    'border-t-red-600',
    'border-t-green-700',
  ]
  // base price defined
  const mainPricePackage = data.flights.at(-1)?.fareInfo.totalPrice.value ?? 0
  return (
    <div className='sm:grid sm:grid-flow-col sm:grid-rows-1 sm:gap-3'>
      {selectedFlightItemPackages?.packages?.map((selectedPackage, index) => {
        const isSelected = index === 0
        const dynamicBorderColor =
          dynamicBorderColors[index % dynamicBorderColors.length]
        const packagePrice =
          selectedPackage.flightFareInfo.totalPrice.value - mainPricePackage
        console.log(data)
        return (
          <div
            key={selectedPackage.flightFareInfo.key}
            className={clsx(
              `${dynamicBorderColor} relative my-10 flex cursor-pointer flex-col items-start rounded-lg border border-t-10 p-2 shadow-xl md:gap-1 md:p-4`,
              isSelected ? 'bg-gray-200' : `hover:bg-gray-200`
            )}
            role='button'
            onClick={() => onSelect(selectedPackage)}
          >
            {isSelected && (
              <div className='absolute -top-9 right-0 flex -translate-y-3 md:left-0'>
                <span className='relative rounded bg-green-900 px-4 py-1 text-sm text-white shadow-xl'>
                  Seçilen
                  <span className='absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-green-900 border-r-transparent border-l-transparent'></span>
                </span>
              </div>
            )}
            <div className='mb-2 grid w-full cursor-pointer justify-between gap-1'>
              <div className='text-2xl font-bold'>
                +
                {new Intl.NumberFormat('tr', {
                  currency: 'TRY',
                }).format(packagePrice)}{' '}
                TL
                {/* +{packagePrice.toFixed(0)} TL */}
              </div>
              <div className='text-lg font-bold capitalize'>
                {(() => {
                  switch (
                    selectedPackage.flightDetailSegment.freeVolatileData
                      .BrandName
                  ) {
                    case 'SUPER_ECO':
                      return 'Light'
                    case 'ECO':
                      return 'Süper Eko'
                    case 'ADVANTAGE':
                      return 'Avantaj'
                    case 'EXTRA':
                      return 'Comfort Flex'
                    default:
                      return selectedPackage.flightDetailSegment
                        .freeVolatileData.BrandName
                  }
                })()}
              </div>
            </div>
            <Stack gap={rem(4)} className='mb-16 text-sm'>
              {selectedPackage.flightDetailSegment.baggageAllowance.maxWeight
                .value > 0 && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  {
                    selectedPackage.flightDetailSegment.baggageAllowance
                      .maxWeight.value
                  }{' '}
                  Kg Uçak Altı Bagajı
                </div>
              )}{' '}
              {selectedPackage?.flightDetailSegment && (
                <>
                  {(selectedPackage.flightDetailSegment.bookingCode === 'EF' ||
                    selectedPackage.flightDetailSegment.bookingCode === 'XF' ||
                    selectedPackage.flightDetailSegment.bookingCode ===
                      'PF') && (
                    <>
                      <div className='flex items-center gap-1'>
                        <MdCheck size={18} className='text-green-800' />1 parça
                        x 8 kg kabin bagajı
                      </div>
                      <div className='flex items-center gap-1'>
                        <MdCheck size={18} className='text-green-800' />
                        İkram Hizmeti
                      </div>
                      <div className='flex items-center gap-1'>
                        <MdCheck size={18} className='text-green-800' />
                        24 saat içinde kesintisiz iade
                      </div>
                    </>
                  )}
                </>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'PREMIUM' &&
                selectedPackage.flightDetailSegment.freeVolatileData.Owner ===
                  'VF' && (
                  <>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Sandviç İkramı
                    </div>
                  </>
                )}
              {selectedPackage?.flightDetailSegment && (
                <>
                  {selectedPackage.flightDetailSegment.bookingCode === 'PF' && (
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Kesintisiz iade (son 12 saate kadar)
                    </div>
                  )}
                </>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName !== 'SUPER_ECO' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                    Bagajı (55x40x20)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.bookingCode === 'PF' ||
                (selectedPackage.flightDetailSegment.bookingCode === 'XF' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart koltuk seçimi
                  </div>
                ))}
              {/* {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'ADVANTAGE' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandName === 'EXTRA') && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Sandviç İkramı
                </div>
              )} */}
              {/* {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'EXTRA' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Film, Dizi, Müzik, Oyun
                  </div>
                )} */}
              {selectedPackage.flightDetails.freeVolatileData
                .AllSeatSelection && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Dilediğiniz Koltuk Seçimi
                </div>
              )}
              {selectedPackage.flightDetailSegment.bookingCode === 'XF' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  150 Ekstra Bonus Mil
                </div>
              )}
              {selectedPackage.flightDetailSegment.bookingCode === 'PF' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  250 Ekstra Bonus Mil
                </div>
              )}
              {selectedPackage.flightDetails.freeVolatileData
                .StandartSeatSelection && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Standart Koltuk Seçimi
                </div>
              )}
              {selectedPackage.flightDetailSegment.bookingCode === 'EF' ||
                (selectedPackage.flightDetailSegment.bookingCode === 'XF' && (
                  <div className={'flex items-center gap-1 text-red-800'}>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı Değişiklik
                  </div>
                ))}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'FLEX' &&
                selectedPackage.flightDetailSegment.freeVolatileData.Owner ===
                  'VF' && (
                  <>
                    <div className={'flex items-center gap-1 text-red-800'}>
                      <IoClose size={20} className='text-red-800' />
                      Ücretli Değişiklik
                    </div>
                    <div className={'flex items-center gap-1 text-red-800'}>
                      <IoClose size={20} className='text-red-800' />
                      Kesintili İade Hakkı
                    </div>
                  </>
                )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'PREMIUM' &&
                selectedPackage.flightDetailSegment.freeVolatileData.Owner ===
                  'VF' && (
                  <>
                    <div className={'grid items-center text-green-800'}>
                      <div className='flex items-center gap-1'>
                        <MdCheck size={18} className='text-green-800' />
                        Ücretsiz Değişiklik{' '}
                      </div>
                    </div>
                  </>
                )}
              {selectedPackage.flightDetails.freeVolatileData
                .FlexibleReturnChangeRight && (
                <div className='grid items-center text-green-800'>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek İade/Değişiklik Hakkı
                  </div>
                  {/* <span className='px-5 text-xs text-gray-600'>
                    (Uçuşa 1 saat kalana kadar)
                  </span> */}
                </div>
              )}
              {selectedPackage.flightDetailSegment.bookingCode === 'PF' && (
                <div className='flex items-center gap-1 text-green-800'>
                  <MdCheck size={18} className='text-green-800' />
                  Cezasız Değişiklik
                </div>
              )}
              {selectedPackage.flightDetailSegment.bookingCode === 'PF' && (
                <>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz ön sıra koltuk seçimi
                  </div>
                </>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'BASIC' &&
                selectedPackage.flightDetailSegment.operatingAirline.code !==
                  'BA' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik yapılamaz &amp; İade edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode !==
                  'AAAT-FBUSFL' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    2x32 Kg Bagaj Hakkı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-FFIRFL' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    3x32 Kg Bagaj Hakkı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    2x23 Kg Bagaj Hakkı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-MAINFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-MAINSFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-MAIN') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    1x23 Kg Bagaj Hakkı
                  </div>
                )}
              {/* {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'LO' &&
                  selectedPackage.flightDetailSegment.bookingCode !==
                    'SAVER-PCID' && (
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      1x23 Kg Bagaj Hakkı
                    </div>
                  ))} */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'UA' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 8
                    kg El Bagajı
                  </div>
                ))}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'SQ' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 7
                    kg El Bagajı
                  </div>
                ))}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'AA' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Kabin Bagajı
                  </div>
                ))}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Ücretli Koltuk Seçimi
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'AA' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'LO' &&
                  (selectedPackage.flightDetailSegment.bookingCode ===
                    'SAVER-PCID' ||
                    selectedPackage.flightDetailSegment.bookingCode ===
                      'STANDARD-PCID') && (
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Ekstra Mil Kazancı
                    </div>
                  ))}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF41-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    50 Ekstra Mil
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek Değişim (Uçuşa kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    %100 Ekstra Mil Kazancı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF01-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    %125 Ekstra Mil Kazancı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FLEX-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    %150 Ekstra Mil Kazancı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FLEX-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek Değişim (Uçuşa kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF31-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    75 Ekstra Mil
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'CLASSIC-PCID' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='' />
                    Cezalı İade
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'CONVENIENC-PCID' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='' />
                    Cezalı İade
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'COMFORT-PCID' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade (Son 12 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'CLASSIC-PCID' && (
                  <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'CONVENIENC-PCID' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'COMFORT-PCID') && (
                  <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Özel Koltuk Seçimi (Ücretli)
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Mil veya ek ödeme ile kabin yükseltme
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Öncelikli Boarding (Ücretli)
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  İkinci ek bagaj (Ücretli)
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Sandviç İkramı
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Film, Dizi, Müzik, Oyun
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode !==
                  'AAAT-BASIC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' /> Ücretsiz
                    Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-BASIC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' /> Ücretsiz
                    Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Öncelikli Check-In Hakkı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek Değişim (Uçuşa kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Esnek İptal (Uçuşa kadar)
                  </div>
                )}
              {data.providerName === 'SabreATPCO' &&
                ((selectedPackage.flightDetailSegment.operatingAirline.code !==
                  'AF' &&
                  selectedPackage.flightDetailSegment.operatingAirline.code !==
                    'KL' &&
                  selectedPackage.flightDetailSegment.operatingAirline.code !==
                    'LH' &&
                  selectedPackage.flightDetailSegment.operatingAirline.code !==
                    'BA' &&
                  selectedPackage.flightDetailSegment.operatingAirline.code !==
                    'EY' &&
                  selectedPackage.flightDetailSegment.operatingAirline.code !==
                    'EK') ||
                  selectedPackage.flightDetailSegment.marketingAirline.code !==
                    selectedPackage.flightDetailSegment.operatingAirline
                      .code) &&
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
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />1 Parça 4 kg
                  Kabin bagajı (40x30x20cm)
                </div>
              )}
              {/* SunExpress Airlines - SUNVALUE */}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'SUNVALUE' && (
                <>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                    Kabin bagajı (55x40x23cm)
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 20
                    kg bagaj
                  </div>
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik Yapılamaz
                  </div>
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    İptal/İade Yapılamaz
                  </div>
                </>
              )}
              {/* SunExpress Airlines - SUNECOPLUS */}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'SUNECOPLUS' && (
                <>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                    Kabin bagaj (55x40x23cm)
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 20
                    kg bagaj
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız Değişiklik (7 Güne kadar + Fiyat Farkı)
                  </div>
                </>
              )}
              {/* SunExpress Airlines - SUNCOMFORT */}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'SUNCOMFORT' && (
                <>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                    Kabin bagaj (55x40x23cm)
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 25
                    kg bagaj
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart Koltuk Seçimi
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız Değişiklik (3 Güne kadar + Fiyat Farkı)
                  </div>
                </>
              )}
              {/* Turkish Airlines - Business Fly */}
              {/* {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'TK' &&
                !(
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BF' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BL'
                ) && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                    Bagajı
                  </div>
                )} */}
              {/* Turkish Airlines - Bagaj Hakları */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'TK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'GN' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'LG') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 23
                    kg bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'TK' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FL' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 30
                    kg bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'TK' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BF' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 30
                    kg bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'TK' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 parça X 20
                    kg bagaj
                  </div>
                )}
              {/* Turkish Airlines - Business Fly El Bagajı */}
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'BF' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL') &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'TK' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 X 8 Kg El
                    Bagajı
                  </div>
                )}
              {/* Turkish Airlines - Bonus Mil */}
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'BL' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FL') &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'TK' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Yüzde 50 Ekstra Bonus Mil
                  </div>
                )}
              {/* Turkish Airlines - Fast Track */}
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'BF' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FL') &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'TK' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Fast Track (Mevcutsa)
                  </div>
                )}
              {/* Turkish Airlines - Öncelikli Check-In */}
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'BF' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BL') &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'TK' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Öncelikli Check-İn
                  </div>
                )}
              {/* Turkish Airlines - Cezasız İade */}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'BL' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'TK' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade
                  </div>
                )}
              {/* AJet Airlines - PREMIUM */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'PREMIUM' && (
                  <>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Sandviç İkramı
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Dilediğiniz Koltuk Seçimi
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız Değişiklik
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Cezasız İade Hakkı
                    </div>
                  </>
                )}
              {/* AJet Airlines - BASIC */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BASIC' && (
                  <>
                    <div className='flex items-center gap-1 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik Yapılamaz
                    </div>
                    <div className='flex items-center gap-1 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İade Edilemez
                    </div>
                  </>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOJET' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX') && (
                  <>
                    <div className='flex items-center gap-1 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Ücretli Değişiklik
                    </div>
                    <div className='flex items-center gap-1 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      İade Edilemez
                    </div>
                  </>
                )}
              {/* AJet Airlines - FLEX İade */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FLEX' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Kesintili İade Hakkı
                  </div>
                )}
              {/* KLM & Air France Airlines */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'KL' && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />1 Küçük çanta
                  (40 x 30 x 15 cm)
                </div>
              )}
              {/* KLM & Air France - El Bagajı */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'LIGHT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'STANDARD' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 x El
                    bagajı (55 x 35 x 25 cm)*
                  </div>
                )}
              {/* KLM & Air France - Business El Bagajı */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BIZSTAND' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 x El
                    bagajı (55 x 35 x 25 cm)*
                  </div>
                )}
              {/* KLM & Air France - Bagaj Hakları */}
              {/* {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'STANDARD' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 23
                    kg Kabin bagaj
                  </div>
                )} */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BIZSTAND' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 parça X 32
                    kg Kabin bagaj
                  </div>
                )}
              {/* KLM & Air France - Koltuk Seçimi */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'LIGHT' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretli Koltuk Seçimi
                  </div>
                )}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSTAND' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz Koltuk Seçimi
                  </div>
                )}
              {/* KLM & Air France - Lounge Erişimi */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BIZSTAND' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Lounge Erişimi
                  </div>
                )}
              {/* KLM & Air France - Değişiklik Kuralları */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'LIGHT' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik Yapılamaz
                  </div>
                )}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'STANDARD' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSTAND') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Ücretli Değişiklik
                  </div>
                )}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz Değişiklik
                  </div>
                )}
              {/* KLM & Air France - İade Kuralları */}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'LIGHT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'STANDARD' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSTAND') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    İptal Edilemez
                  </div>
                )}
              {(selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AF' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'KL') &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    İade Edilebilir (Uçuşa kadar)
                  </div>
                )}
              {/* Lufthansa Airlines */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 Küçük
                    çanta (40 x 30 x 10 cm) deneme
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 x El
                    bagajı (55 x 40 x 23 cm)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 x El
                    bagajı (55 x 40 x 23 cm)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 parça X 32
                    kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Mil Kazanımı
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BUSINESS' && (
                  <>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Lounge Erişimi
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz İkram
                    </div>
                  </>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BUSINESS' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik Yapılamaz
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'FLEX') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Ücretli Değişiklik
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'CLASSIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    İptal Edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LH' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'FLEX' && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı İade Edilebilir (Uçuşa kadar)
                  </div>
                )}
              {/* British Airways */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'NOBAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 x El
                    bagajı 8 Kg
                  </div>
                )}
              {/* {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça X 23
                    kg Kabin bagaj
                  </div>
                )} */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BUSINESS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />2 parça X
                      32 kg Kabin bagaj
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Öncelikli Check-in
                    </div>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Business Lounge
                    </div>
                  </>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'NOBAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BAG') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretli Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'NOBAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz İkram
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'NOBAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Uçuş Öncesi Ücretli Değişiklik (48 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZFLEX') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Uçuş Öncesi Cezasız Değişiklik (48 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'NOBAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BAG' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BUSINESS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BIZSEL') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    İptal Edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECONSEL' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECONFLEX') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı İade Edilebilir (Uçuşa kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'BA' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BIZFLEX' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade Edilebilir (48 Saate Kadar)
                  </div>
                )}
              {/* Emirates Airlines */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECOFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 x El
                    bagajı 7 Kg
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BSFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />2 x El
                    bagajı 7 Kg
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    30 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLXPLUS' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    35 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BSFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    40 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECOFLXPLUS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz İkram
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'BSFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Business Lounge
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'ECOFLXPLUS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLEX') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Ücretli Değişiklik
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLXPLUS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz Değişiklik
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLEX' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLEX') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı İade Edilebilir
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EK' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'ECOFLXPLUS' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'BSFLXPLUS') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade Edilebilir
                  </div>
                )}
              {/* Etihad Airways */}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YBASIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 x El
                    bagajı 7 Kg
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YVALUE' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    25 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YCOMFORT' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    30 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'JVALUE' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    35 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    40 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'JDELUXE' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    50 kg Kabin bagaj
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'JVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Öncelikli Check-in
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'JCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Business Lounge
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YBASIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Ücretsiz İkram
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Standart Koltuk Seçimi
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YBASIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YVALUE') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik Yapılamaz
                  </div>
                )}
              {!(
                selectedPackage.flightDetailSegment.bookingCode !== 'EF' &&
                selectedPackage.flightDetailSegment.operatingAirline.code !==
                  'PC'
              ) &&
                selectedPackage.flightDetailSegment.baggageAllowance.maxWeight
                  .value <= 15 && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Değişiklik yapılamaz &amp; İade edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YBASIC' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'YVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JVALUE') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    İade Edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JVALUE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Ücretli Değişiklik (48 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız Değişiklik (48 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YCOMFORT' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JCOMFORT') && (
                  <div className='flex items-center gap-1 text-red-600'>
                    <IoClose size={20} className='text-red-800' />
                    Cezalı İade (48 Saate Kadar)
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'EY' &&
                (selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandCode === 'YDELUXE' ||
                  selectedPackage.flightDetailSegment.freeVolatileData
                    .BrandCode === 'JDELUXE') && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Cezasız İade (48 Saate Kadar)
                  </div>
                )}
              {/* Package Contents */}
              {/* {selectedPackage.flightDetailSegment.freeVolatileData.SeatSelection && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Standart koltuk seçimi
                </div>
              )} */}
              {/* {selectedPackage.flightDetailSegment.packageContents?.StandartSeatSelection && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Standart Koltuk Seçimi
                </div>
              )} */}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandCode === 'EXTRA' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Sandviç İkramı
                  </div>
                )}
            </Stack>
            <div className='mt-auto w-full'>
              <Button
                type='button'
                fullWidth
                radius={'xl'}
                size='md'
                variant='outline'
                className={`${isSelected ? 'gap-3 border-gray-500 bg-gray-600 text-white' : 'bg-blue-800 text-white hover:border-gray-600 hover:bg-gray-600'} `}
              >
                <div className='flex items-center gap-2'>
                  {isSelected && <FaCheck size={26} />}
                  {isSelected ? 'SEÇİLİ' : 'SEÇ'}
                </div>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { DrawerFlight }
