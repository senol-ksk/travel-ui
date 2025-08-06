import { formatCurrency } from '@/libs/util'
import { Button, rem, Stack } from '@mantine/core'

import clsx from 'clsx'
import {
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../../type'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
  flightDetails: FlightDetail
}

type IProps = {
  data: {
    packages: SelectedPackageStateProps[] | undefined | null
    flights: ClientDataType[]
  }
  onSelect: (selectedPackage: SelectedPackageStateProps) => void
}

const DrawerFlight: React.FC<IProps> = ({ data, onSelect }) => {
  const selectedFlightItemPackages = data
  // border colors dyanmic changing for per package
  const dynmicborderColors = [
    'border-t-gray-500',
    'border-t-green-700',
    'border-t-indigo-900',
    'border-t-purple-600',
  ]
  // base price defined
  const mainPricePackage = data.flights.at(-1)?.fareInfo.totalPrice.value ?? 0

  return (
    <div className='grid grid-flow-col grid-rows-3 gap-3 sm:grid-rows-1'>
      {selectedFlightItemPackages?.packages?.map((selectedPackage, index) => {
        const dynamicBorderColor =
          dynmicborderColors[index % dynmicborderColors.length]
        // package price defined
        let packagePrice = selectedPackage.flightFareInfo.totalPrice.value
        // package base prıce calculated
        packagePrice =
          selectedPackage.flightFareInfo.totalPrice.value - mainPricePackage
        packagePrice = Math.max(0, packagePrice)
        console.log(selectedPackage)
        return (
          <div
            key={selectedPackage.flightFareInfo.key}
            className={`flex cursor-pointer flex-col items-start gap-2 rounded-md border border-t-6 p-2 md:p-3 ${dynamicBorderColor}`}
            role='button'
            onClick={() => {
              onSelect(selectedPackage)
            }}
          >
            <div className='flex w-full cursor-pointer justify-between gap-2'>
              <div className='font-semibold capitalize'>
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
            <Stack gap={rem(4)} className='mb-8 text-sm'>
              {selectedPackage.flightDetailSegment.baggageAllowance.maxWeight
                .value > 0 && (
                <div>
                  {
                    selectedPackage.flightDetailSegment.baggageAllowance
                      .maxWeight.value
                  }{' '}
                  kg bagaj
                </div>
              )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'PC' && (
                <div>1 Adet Koltuk Altına Sığacak Çanta (40x30x15)</div>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName !== 'SUPER_ECO' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && <div>1 Parça Kabin bagajı (55x40x20)</div>}
              {selectedPackage.flightDetails.freeVolatileData
                .StandartSeatSelection && <div>Standart koltuk seçimi</div>}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'EXTRA' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && <div>Sandviç İkramı</div>}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'EXTRA' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && <div>Film, Dizi, Müzik, Oyun</div>}
              {selectedPackage.flightDetails.freeVolatileData
                .FlexibleReturnChangeRight && (
                <div>Esnek İade/Değişiklik Hakkı</div>
              )}
              {selectedPackage.flightDetails.freeVolatileData
                .AllSeatSelection && <div>Dilediğiniz Koltuk Seçimi</div>}
              {selectedPackage.flightDetailSegment.bookingCode !== 'EF' &&
                selectedPackage.flightDetailSegment.operatingAirline.code !==
                  'PC' && (
                  <div
                    className={clsx({
                      'text-red-800':
                        selectedPackage.flightDetailSegment.bookingCode !==
                        'XF',
                    })}
                  >
                    {selectedPackage.flightDetailSegment.bookingCode === 'PF'
                      ? 'Cezasız Değişiklik'
                      : 'Ücretli Değişiklik'}
                  </div>
                )}

              {!(
                selectedPackage.flightDetailSegment.bookingCode !== 'EF' &&
                selectedPackage.flightDetailSegment.operatingAirline.code !==
                  'PC'
              ) &&
                selectedPackage.flightDetailSegment.baggageAllowance.maxWeight
                  .value <= 15 && (
                  <div className='text-red-600'>
                    Değişiklik yapılamaz &amp; İade edilemez
                  </div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode !==
                  'AAAT-FBUSFL' && <div>2x32 Kg Bagaj Hakkı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-FFIRFL' && <div>3x32 Kg Bagaj Hakkı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL') && <div>2x23 Kg Bagaj Hakkı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-MAINFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-MAINSFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-MAIN') && <div>1x23 Kg Bagaj Hakkı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'LO' &&
                  selectedPackage.flightDetailSegment.bookingCode !==
                    'SAVER-PCID' && <div>1x23 Kg Bagaj Hakkı</div>)}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'VF' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'UA' && <div>1 parça X 8 kg El Bagajı</div>)}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'SQ' && <div>1 parça X 7 kg El Bagajı</div>)}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'AA' && <div>Kabin Bagajı</div>)}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' && <div>Ücretli Koltuk Seçimi</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' ||
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'AA' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'LO' &&
                  (selectedPackage.flightDetailSegment.bookingCode ===
                    'SAVER-PCID' ||
                    selectedPackage.flightDetailSegment.bookingCode ===
                      'STANDARD-PCID') && <div>Ekstra Mil Kazancı</div>)}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF41-PCID' && <div>50 Ekstra Mil</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && <div>Esnek Değişim (Uçuşa kadar)</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && <div>%100 Ekstra Mil Kazancı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF01-PCID' && <div>%125 Ekstra Mil Kazancı</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FLEX-PCID' && <div>%150 Ekstra Mil Kazancı</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'LO' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FLEX-PCID' && <div>Esnek Değişim (Uçuşa kadar)</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF21-PCID' && <div>Ücretsiz Koltuk Seçimi</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'SQ' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'FF31-PCID' && <div>75 Ekstra Mil</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'CLASSIC-PCID' && (
                  <div className='text-red-600'>Cezalı İade</div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'CONVENIENC-PCID' && (
                  <div className='text-red-600'>Cezalı İade</div>
                )}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'QR' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'COMFORT-PCID' && (
                  <div className='text-red-600'>
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
                'UA' && <div>Özel Koltuk Seçimi (Ücretli)</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && <div>Mil veya ek ödeme ile kabin yükseltme</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && <div>Öncelikli Boarding (Ücretli)</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' && <div>İkinci ek bagaj (Ücretli)</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' && <div>Sandviç İkramı</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' && <div>Film, Dizi, Müzik, Oyun</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode !==
                  'AAAT-BASIC' && <div> Ücretsiz Koltuk Seçimi</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-BASIC' && <div> Ücretsiz Koltuk Seçimi</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && <div>Öncelikli Check-In Hakkı</div>}

              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-PEC' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-PECFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && <div>Esnek Değişim (Uçuşa kadar)</div>}
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'AA' &&
                (selectedPackage.flightDetailSegment.bookingCode ===
                  'AAAT-FFIRFL' ||
                  selectedPackage.flightDetailSegment.bookingCode ===
                    'AAAT-FBUSFL') && <div>Esnek İptal (Uçuşa kadar)</div>}
            </Stack>
            <div className='mt-auto w-full'>
              <Button
                type='button'
                fullWidth
                radius={'xl'}
                size='lg'
                variant='outline'
                className='hover:bg-blue-800 hover:text-white'
              >
                +{formatCurrency(packagePrice)}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { DrawerFlight }
