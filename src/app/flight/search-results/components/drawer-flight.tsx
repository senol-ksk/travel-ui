import { formatCurrency } from '@/libs/util'
import { Badge, Button, rem, Stack } from '@mantine/core'

import clsx from 'clsx'
import {
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../../type'
import { MdCheck } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa6'

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
          dynmicborderColors[index % dynmicborderColors.length]
        // package price defined
        let packagePrice = selectedPackage.flightFareInfo.totalPrice.value
        // package base prıce calculated
        packagePrice =
          selectedPackage.flightFareInfo.totalPrice.value - mainPricePackage
        packagePrice = Math.max(0, packagePrice)
        return (
          <div
            key={selectedPackage.flightFareInfo.key}
            className={clsx(
              `${dynamicBorderColor} relative my-4 flex cursor-pointer flex-col items-start rounded-lg border border-t-10 p-2 shadow-xl md:gap-1 md:p-4`,
              isSelected ? 'bg-gray-200' : `hover:bg-gray-200`
            )}
            role='button'
            onClick={() => onSelect(selectedPackage)}
          >
            {isSelected && (
              <Badge className='absolute -top-1 -right-2 flex -translate-y-3 rounded-md bg-green-800 px-6 py-3 text-sm text-white shadow-xl md:-left-3'>
                Seçili
              </Badge>
            )}
            <div className='flex w-full cursor-pointer justify-between gap-2'>
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
            <Stack gap={rem(4)} className='mb-10 text-sm'>
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
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'PREMIUM' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandName === 'BASIC' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandName === 'FLEX') && (
                <>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />1 parça x 8
                    kg kabin bagajı
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' /> 1 parça x 4
                    kg kişisel eşya
                  </div>
                </>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'PREMIUM' && (
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
              {(selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'ADVANTAGE' ||
                selectedPackage.flightDetailSegment.freeVolatileData
                  .BrandName === 'EXTRA') && (
                <div className='flex items-center gap-1'>
                  <MdCheck size={18} className='text-green-800' />
                  Sandviç İkramı
                </div>
              )}
              {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'EXTRA' &&
                selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'PC' && (
                  <div className='flex items-center gap-1'>
                    <MdCheck size={18} className='text-green-800' />
                    Film, Dizi, Müzik, Oyun
                  </div>
                )}
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
                .BrandName === 'FLEX' && (
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
                .BrandName === 'PREMIUM' && (
                <>
                  <div className={'grid items-center text-green-800'}>
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      Ücretsiz Değişiklik{' '}
                    </div>
                    {/* <span className='px-5 text-xs text-gray-600'>
                      (Uçuşa 1 saat kalana kadar)
                    </span> */}
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
              {/* {!(
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
                )} */}
              {/* {selectedPackage.flightDetailSegment.freeVolatileData
                .BrandName === 'BASIC' && (
                <div className='flex items-center gap-1 text-red-600'>
                  <IoClose size={20} className='text-red-800' />
                  Değişiklik yapılamaz &amp; İade edilemez
                </div>
              )} */}
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
              {selectedPackage.flightDetailSegment.operatingAirline.code ===
                'UA' ||
                (selectedPackage.flightDetailSegment.operatingAirline.code ===
                  'LO' &&
                  selectedPackage.flightDetailSegment.bookingCode !==
                    'SAVER-PCID' && (
                    <div className='flex items-center gap-1'>
                      <MdCheck size={18} className='text-green-800' />
                      1x23 Kg Bagaj Hakkı
                    </div>
                  ))}
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
                <div className={clsx(`text-md flex items-center gap-1`)}>
                  {isSelected && <FaCheck size={21} />}+
                  {formatCurrency(packagePrice)}
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
