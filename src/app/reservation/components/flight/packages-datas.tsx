import {
  FlightReservationSummary,
  FlightReservationFlightList,
} from '@/types/passengerViewModel'
import { Spoiler } from '@mantine/core'
import { IoClose } from 'react-icons/io5'
import { MdCheck } from 'react-icons/md'

type IProps = {
  flightData: FlightReservationSummary
  selectedFlight?: FlightReservationFlightList
}
export const PackagesDatas: React.FC<IProps> = ({
  flightData,
  selectedFlight,
}) => {
  const flightToUse = selectedFlight || flightData.flightList[0]

  const brandCode = flightToUse.flightDetail.freeVolatileData.BrandCode
  const brandNamePc = flightToUse.flightDetail.freeVolatileData.brandname
  const owner = flightToUse.flightDetail.freeVolatileData.Owner
  const brandName = flightToUse.flightDetail.freeVolatileData.BrandName
  const isDomestic = flightToUse.flightDetail.isDomestic
  const brandFeatures =
    flightToUse.flightDetail.freeVolatileData.BrandFeatures || []
  const operatingAirlineInt =
    flightToUse.flightSegments[0].operatingAirline.code
  const marketingAirlineInt =
    flightToUse.flightSegments[0].marketingAirline.code
  const brandNameInt = flightToUse.flightSegments[0].freeVolatileData.BrandName
  const providerNameInt = flightData.providerName
  const baggageAllowanceInt =
    flightToUse.flightSegments[0].baggageAllowance.maxWeight.value

  return (
    <div className='text-sm'>
      {baggageAllowanceInt !== 0 && (
        <div className='flex items-center gap-2'>
          <MdCheck size={18} className='text-green-800' />
          {baggageAllowanceInt} Kg Kabin Bagaj Hakkı
        </div>
      )}{' '}
      {/* INTERNATIONAL TK, VF, QX, PC, VF */}
      {!isDomestic && (
        <>
          {/* INT TK ECOFLY,CL-- EXTRAFLY,LG -- FLEXFLY,GN -- PRİMEFLY,FL */}
          {owner === 'TK' && brandCode === 'CL' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İkram Servisi
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {owner === 'TK' && (brandCode === 'LG' || brandCode === 'GN') && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İkram Servisi
              </div>
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
          {owner === 'TK' && brandCode === 'FL' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />% 50 Ekstra
                Bonus Mil
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Fast Track (Mevcutsa)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İkram Servisi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Cezasız Değişiklik
              </div>
            </>
          )}

          {/* INT PC SUPER_ECO -- ECO -- ADVANTAGE -- EXTRA */}
          {owner === 'PC' && brandNamePc === 'SUPER_ECO' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Koltuk
                Altına Sığacak Çanta (40x30x15)
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {owner === 'PC' && brandNamePc === 'ECO' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Koltuk
                Altına Sığacak Çanta (40x30x15)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
            </>
          )}
          {owner === 'PC' && brandNamePc === 'ADVANTAGE' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Koltuk
                Altına Sığacak Çanta (40x30x15)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
            </>
          )}
          {owner === 'PC' && brandNamePc === 'EXTRA' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Koltuk
                Altına Sığacak Çanta (40x30x15)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Dilediğiniz Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Esnek İade/Değişiklik Hakkı
              </div>
            </>
          )}

          {/*INT VF BASIC -- ECOJET -- FLEX -- PREMIUM */}
          {owner === 'VF' && brandName === 'BASIC' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {owner === 'VF' && brandName === 'ECOJET' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
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
          {owner === 'VF' && brandName === 'FLEX' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Kesintili İade Hakkı
              </div>
            </>
          )}
          {owner === 'VF' && brandName === 'PREMIUM' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz Değişiklik
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Dilediğiniz Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Esnek İade/Değişiklik Hakkı
              </div>
            </>
          )}
          {/*DOMESTIC XQ SUNVALUE -- SUNECOPLUS -- SUNCOMFORT */}
          {brandName === 'SUNVALUE' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {brandName === 'SUNECOPLUS' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
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
          {brandName === 'SUNCOMFORT' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
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
        </>
      )}
      {/* DOMESTIC TK, VF, QX, PC, VF*/}
      {isDomestic && (
        <>
          {/* DOMESTIC TK ECOFLY,EF-- EXTRAFLY,XF --  Prime Fly,PF */}
          {brandCode === 'EF' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {brandCode === 'XF' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İkram Servisi
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                24 saat içinde kesintisiz iade
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Cezalı Değişiklik
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                150 Ekstra Ekstra Bonus Mil
              </div>
            </>
          )}
          {brandCode === 'PF' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İkram Servisi
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                24 saat içinde kesintisiz iade
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Kesintisiz iade (son 12 saate kadar)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücresiz Ön Sıra Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Cezasız Değişiklik
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                250 Ekstra Ekstra Bonus Mil
              </div>
            </>
          )}

          {/* DOMESTIC PC ECO -- ADVANTAGE -- EXTRA */}
          {owner === 'PC' && brandNamePc === 'ECO' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {owner === 'PC' && brandNamePc === 'ADVANTAGE' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
            </>
          )}
          {owner === 'PC' && brandNamePc === 'EXTRA' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Adet Kabin
                Bagajı (55x40x20)
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Dilediğiniz Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Esnek İade/Değişiklik Hakkı
              </div>
            </>
          )}

          {/*DOMESTIC VF BASIC -- FLEX -- PREMIUM */}
          {owner === 'VF' && brandName === 'BASIC' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {owner === 'VF' && brandName === 'FLEX' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Kesintili İade Hakkı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik
              </div>
            </>
          )}
          {owner === 'VF' && brandName === 'PREMIUM' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 X 8 Kg El
                Bagajı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Sandviç İkramı
              </div>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Dilediğiniz Koltuk Seçimi
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz Değişiklik
              </div>
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Esnek İade/Değişiklik Hakkı
              </div>
            </>
          )}

          {/*DOMESTIC XQ SUNVALUE -- SUNECOPLUS -- SUNCOMFORT */}
          {brandName === 'SUNVALUE' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
              </div>
              <div className='flex items-center gap-2 text-red-800'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik yapılamaz &amp; İade edilemez
              </div>
            </>
          )}
          {brandName === 'SUNECOPLUS' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
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
          {brandName === 'SUNCOMFORT' && (
            <>
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Parça 8 kg
                Kabin bagaj (55x40x23cm)
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
        </>
      )}
      {/* INT SABREATPCO ENGLISH*/}
      {!isDomestic &&
        ((operatingAirlineInt !== 'AF' &&
          operatingAirlineInt !== 'KL' &&
          operatingAirlineInt !== 'LH' &&
          operatingAirlineInt !== 'BA' &&
          operatingAirlineInt !== 'EY' &&
          operatingAirlineInt !== 'EK') ||
          marketingAirlineInt !== operatingAirlineInt) && (
          <>
            {brandFeatures.map((feature: string) => (
              <div key={feature} className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                {feature}
              </div>
            ))}
          </>
        )}
      {!isDomestic && (
        <>
          {brandName === 'BASIC' && operatingAirlineInt !== 'BA' && (
            <div className='flex items-center gap-2 text-red-600'>
              <IoClose size={20} className='text-red-800' />
              Değişiklik yapılamaz &amp; İade edilemez
            </div>
          )}
          {operatingAirlineInt === 'AA' && brandNameInt !== 'AAAT-FBUSFL' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              2x32 Kg Bagaj Hakkı
            </div>
          )}
          {operatingAirlineInt === 'AA' && brandNameInt === 'AAAT-FFIRFL' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              3x32 Kg Bagaj Hakkı
            </div>
          )}
          {operatingAirlineInt === 'AA' &&
            (brandNameInt === 'AAAT-PEC' || brandNameInt === 'AAAT-PECFL') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                2x23 Kg Bagaj Hakkı
              </div>
            )}
          {operatingAirlineInt === 'UA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />1 X 8 kg El Bagajı
            </div>
          )}
          {operatingAirlineInt === 'QR' ||
            (operatingAirlineInt === 'SQ' && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 parça X 7 kg
                El Bagajı
              </div>
            ))}
          {operatingAirlineInt === 'LO' ||
            (operatingAirlineInt === 'AA' && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Kabin Bagajı
              </div>
            ))}
          {operatingAirlineInt === 'LO' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Ücretli Koltuk Seçimi
            </div>
          )}
          {operatingAirlineInt === 'UA' ||
            operatingAirlineInt === 'AA' ||
            (operatingAirlineInt === 'LO' &&
              (brandNameInt === 'SAVER-PCID' ||
                brandNameInt === 'STANDARD-PCID') && (
                <div className='flex items-center gap-2'>
                  <MdCheck size={18} className='text-green-800' />
                  Ekstra Mil Kazancı
                </div>
              ))}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF41-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              50 Ekstra Mil
            </div>
          )}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF21-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Esnek Değişim (Uçuşa kadar)
            </div>
          )}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF21-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              %100 Ekstra Mil Kazancı
            </div>
          )}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF01-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              %125 Ekstra Mil Kazancı
            </div>
          )}
          {operatingAirlineInt === 'LO' && brandNameInt === 'FLEX-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              %150 Ekstra Mil Kazancı
            </div>
          )}
          {operatingAirlineInt === 'LO' && brandNameInt === 'FLEX-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Esnek Değişim (Uçuşa kadar)
            </div>
          )}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF21-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Ücretsiz Koltuk Seçimi
            </div>
          )}
          {operatingAirlineInt === 'SQ' && brandNameInt === 'FF31-PCID' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              75 Ekstra Mil
            </div>
          )}
          {operatingAirlineInt === 'QR' && brandNameInt === 'CLASSIC-PCID' && (
            <div className='flex items-center gap-2 text-red-600'>
              <IoClose size={20} className='' />
              Cezalı İade
            </div>
          )}
          {operatingAirlineInt === 'QR' &&
            brandNameInt === 'CONVENIENC-PCID' && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='' />
                Cezalı İade
              </div>
            )}
          {operatingAirlineInt === 'QR' && brandNameInt === 'COMFORT-PCID' && (
            <div className='flex items-center gap-2 text-green-800'>
              <MdCheck size={18} className='text-green-800' />
              Cezasız İade (Son 12 Saate Kadar)
            </div>
          )}
          {operatingAirlineInt === 'QR' && brandNameInt === 'CLASSIC-PCID' && (
            <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
          )}
          {operatingAirlineInt === 'QR' &&
            (brandNameInt === 'CONVENIENC-PCID' ||
              brandNameInt === 'COMFORT-PCID') && (
              <div>Uçuştan Önce Koltuk Seçimi (Ücretli)</div>
            )}
          {operatingAirlineInt === 'UA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Özel Koltuk Seçimi (Ücretli)
            </div>
          )}
          {operatingAirlineInt === 'UA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Mil veya ek ödeme ile kabin yükseltme
            </div>
          )}
          {operatingAirlineInt === 'UA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Öncelikli Boarding (Ücretli)
            </div>
          )}
          {operatingAirlineInt === 'UA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              İkinci ek bagaj (Ücretli)
            </div>
          )}
          {operatingAirlineInt === 'AA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Sandviç İkramı
            </div>
          )}
          {operatingAirlineInt === 'AA' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />
              Film, Dizi, Müzik, Oyun
            </div>
          )}
          {operatingAirlineInt === 'AA' && brandNameInt !== 'AAAT-BASIC' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' /> Ücretsiz Koltuk
              Seçimi
            </div>
          )}
          {operatingAirlineInt === 'AA' && brandNameInt === 'AAAT-BASIC' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' /> Ücretsiz Koltuk
              Seçimi
            </div>
          )}
          {operatingAirlineInt === 'AA' &&
            (brandNameInt === 'AAAT-PEC' ||
              brandNameInt === 'AAAT-PECFL' ||
              brandNameInt === 'AAAT-FFIRFL' ||
              brandNameInt === 'AAAT-FBUSFL') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Öncelikli Check-In Hakkı
              </div>
            )}
          {operatingAirlineInt === 'AA' &&
            (brandNameInt === 'AAAT-PEC' ||
              brandNameInt === 'AAAT-PECFL' ||
              brandNameInt === 'AAAT-FFIRFL' ||
              brandNameInt === 'AAAT-FBUSFL') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Esnek Değişim (Uçuşa kadar)
              </div>
            )}
          {operatingAirlineInt === 'AA' &&
            (brandNameInt === 'AAAT-FFIRFL' ||
              brandNameInt === 'AAAT-FBUSFL') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Esnek İptal (Uçuşa kadar)
              </div>
            )}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'BIZSTAND' || brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />2 parça X 32 kg
                Kabin bagaj
              </div>
            )}
          {/* KLM & Air France - Koltuk Seçimi */}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            brandCode === 'LIGHT' && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Koltuk Seçimi
              </div>
            )}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'FLEX' ||
              brandCode === 'BIZSTAND' ||
              brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz Koltuk Seçimi
              </div>
            )}
          {/* KLM & Air France - Lounge Erişimi */}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'BIZSTAND' || brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Lounge Erişimi
              </div>
            )}
          {/* KLM & Air France - Değişiklik Kuralları */}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            brandCode === 'LIGHT' && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik Yapılamaz
              </div>
            )}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'STANDARD' || brandCode === 'BIZSTAND') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik
              </div>
            )}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'FLEX' || brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz Değişiklik
              </div>
            )}
          {/* KLM & Air France - İade Kuralları */}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'LIGHT' ||
              brandCode === 'STANDARD' ||
              brandCode === 'BIZSTAND') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                İptal Edilemez
              </div>
            )}
          {(operatingAirlineInt === 'AF' || operatingAirlineInt === 'KL') &&
            (brandCode === 'FLEX' || brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                İade Edilebilir (Uçuşa kadar)
              </div>
            )}
          {/* Lufthansa Airlines */}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' ||
              brandCode === 'FLEX' ||
              brandCode === 'BUSINESS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 Küçük çanta
                (40 x 30 x 10 cm)
              </div>
            )}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' || brandCode === 'FLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 x El bagajı
                (55 x 40 x 23 cm)
              </div>
            )}
          {operatingAirlineInt === 'LH' && brandCode === 'BUSINESS' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />2 x El bagajı (55
              x 40 x 23 cm)
            </div>
          )}
          {operatingAirlineInt === 'LH' && brandCode === 'BUSINESS' && (
            <div className='flex items-center gap-2'>
              <MdCheck size={18} className='text-green-800' />2 parça X 32 kg
              Kabin bagaj
            </div>
          )}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' ||
              brandCode === 'FLEX' ||
              brandCode === 'BUSINESS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
            )}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' ||
              brandCode === 'FLEX' ||
              brandCode === 'BUSINESS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Mil Kazanımı
              </div>
            )}
          {operatingAirlineInt === 'LH' && brandCode === 'BUSINESS' && (
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
          {operatingAirlineInt === 'LH' && brandCode === 'BUSINESS' && (
            <div className='flex items-center gap-2 text-red-600'>
              <IoClose size={20} className='text-red-800' />
              Değişiklik Yapılamaz
            </div>
          )}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' || brandCode === 'FLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik
              </div>
            )}
          {operatingAirlineInt === 'LH' &&
            (brandCode === 'CLASSIC' || brandCode === 'BUSINESS') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                İptal Edilemez
              </div>
            )}
          {operatingAirlineInt === 'LH' && brandCode === 'FLEX' && (
            <div className='flex items-center gap-2 text-red-600'>
              <IoClose size={20} className='text-red-800' />
              Cezalı İade Edilebilir (Uçuşa kadar)
            </div>
          )}
          {/* British Airways */}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'NOBAG' ||
              brandCode === 'BAG' ||
              brandCode === 'ECONSEL' ||
              brandCode === 'ECONFLEX' ||
              brandCode === 'BUSINESS' ||
              brandCode === 'BIZSEL' ||
              brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 x El bagajı 8
                Kg
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'BUSINESS' ||
              brandCode === 'BIZSEL' ||
              brandCode === 'BIZFLEX') && (
              <>
                <div className='flex items-center gap-2'>
                  <MdCheck size={18} className='text-green-800' />2 parça X 32
                  kg Kabin bagaj
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
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'NOBAG' || brandCode === 'BAG') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Koltuk Seçimi
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'ECONSEL' || brandCode === 'ECONFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Koltuk Seçimi
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
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
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'NOBAG' ||
              brandCode === 'BAG' ||
              brandCode === 'BUSINESS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Uçuş Öncesi Ücretli Değişiklik (48 Saate Kadar)
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'ECONSEL' ||
              brandCode === 'ECONFLEX' ||
              brandCode === 'BIZSEL' ||
              brandCode === 'BIZFLEX') && (
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Uçuş Öncesi Cezasız Değişiklik (48 Saate Kadar)
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'NOBAG' ||
              brandCode === 'BAG' ||
              brandCode === 'BUSINESS' ||
              brandCode === 'BIZSEL') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                İptal Edilemez
              </div>
            )}
          {operatingAirlineInt === 'BA' &&
            (brandCode === 'ECONSEL' || brandCode === 'ECONFLEX') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                Cezalı İade Edilebilir (Uçuşa kadar)
              </div>
            )}
          {operatingAirlineInt === 'BA' && brandCode === 'BIZFLEX' && (
            <div className='flex items-center gap-2 text-green-800'>
              <MdCheck size={18} className='text-green-800' />
              Cezasız İade Edilebilir (48 Saate Kadar)
            </div>
          )}
          {/* Emirates Airlines */}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLEX' || brandCode === 'ECOFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 x El bagajı 7
                Kg
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'BSFLEX' || brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />2 x El bagajı 7
                Kg
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLEX' ||
              brandCode === 'ECOFLXPLUS' ||
              brandCode === 'BSFLEX' ||
              brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz İkram
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'BSFLEX' || brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Business Lounge
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLEX' ||
              brandCode === 'ECOFLXPLUS' ||
              brandCode === 'BSFLEX' ||
              brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLEX' || brandCode === 'BSFLEX') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLXPLUS' || brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretsiz Değişiklik
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLEX' || brandCode === 'BSFLEX') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                Cezalı İade Edilebilir
              </div>
            )}
          {operatingAirlineInt === 'EK' &&
            (brandCode === 'ECOFLXPLUS' || brandCode === 'BSFLXPLUS') && (
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Cezasız İade Edilebilir
              </div>
            )}
          {/* Etihad Airways */}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YBASIC' ||
              brandCode === 'YVALUE' ||
              brandCode === 'YCOMFORT' ||
              brandCode === 'YDELUXE' ||
              brandCode === 'JVALUE' ||
              brandCode === 'JCOMFORT' ||
              brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />1 x El bagajı 7
                Kg
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'JVALUE' ||
              brandCode === 'JCOMFORT' ||
              brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Öncelikli Check-in
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'JCOMFORT' || brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Business Lounge
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
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
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YCOMFORT' ||
              brandCode === 'YDELUXE' ||
              brandCode === 'JCOMFORT' ||
              brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Standart Koltuk Seçimi
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YBASIC' || brandCode === 'YVALUE') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                Değişiklik Yapılamaz
              </div>
            )}
          {/* {!(brandNameInt !== 'EF' && operatingAirlineInt !== 'PC') &&
                  baggageAllowance.maxWeight.value <= 15 && (
                    <div className='flex items-center gap-2 text-red-600'>
                      <IoClose size={20} className='text-red-800' />
                      Değişiklik yapılamaz &amp; İade edilemez
                    </div>
                  )} */}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YBASIC' ||
              brandCode === 'YVALUE' ||
              brandCode === 'JVALUE') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                İade Edilemez
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YCOMFORT' ||
              brandCode === 'JVALUE' ||
              brandCode === 'JCOMFORT') && (
              <div className='flex items-center gap-2'>
                <MdCheck size={18} className='text-green-800' />
                Ücretli Değişiklik (48 Saate Kadar)
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YDELUXE' || brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Cezasız Değişiklik (48 Saate Kadar)
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YCOMFORT' || brandCode === 'JCOMFORT') && (
              <div className='flex items-center gap-2 text-red-600'>
                <IoClose size={20} className='text-red-800' />
                Cezalı İade (48 Saate Kadar)
              </div>
            )}
          {operatingAirlineInt === 'EY' &&
            (brandCode === 'YDELUXE' || brandCode === 'JDELUXE') && (
              <div className='flex items-center gap-2 text-green-800'>
                <MdCheck size={18} className='text-green-800' />
                Cezasız İade (48 Saate Kadar)
              </div>
            )}
        </>
      )}
    </div>
  )
}
