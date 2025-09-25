import { AgreementContentTableWrapper } from './table'

type IProps = {
  agencyDocumentNo?: string
  agencyEmail?: string
  agencyFax?: string
  agencyPhone?: string
  agencyTitle?: string
  bookingCode?: string
  customerAddress?: string
  customerEmail?: string
  customerFax?: string
  customerFullName?: string
  customerID?: string
  customerInvoiceInfo?: string
  customerPhone?: string
  isHotelPartialPayment?: boolean
}

export const HotelAgreementContent: React.FC<IProps> = ({
  agencyDocumentNo = '',
  agencyEmail = '',
  agencyFax = '',
  agencyPhone = '',
  agencyTitle = '',
  customerAddress = '',
  customerEmail = '',
  customerFax = '',
  customerFullName = '',
  customerID = '',
  customerInvoiceInfo = '',
  customerPhone = '',
  isHotelPartialPayment = false,
}) => {
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='fs-4 text-center'>OTEL MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
      <p>
        <strong>MADDE 1 - KONU</strong>
      </p>
      <p>
        İşbu sözleşmenin konusu, SATICI&apos;nın ALICI&apos;ya satışını yaptığı,
        aşağıda nitelikleri ve satış fiyatı belirtilen hizmetin satışı ve ifası
        ile ilgili olarak tarafların hak ve yükümlülüklerini kapsamaktadır.
      </p>
      <p>
        <strong>MADDE 2 - SATICI BİLGİLERİ:</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>SEYAHAT ACENTASI BELGE NO</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>{agencyDocumentNo}</p>
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>SEYAHAT ACENTASI ÜNVANI</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>{agencyTitle}</p>
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>ŞİRKET ÜNVANI</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>Yeni Karamürsel Turizm Ltd. Şti.</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>ADRESİ</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                İcadiye Mah. Cumhuriyet Cad. Huzur Apt. Blok No: 167İç Kapı No:
                5 Üsküdar/İSTANBUL
              </p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>MERSİS NO / VERGİ NO</strong>
              </p>
            </td>
            <td valign='top'>
              <p>0948-0064-0970-0018/9480064097</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>TEL</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyPhone}</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>FAKS</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyFax}</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>EPOSTA</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyEmail}</p>
            </td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>MADDE 3 - ALICI</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>ADI SOYADI</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerFullName}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>T.C. KİMLİK NO</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerID}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>ADRES</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerAddress}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>FATURA BİLGİSİ</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerInvoiceInfo}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>TEL</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerPhone}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>FAKS</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerFax}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>E-POSTA</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerEmail}
            </td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>MADDE 4 - SÖZLEŞME KONUSU HİZMET BİLGİLERİ</strong>
      </p>
      <p>
        Hizmetin türü, satış bedeli, ödeme şekli seçilen hizmetin işlem koduna
        göre aşağıdaki gibidir.
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td valign='top'>
              <p>
                <strong>REZERVASYON NO</strong>
              </p>
            </td>
            <td valign='top'>@Model.BookingCode</td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>HİZMET / ÜRÜN ADI</strong>
              </p>
            </td>
            <td valign='top'>@Model.HotelName</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>SATIŞ FİYATI (KDV DAHİL)</strong>
              </p>
            </td>
            <td valign='top'>@Model.Total</td>
          </tr>
          @if(Model.IptalGuvenceBedeli)
          {
            <tr>
              <td valign='top'>
                <p>
                  <strong>İPTAL GÜVENCE BEDELİ</strong>
                </p>
              </td>
              <td valign='top'>@Model.IptalGuvenceBedeliTutar</td>
            </tr>
          }
          {isHotelPartialPayment && (
            <>
              <tr>
                <td valign='top'>
                  <p>
                    <strong>ÇEKİLEN RAKAM</strong>
                  </p>
                </td>
                <td valign='top'>@Model.CekilenRakam</td>
              </tr>
              <tr>
                <td valign='top'>
                  <p>
                    <strong>KALAN RAKAM</strong>
                  </p>
                </td>
                <td valign='top'>@Model.KalanRakam</td>
              </tr>
              <tr>
                <td valign='top'>
                  <p>
                    <strong>İŞLEM TARİHİ</strong>
                  </p>
                </td>
                <td valign='top'>@Model.IslemTarihi</td>
              </tr>
              <tr>
                <td valign='top'>
                  <p>
                    <strong>ÖDEMENİN YAPILMASI GEREKEN TARİH</strong>
                  </p>
                </td>
                <td valign='top'>@Model.OdemeninYapilmasiGerekenTarih</td>
              </tr>
              <tr>
                <td valign='top'>
                  <p>
                    <strong>KALAN ÖDEME ŞEKLİ</strong>
                  </p>
                </td>
                <td valign='top'>
                  Kalan tutarın ödeme işleminde ; ödemenin yapıldığı güne ait
                  koşullar geçerlidir.Varsa vade farkı yansıltılacaktır.
                </td>
              </tr>
            </>
          )}
          <tr>
            <td valign='top'>
              <p>
                <strong>ÖDEME ŞEKLİ</strong>
              </p>
            </td>
            <td valign='top'>@Model.PaymentType</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>HİZMETİN İFA TARİHİ</strong>
              </p>
            </td>
            <td valign='top'>@Model.ReservationDate</td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>MADDE 5 - GENEL HÜKÜMLER</strong>
      </p>
      <p>
        <strong>5.1</strong>
        {`ALICI, Madde 4'te belirtilen sözleşme konusu hizmetin nitelikleri, satış
        fiyatı ve ödeme şekli ile ifaya ilişkin tüm ön bilgileri okuyup bilgi
        sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini kabul ve
        beyan eder.`}
      </p>
      <p>
        <strong>5.2</strong>
        SATICI, sözleşme konusu hizmetin ayıplı olması nedeniyle sorumludur.
      </p>
      <p>
        <strong>5.3</strong>
        {`Sözleşme konusu hizmet, ALICI'dan başka bir kişi tarafından kullanılması
        durumunda, söz konusu kişinin ifayı kabul etmemesinden SATICI sorumlu
        değildir.`}
      </p>
      <p>
        <strong>5.4</strong>
        Sözleşme konusu hizmetin ifası için işbu sözleşmenin, imzalı nüshasının
        SATICI ya ulaştırılmış olması ve bedelinin tercih edilen ödeme şekli ile
        ödenmiş olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya
        banka kayıtlarında iptal edilir ise, SATICI hizmetin ifa yükümlülüğünden
        kurtulmuş kabul edilir.
      </p>
      <p>
        <strong>5.5</strong>
        {`Hizmetin ifasından sonra ALICI' ya ait kredi kartının ALICI'nın
        kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya
        hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans
        kuruluşunun hizmet bedelini SATICI' ya ödememesi halinde, ALICI doğan
        zararlardan sorumludur.`}
      </p>
      <p>
        <strong>5.6</strong>
        {`İşbu sözleşme, ALICI tarafından imzalanıp SATICI'ya ulaştırılmasından
        veya elektronik ortamda oluşturulmuşsa ALICI tarafından onaylanmasından
        sonra geçerlilik kazanır.`}
      </p>
      <p>
        <strong>5.7</strong>
        İşbu sözleşmeye 3 yıl süre ile üyelik hesabından ulaşabilecektir. Ön
        bilgiler ve mesafeli sözleşmedeki veri girişi hataları ……… internet
        adresine bildirilerek düzeltilebilir.
      </p>
      <p>
        <strong>MADDE 6 - İPTAL - VAZGEÇME - DEĞİŞİKLİKLER</strong>
      </p>
      <p>
        <strong>6.1</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>REZERVASYON NO</strong>
              </p>
            </td>
            <td valign='top'>@Model.BookingCode</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>HİZMET / ÜRÜN ADI</strong>
              </p>
            </td>
            <td valign='top'>@Model.HotelName</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>SATIŞ FİYATI (KDV DAHİL)</strong>
              </p>
            </td>
            <td valign='top'>@Model.Total</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>ÖDEME ŞEKLİ</strong>
              </p>
            </td>
            <td valign='top'>@Model.PaymentType</td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>HİZMETİN İFA TARİHİ</strong>
              </p>
            </td>
            <td valign='top'>@Model.ReservationDate</td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>İPTAL - VAZGEÇME - DEĞİŞİKLİKLER</strong>
      </p>
      <p>
        {`ALICI'nın Mesafeli Sözleşmeler Yönetmeliği'nin 15. Maddesinin g fıkrası
        uyarınca cayma hakkı bulunmamaktadır fakat SATICI tarafından müşteri
        memnuniyetini sağlamak amacıyla ALICI' ya aşağıda belirtilen, iptal
        vazgeçme ve değişiklik yapma hakları tanınmaktadır:`}
      </p>
      <p>
        {`Bu rezervasyonda 'iptal edilemez oda' olarak satın alınan oda tipleri
        için iptal ve değişiklik mümkün değildir. Yapılacak iptal ve değişiklik
        taleplerinde herhangi bir ücret iadesi yapılmamaktadır.`}
      </p>
      <p>
        <strong>6.2</strong>
        {`SATICI VEYA SAĞLAYICI, gerekli tüm özeni göstermiş olmasına rağmen ilan
        ettiği veya kayıt aldığı hizmetleri devamına engel teşkil eden mücbir
        sebepler veya hizmet sağlayıcılarından, konaklanacak otellerden veya
        üçüncü kişilerden kaynaklı durumlarda sözleşmeyi kısmen veya tamamen
        iptal edebilir. Bu durumun ALICI' ya en kısa sürede bildirmesi gerekir.
        ALICI, bu değişiklik ve iptalleri kabul etmediğini yazılı olarak
        bildirdiği taktirde rezervasyonu iptal edip, kullanmadığı tüm hizmetleri
        10 gün içinde iade alma hakkına sahiptir.`}
      </p>
      <p>
        <strong>6.3 </strong>
        {`Tesis 0 -12 yaş aralığında bulunan müşterileri için farklı fiyatlar
        uygulayabilir. ALICI, tesisin giriş gününde nüfus cüzdanı/pasaport
        kontrolü yapabileceğini kabul eder. SATICI, çocuk misafirler için
        rezervasyon sırasında verilen bilgilerde yaş farklılığı tespit edildiği
        takdirde ücret farkını ALICI'dan isteme hakkına sahiptir. Ücret farkı
        ALICI tarafından ödenmez ise SATICI sözleşmeyi iptal etme hakkına
        sahiptir. Ayrıca reşit olmayan ve ebeveyniyle birlikte konaklamayan
        çocuklar için noter onaylı muvafakatname zorunludur.`}
      </p>
      <p>
        <strong>6.4 </strong>
        {`ALICI, tesis giriş gününde otele giriş yapamayacağı veya geç giriş
        yapacağı bilgisini tesis ile paylaşmak durumundadır. Aksi durumlarda
        SATICI, ALICI'nın rezervasyonunu iptal etme hakkına sahiptir.`}
      </p>
      <p>
        <strong>6.5 </strong>
        {`ALICI'nın, hizmetin ifa tarihinin bitiminden önce tesisten çıkması
        durumunda konaklamadığı günler için ücret iadesi yapılmaz. Ayrıca ALICI
        konakladığı tesisi, hizmetin kusurlu olduğundan bahisle terk etmesi
        halinde, tesisi terk ettiğini SATICI yetkilisine ve konakladığı tesise
        sebepleri ile birlikte tesisi terk ettiği gün yazılı olarak bildirmek
        zorundadır. Aksi takdirde ALICI tesisi terk etmiş sayılmaz ve hizmeti
        alıp kullanmış addolunur. ALICI(lar), otele varış saatleri ne olursa
        olsun odalara yerleşmenin en erken 14.00’de mümkün olabileceğini, çıkış
        günü ise tesisten ayrılış saatine bakılmaksızın odaların en geç saat
        12.00’de boşaltılması gerektiğini ve tesiste alacakları ekstra
        yiyecek-içecek ve sistem dışı hizmetlerin ücretlerinin kendilerine ait
        olduğunu şimdiden kabul etmiş sayılırlar. Mücbir sebepler; olumsuz hava
        koşulları, yol engeli, terör, grev-lokavt, savaş ihtimali, sel, yangın,
        öngörülemez teknik hususlar, konaklama tesisinden kaynaklı nedenler vb.
        haller mücbir sebep sayılıp bu gibi nedenler ile konaklamanın
        başlamaması veya devamına engel teşkil eden hallerden dolayı SATICI
        konaklamayı iptal edebilir veya aynı kategori ve nitelikte aynı bölgede
        veya başka bir bölgede başka konaklama tesisi ile değiştirebilir. Bu
        gibi durumlarda ALICI'nın tazminat hakkı yoktur. Hava koşullarının uygun
        olmaması, kar yağışının olmaması gibi durumlar mücbir sebep teşkil
        etmez, iptal nedeni oluşturmaz. ALICI konaklama yapmasa dahi tüm bedeli
        ödemekle yükümlüdür. Anne ve babası ile birlikte seyahat etmeyen, tek
        ebeveyni yanında olan ve/veya ebeveyni ile aynı soyadını taşımayan reşit
        olmayan çocuklar için, resmi vasisi/ebeveyni tarafından verilen
        konaklama için gerekli noter onaylı muvafakatnamenin yanında
        bulundurulması zorunludur.`}
      </p>
      <p>
        <strong>6.6 </strong>
        Sözleşmenin 6.1. maddesi saklı kalmak üzere, SATICI kendi inisiyatifinde
        değişiklik hakkı tanır ise, tarih ve tesis değişiklikleri, Müşteri
        çıkarma talepleri iptal hükmünde olup, iptale ilişkin şekil ve şartlar
        uygulanır. Yeni rezervasyon, değişikliğin yapıldığı günün kampanya ve
        ödeme koşullarına göre yapılır.
      </p>
      <p>
        <strong>6.7 </strong>
        Sözleşmenin 6.1. Maddesi saklı kalmak üzere, SATICI kendi inisiyatifinde
        değişiklik hakkı tanır ise, Oda Tipi Değişiklikleri ve Müşteri ekleme
        taleplerinde, rezervasyonun kampanya ve ödeme koşulları, değişikliğin
        yapıldığı günün koşullarına göre güncellenir.
      </p>
      <p>
        <strong>6.8 </strong>
        Sözleşmenin 6.1. Maddesi saklı kalmak üzere, SATICI kendi inisiyatifinde
        değişiklik hakkı tanır ise, iki veya daha fazla kişinin konakladığı
        rezervasyonlarda, bir kişinin ismi değişmesi durumunda, rezervasyonun
        kampanya ve ödeme koşulları, değişikliğin yapıldığı günün koşullarına
        göre güncellenir. Tek kişilik (Single) konaklamalarda isim değişikliği
        iptal hükmündedir.
      </p>
      <p>
        <strong>6.9 </strong>
        Rezervasyon sırasında isim ve soyisimlerde yapılan tipografik hatalar
        (harf ve yazım hataları) kesinti ya da ceza alınmadan düzeltilir.
      </p>
      <p>
        <strong>6.10 </strong>
        Sözleşmenin 6.1. Maddesi saklı kalmak üzere, SATICI kendi inisiyatifinde
        değişiklik hakkı tanır ise, İlk değişiklikten sonra yapılacak tüm
        değişiklik işlemlerinde, her bir işlem için 50 TL işlem ücreti alınır.
      </p>
      <p>
        <strong>6.11 </strong>
        “No-show” (geç giriş veya hiç giriş yapılmaması) halinde ALICI,
        başlangıç saatinden itibaren 24 saat içinde hizmete tekrar iştirak
        edeceğini yazılı olarak bildirmezse YKM rezervasyonu iptal edebilir; bu
        durumda alıcıya herhangi bir iade yapılmaz.
      </p>
      <p>
        <strong>6.12 </strong>
        Erken rezervasyon, özel dönem (yılbaşı, sömestir, bayram vb.) ve
        promosyonlu ürünlerde iptal ve iade yapılamaz; “iptal edilemez” ibareli
        fiyatlarda iptal/değişiklik/iade yoktur.
      </p>
      <p>
        <strong>6.13 </strong>
        İadeler banka süreçlerine tabidir; taksitli ödemelerin iadesi bankanın
        kurallarına göre ve yine taksitli olarak yapılabilir; YKM bankanın
        işleyiş süreçlerine müdahale edemez.
      </p>
      <p>
        <strong>6.14 </strong>
        Hediye çeki/kuponların kullanılmayan kısmı için nakit iade yapılmaz;
        mümkünse çek/kupon süresi içinde alıcıya yeniden kullanım imkanı
        tanınacaktır.
      </p>
      <p>
        <strong>6.15 </strong>
        İptalin iade kapsamına girdiği hallerde (tesis/tedarikçi politikası
        gereği veya Satıcı’nın istisnai onayıyla) toplam hizmet bedelinin %2’si
        oranında servis bedeli alıcıdan kesilecektir.
      </p>
      <p>
        <strong>MADDE 7 - GENEL HÜKÜMLER</strong>
      </p>
      <p>
        <strong>7.1</strong>
        SATICI ile ALICI arasında kayıt esnasında akit olunan işbu sözleşme
        hükümleri ALICI tarafından okunmuş ve kendisi ile birlikte aynı hizmeti
        alan diğer şahısların adına da aynı şartlar altında kayıtlarının
        yapılmasını talep ve kabul ederek onaylanmıştır.
      </p>
      <p>
        <strong>7.2</strong>
        SATICI hizmeti satın alan ALICILARLA, konaklama tesisleri, taşıyıcı
        firmalar ve gezi ile ilgili diğer hizmetleri sunan her türlü üçüncü
        şahıs ve tüzel kişiler nezdinde hizmet veren konumundadır. Bu nedenle
        müracaat ile geziye kayıt olan ALICILARIN SATICI ile taşımayı üstlenen
        müesseseler arasında yapılmış anlaşmalar hilafına, araçların programda
        gösterilen saatte hareket yerinde bulunmamasından, kara, hava ve deniz
        araçlarının her türlü gecikmelerinden, arızalanmalarından, sis, fırtına
        ve her türlü hava koşullarından, yol engeli gibi sebeplerle, yol
        güzergah ve rotalarını değiştirmelerinden, grev, terör, savaş ve savaş
        ihtimali veya bunlara benzer mücbir sebeplerden veya öngöremez teknik
        kusurlardan kaynaklanan maddi ve manevi zararlardan SATICI sorumlu
        değildir.
      </p>
      <p>
        <strong>7.3</strong>
        {`ALICI' nın, satın almış olduğu hizmetin ayıplı olduğundan bahisle, ifayı
        kabul etmemesi halinde, durumu SATICI'ya ve konaklama tesisine yazılı
        olarak bildirmek zorundadır. Aksi halde ALICI ifayı kabul etmemiş
        sayılmaz ve hizmeti kullanmış addolunur. ALICI' nın şikayetçi olduğu
        hususları hizmetin ifası sırasında yazılı olarak yetkiliye bildirmesi
        iyi niyetli tüketicinin özen borcudur.`}
      </p>
      <p>
        <strong>7.4</strong>
        {`Tesis, ALICI'dan rezervasyonun başlayacağı tarih itibariyle otelin ek
        hizmetleri, mini bar ya da oluşabilecek hasarlar için kredi kartı
        bilgisi isteyebilir. Bu ve benzeri ek masrafların paraflytravel.com ile
        bir ilgisi bulunmamaktadır.`}
      </p>
      <p>
        <strong>7.5</strong>
        {`SATICI, ALICI'NIN hizmeti ile ilgili olarak fatura talebini aldığı zaman
        itibariyle, rezervasyonun çıkış tarihinden 7-14 iş günü içerisinde
        hizmete ilişkin düzenlenen faturayı ALICI'nın yukarıda belirtilen
        adresine gönderir.`}
      </p>
      <p>
        <strong>7.6</strong>
        {`7194 Sayılı Dijital Hizmet Vergisi İle Bazı Kanunlarda Ve 375 Sayılı
        Kanun Hükmünde Kararnamede Değişiklik Yapılması Hakkında Kanun’un 9.
        Maddesi ile eklenen "Konaklama Vergisi" uyarınca Otel, motel, tatil
        köyü, pansiyon, apart otel, misafirhane, kamping, dağ evi, yayla evi
        gibi konaklama tesislerinde verilen geceleme hizmeti ile bu hizmetle
        birlikte satılmak suretiyle konaklama tesisi bünyesinde sunulan diğer
        tüm hizmetler (yeme, içme, aktivite, eğlence hizmetleri ve havuz, spor,
        termal ve benzeri alanların kullanımı gibi) konaklama vergisine tabidir.
        Konaklama vergisinin mükellefi birinci fıkrada belirtilen hizmetleri
        sunanlar olup vergiyi doğuran olay ise konaklama hizmetlerinin ilgili
        tesis tarafından sunulmasıdır. Konaklama vergisinin oranı 31/12/2020
        tarihine kadar % 1 olarak uygulanır. Bu tarihten sonra Kanun ile
        belirlenen ilgili mevcut konaklama vergisi oranında ve/veya tahsil
        esasında bir değişiklik olması, yönetmelik veya tebliğ yayınlanması
        durumunda yeni uygulamaya göre güncelleme yapılacaktır. Tüketici, yasal
        mevzuat uyarınca tesise girişte konaklama vergisi ödeyeceği konusunda
        işbu Sözleşme ile bilgilendirilmiştir. İlgili tesise girişte tesis
        tarafından talep edilecek bu konaklama vergisinin YKM Turizm ile hiçbir
        ilgisi bulunmamaktadır. Tüketici, tesise ödemiş olduğu ve Kanun’dan
        kaynaklanan konaklama vergisinin kendisine iade edilmesine ilişkin
        herhangi bir talebi YKM Turizm’e yöneltemez.`}
      </p>
      <p>
        <strong>7.7</strong>
        {`Bu Sözleşmeye yazılı olmayan hususlarda 1618 Sayılı yasa, 6502 Sayılı
        Tüketicinin Korunması Hakkında Kanun, 6098 sayılı Türk Borçlar Kanunu,
        6102 sayılı Türk Ticaret Kanunu, IATA, IHA, UFTAA Konvensiyon hükümleri,
        Sivil Havacılık Kanunu, Türkiye'nin dahil olduğu uluslar arası
        sözleşmeler ve bunlara bağlı olarak çıkarılmış Tüzük, Yönetmelik,
        Genelge ve Tebliğler ile Uluslararası kabul görülen Frankfurter
        Tabelle'nin Türkiye' de tatbik olunan TÜRSAB Kütahya Çizelgesi hükümleri
        tatbik olunacaktır. TÜKETİCİ'nin, SATICI ile sorunları olur ise, sorunu
        SATICI'nın çözememesi durumda, 2022 yılı için Tüketici Hakem Heyetlerine
        yapılacak başvurularda, büyükşehir statüsünde olan illerde değeri 10 bin
        280 (Onbinikiyüzseksen) liranın altında bulunan uyuşmazlıklarda ilçe
        tüketici hakem heyetleri, büyükşehir statüsünde olan illerde değeri 10
        bin 280 (Onbinikiyüzseksen) ile 15 bin 430 (Onbeşbindörtyüzotuz) lira
        arasındaki uyuşmazlıklarda il tüketici hakem heyetleri ve büyükşehir
        statüsünde olmayan illerin merkezlerinde ve bağlı ilçelerde değeri 15
        bin 430 (Onbeşbindörtyüzotuz) liranın altında bulunan uyuşmazlıklarda il
        tüketici hakem heyetleri görevlidir. Bu değerlerin üzerindeki
        uyuşmazlıklar için tüketici hakem heyetlerine başvuru yapılamamaktadır.
        Söz konusu uyuşmazlıkların çözümü için 6502 sayılı Kanun’un 73/A maddesi
        kapsamında sırasıyla dava şartı arabuluculuk müessesesine ve tüketici
        mahkemelerine; tüketici mahkemeleri bulunmayan yerlerde ise asliye hukuk
        mahkemelerine başvurulması gerekmektedir. Başvurular, tüketicinin
        yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki
        tüketici hakem heyetine ve Tüketici Mahkemelerine yapılabilir.`}
      </p>
      <p>
        <strong>7.8</strong>
        Taraflar arasında çıkacak uyuşmazlıklarda Satıcı’nın dijital kayıtları
        (arama kayıtları, e-postalar, sistem logları vb.) kesin delil sayılır.
      </p>
      <p>
        <strong>MADDE 8 - OTELLE İLGİLİ BİLGİLENDİRMELER</strong>
      </p>
      <p>
        <strong>8.1</strong>
        ALICI ilgili otelden konaklama satın alırken aşağıdaki tüm
        bilgilendirmelerin kendisine yapıldığını ve kabul ederek satın alma
        işlemini gerçekleştirdiğini kabul ve taahhüt etmiştir.
      </p>
      <p>
        <strong>8.2</strong>
        {`Oda blokajları otel tarafından yapılmakta olup, SATICI'un müdahale
        imkanı bulunmamaktadır.`}
      </p>
      <p>
        <strong>8.3</strong>
        Standart oda rezervasyonlarında french bed veya twin bed talepleri
        otellere bildirilmekte,ancak dönemsel yoğunluğu dikkate alınarak
        müsaitlik durumu Otel yetkilileri tarafından belirlenmektedir.
      </p>
      <p>
        <strong>8.4</strong>
        Üç kişilik konaklamalarda sofa bed (açılır kapanır yatak) verilmektedir.
      </p>
      <p>
        <strong>8.5</strong>
        {`Çocuklu misafirler için bebek yatağı garantisi verilmemektedir.
        Rezervasyon esnasında Otel'e not olarak iletilmekte ve otelin
        müsaitliğine göre talep karşılanabilmektedir. SATICI'un bir sorumluluğu
        yoktur`}
      </p>
      <p>
        <strong>8.6</strong>
        {`Otel'in açılış ve kapanış tarihleri otel yönetimi tarafından
        belirlenmektedir. Olası bir gecikme veya erken kapanma gibi durumlarda
        sunulacak alternatifler Otel'inin insiyatifindedir.`}
      </p>
      <p>
        <strong>8.7</strong>
        {`İptal ve değişiklik talebi durumunda SATICI'un sorumluluğu bunu Otel'e
        iletmekle sınırlıdır. Otel'den gelen bilgi ve onay doğrultusunda işlem
        yapılabilmektedir.`}
      </p>
      <p>
        <strong>8.8</strong>
        ALICI tarafından uygunsuz hava koşulları, yol durumu v.s. herhangi bir
        nedenle otele geç giriş yapılması durumunda otelin onayı ve kuralları
        doğrultusunda işlem yapılabilir.
      </p>
      <p>
        <strong>8.9</strong>
        {`İptal ve değişiklik talebi durumunda SATICI'un sorumluluğu bunu Otel'e
        iletmekle sınırlıdır. Otel'den gelen bilgi ve onay doğrultusunda işlem
        yapılabilmektedir.`}
      </p>
      <p>
        <strong>8.10</strong> Otel değişikliği talepleri kabul edilmemekle
        birlikte, SATICI ve/veya otel tarafından uygun bulunması halinde o günün
        koşullarındaki otel fiyatları geçerli olmaktadır.
      </p>
      <p>
        <strong>8.11</strong>{' '}
        {`Otelin dönemsel olarak veya kendi inisiyatifi ile
        uygulamaya soktuğu konsept değişikliklerine SATICI'un müdahale hakkı
        bulunmamakta olup, tamamen otelin kendi insiyatifindedir.`}
      </p>
      <p>
        <strong>8.12</strong>{' '}
        {`Otellerde misafirlerin hizmetine sunulan ücretli
        ve ücretsiz aktiviteler, otel yetkilileri tarafından belirlenmektedir.
        SATICI'un herhangi bir müdahalesi yoktur.`}
      </p>
      <p>
        <strong>8.13</strong> Bilgi verilmesi esnasında iletilen tüm bilgiler
        veya fiyatlar rezervasyon anına kadar değişiklik arz edebilir.
        Rezervasyon anındaki bilgi ve fiyatlar geçerlidir.
      </p>
      <p>
        <strong>8.14</strong> Yurtdışı otel satışlarında yukarıdaki maddelere ek
        olarak aşağıdaki hususlar da geçerlidir.Ulusal seferberlik, ayaklanma,
        savaş vs. olumsuz koşullarda ilgili ülkenin resmi otoriteleri tarafından
        verilen bilgiler geçerlidir. Ülkeye giriş çıkış kapatılmadığı ve hava
        yolu uçuşları gerçekleştirildiği durumlarda rezervasyonlar geçerliliğini
        korur, iptal işlemi yapılamaz.
      </p>
      <p>
        <strong>8.15</strong> Oteller giriş çıkış saatleri tamamen otelin
        müsaitliğine bağlıdır. SATICI olarak müdahalemiz veya yaptırım hakkımız
        bulunmadığından, giriş çıkış saatleri konusunda garanti
        verilememektedir.
      </p>
      <p>
        <strong>8.10</strong> Otel değişikliği talepleri kabul edilmemekle
        birlikte, SATICI ve/veya otel tarafından uygun bulunması halinde o günün
        koşullarındaki otel fiyatları geçerli olmaktadır.
      </p>
      <p>
        <strong>8.11</strong>{' '}
        {`Otelin dönemsel olarak veya kendi inisiyatifi ile
        uygulamaya soktuğu konsept değişikliklerine SATICI'un müdahale hakkı
        bulunmamakta olup, tamamen otelin kendi insiyatifindedir.`}
      </p>
      <p>
        <strong>8.12</strong>{' '}
        {`Otellerde misafirlerin hizmetine sunulan ücretli
        ve ücretsiz aktiviteler, otel yetkilileri tarafından belirlenmektedir.
        SATICI'un herhangi bir müdahalesi yoktur.`}
      </p>
      <p>
        <strong>8.13</strong> Bilgi verilmesi esnasında iletilen tüm bilgiler
        veya fiyatlar rezervasyon anına kadar değişiklik arz edebilir.
        Rezervasyon anındaki bilgi ve fiyatlar geçerlidir.
      </p>
      <p>
        <strong>8.14</strong> Yurtdışı otel satışlarında yukarıdaki maddelere ek
        olarak aşağıdaki hususlar da geçerlidir.Ulusal seferberlik, ayaklanma,
        savaş vs. olumsuz koşullarda ilgili ülkenin resmi otoriteleri tarafından
        verilen bilgiler geçerlidir. Ülkeye giriş çıkış kapatılmadığı ve hava
        yolu uçuşları gerçekleştirildiği durumlarda rezervasyonlar geçerliliğini
        korur, iptal işlemi yapılamaz.
      </p>
      <p>
        <strong>8.15</strong> Oteller giriş çıkış saatleri tamamen otelin
        müsaitliğine bağlıdır. SATICI olarak müdahalemiz veya yaptırım hakkımız
        bulunmadığından, giriş çıkış saatleri konusunda garanti
        verilememektedir.
      </p>
      <p>
        <strong>8.16</strong> Bazı yurtdışı otellerde otele giriş esnasında mini
        bar, telefon, internet kullanımı gibi durumlar için ödemeyi garanti
        altına almak amacıyla misafirlerin kredi kartından provizyon
        alınmaktadır. Çıkış esnasında herhangi bir ekstra yok ise kredi
        kartındaki blokaj kaldırılmaktadır.
      </p>
      <p>
        <strong>8.17</strong>{' '}
        {`Bazı oteller konaklayan kişilerden şehir vergisi
        adında vergi almaktadır. Bu vergiler direk totel tarafından konaklama
        aşamasında konaklayan kişilerden alındığından satış fiyatına dahil
        edilmemiştir. ALICI bu durumu bilerek satın alma işlemini
        gerçekleştirmiştir. Bu vergi ortalama 4 Euro'dur.`}
      </p>
      <p>
        <strong>8.18</strong> ALICI satın aldığı ürünle ilgili tüm bilgilerin
        kendisine verildiğini, kendisine bir örneği teslim edilen bu sözleşmeyi
        okuduğunu ve kendisi ile birlikte aynı hizmeti alan diğer şahısların
        adına da aynı şartlar altında kayıtlarının yapılmasını talep ve kabul
        ederek onaylanmıştır.
      </p>
      <p>
        <strong>8.19</strong>{' '}
        {`SATICI kendisinden herhangi bir hizmet satın alan
        ALICI'sının veya ALICl'larının vereceği, e-mail, GSM numarası, adresi
        gibi iletişim kanallarından birine veya tamamına yapacağı duyuru, ilan
        veya reklam çalışmasına yönelik e-mailing, SMS gönderimi, katalog
        gönderimini “Elektronik Ticaretin Düzenlenmesi Kanunu'na”uygun şekilde
        yapmayı taahhüt eder. ALICI SATICI'un kendi iletişim bilgilerine
        yapacağı gönderimleri kabul etmiştir. ALICI(lar) kendi iletişim
        kanallarına yapılan bu duyuruları istememe hakkına sahiptir.
        SATICI,ALICI'sına bu gibi durumlarda herhangi bir ücret ödemeden
        kendisine ait kurumsal elektronik iletişim adresi olan
        operasyon@ykmturizm.com.tr mail adresine veya isteyeceği herhangi bir
        yolla kendisine bildirimde bulunduğu takdirde kendisine yönelik yapılan
        e-mailing, SMS gönderimi ve posta gönderimlerinin sonlandıracağını
        taahhüt eder.`}
      </p>
      <p>
        <strong>8.20</strong>{' '}
        {`Konaklama yapılacak tesisin, ALICI'ların tesise
        kabul edilmesi veya tesisteki konaklamalar ve tesis kuralları ile
        alakalı kısıtlamalar uygulamak veya kontenjan dahil olmak üzere farklı
        konularda ALICI'lara verdiği bilgilerden farklı bilgiler vermek dahil
        olmak, ancak bunlarla sınırlı olmamak üzere, ALICI'lara yönelik
        uygulamaları nedeniyle SATICI’un herhangi bir sorumluluğu
        bulunmamaktadır. Bu talepler doğrudan ilgili tesise yöneltilmelidir.`}
      </p>

      <p>
        <strong>8.16</strong> Bazı yurtdışı otellerde otele giriş esnasında mini
        bar, telefon, internet kullanımı gibi durumlar için ödemeyi garanti
        altına almak amacıyla misafirlerin kredi kartından provizyon
        alınmaktadır. Çıkış esnasında herhangi bir ekstra yok ise kredi
        kartındaki blokaj kaldırılmaktadır.
      </p>
      <p>
        <strong>8.17</strong>{' '}
        {`Bazı oteller konaklayan kişilerden şehir vergisi
        adında vergi almaktadır. Bu vergiler direk totel tarafından konaklama
        aşamasında konaklayan kişilerden alındığından satış fiyatına dahil
        edilmemiştir. ALICI bu durumu bilerek satın alma işlemini
        gerçekleştirmiştir. Bu vergi ortalama 4 Euro'dur.`}
      </p>
      <p>
        <strong>8.18</strong> ALICI satın aldığı ürünle ilgili tüm bilgilerin
        kendisine verildiğini, kendisine bir örneği teslim edilen bu sözleşmeyi
        okuduğunu ve kendisi ile birlikte aynı hizmeti alan diğer şahısların
        adına da aynı şartlar altında kayıtlarının yapılmasını talep ve kabul
        ederek onaylanmıştır.
      </p>
      <p>
        <strong>8.19</strong>{' '}
        {`SATICI kendisinden herhangi bir hizmet satın alan
        ALICI'sının veya ALICl'larının vereceği, e-mail, GSM numarası, adresi
        gibi iletişim kanallarından birine veya tamamına yapacağı duyuru, ilan
        veya reklam çalışmasına yönelik e-mailing, SMS gönderimi, katalog
        gönderimini “Elektronik Ticaretin Düzenlenmesi Kanunu'na”uygun şekilde
        yapmayı taahhüt eder. ALICI SATICI'un kendi iletişim bilgilerine
        yapacağı gönderimleri kabul etmiştir. ALICI(lar) kendi iletişim
        kanallarına yapılan bu duyuruları istememe hakkına sahiptir.
        SATICI,ALICI'sına bu gibi durumlarda herhangi bir ücret ödemeden
        kendisine ait kurumsal elektronik iletişim adresi olan
        operasyon@ykmturizm.com.tr mail adresine veya isteyeceği herhangi bir
        yolla kendisine bildirimde bulunduğu takdirde kendisine yönelik yapılan
        e-mailing, SMS gönderimi ve posta gönderimlerinin sonlandıracağını
        taahhüt eder.`}
      </p>
      <p>
        <strong>8.20</strong>{' '}
        {`Konaklama yapılacak tesisin, ALICI'ların tesise
        kabul edilmesi veya tesisteki konaklamalar ve tesis kuralları ile
        alakalı kısıtlamalar uygulamak veya kontenjan dahil olmak üzere farklı
        konularda ALICI'lara verdiği bilgilerden farklı bilgiler vermek dahil
        olmak, ancak bunlarla sınırlı olmamak üzere, ALICI'lara yönelik
        uygulamaları nedeniyle SATICI’un herhangi bir sorumluluğu
        bulunmamaktadır. Bu talepler doğrudan ilgili tesise yöneltilmelidir.`}
      </p>
      <p>
        <strong>MADDE 9 - OTELLE İLGİLİ BİLGİLENDİRMELER</strong>
      </p>
      <p>
        İşbu sözleşmeden doğacak tüm ihtilafların çözümü ile ilgili tüm Türkiye
        Cumhuriyeti Tüketici Mahkemeleri, Tüketici hakem heyetleri ve yasa ile
        yetkilendirilmiş sair kuruluşlar yetkilidir. Katılımcılar, şikâyet ve
        itirazları konusunda başvurularını, Bakanlıkça her yıl Aralık ayında
        belirlenen parasal sınırlar dâhilinde Katılımcının mal veya hizmeti
        satın aldığı veya ikametgâhının bulunduğu yerdeki Tüketici Sorunları
        Hakem Heyetine veya Tüketici Mahkemesine yapabilirler.
      </p>
      <p>
        <strong>Ek Madde - 1</strong> Konaklanacak tesisin ilgili bakanlıklar,
        valilikler, il müdürlükleri ve bunlarla sınırlı olmaksızın diğer idari
        birimlerce salgın ya da herhangi bir sağlık önlemi çerçevesinde
        açıklanan konaklama tesislerinde alınması gereken önlemlere uygun
        davranıp davranmamasından SATICI sorumlu değildir. Ayrıca konaklanacak
        tesisin,ilgili bakanlıklar, valilikler, il müdürlükleri ve bunlarla
        sınırlı olmaksızın diğer idari birimlerce salgın ya da herhangi bir
        sağlık önlemi çerçevesinde konaklama tesislerinde alınacak önlemlere
        uyumluluk sağlamak amacıyla, Müşteri’nin kendisine sunulmasını beklediği
        hizmetin kapsamda, konusunda ve hizmet ile ilgili diğer konularda
        Müşteri’ye önceden haber vermeden değişiklik yapmasından SATICI sorumlu
        tutulamaz. Konaklanacak tesis tarafından bu şekilde değişiklikler
        yapılması işbu Sözleşme tahtında SATICI tarafından işbu müşteri
        sözleşmesi altındaki yükümlülüklerinin hiç veya gereği gibi yerine
        getirilmediği anlamına gelmeyecek veya hizmet kusuru sayılmayacaktır.
        İlaveten, bahsi geçen önlemlere uyumluluk sağlamak amacıyla konaklanacak
        tesisin işbu müşteri sözleşmesi tahtında Müşteri’nin kendisine
        sunulmasını beklediği hizmetin kapsamı, konusu ve hizmet ile ilgili
        diğer konularda Müşteri’ye önceden haber vermeksizin değişiklik yapması
        veya konaklanacak tesisin yukarıda bahsi geçen önlemlere uyumluluk
        sağlamaması sebebiyle yöneltilecek talepler tesise yöneltilebilecek
        olup, Müşteri’ye işbu müşteri sözleşmesini feshetme, sözleşmeden dönme
        veya rezervasyonu iptal etme hakkı vermez.
      </p>
      <p>
        <strong>Ek Madde - 2</strong> İptal Güvence Paketi (“İGP”) Bilgilendirme
      </p>
      <p>
        <strong>1-</strong> İGP; yurtiçi otel konaklamaları için yapılan,
        minimum 1, maksimum 14 gecelik ve 31.10.2024- 31.10.2025 tarihleri
        arasında konaklayacak rezervasyonlar için geçerli olacaktır.
        Rezervasyonlarında giriş tarihinden en az 5 gün önce yapılmış olan şartı
        aranacaktır.
      </p>
      <p>
        <strong>2-</strong> İGP satın alan tüketiciler tesise giriş tarihine 72
        saat kalana kadar işbu İPG koşullarına uygun olarak ve kesinti
        yapılmadan rezervasyonlarını iptal edebilirler.
      </p>
      <p>
        <strong>3-</strong> İGP aynı ürün üzerinde talep edilen tarih ya da isim
        değişikliklerini kapsamamaktadır. Değişiklik taleplerinde var olan İGP
        kapsamında iptal edilir, talep edilen yeni tarih, ürün ya da isimler
        için günün koşullarından yeni rezervasyon açılarak işlem yapılır.
      </p>
      <p>
        <strong>4-</strong> İGP rezervasyon tarihinden itibaren 5 gün içinde
        ücreti karşılığında sunulmaktadır. 8. gün ve sonrası için İGP alınamaz.
      </p>
      <p>
        <strong>5-</strong>İptal talebine karşılık yapılacak olan iadelerde
        tahsil edilen İGP tutarı iade edilemez ya da sunulan İGP iptal edilemez.
      </p>
      <p>
        <strong>6-</strong> Otel konaklaması ile birlikte yapılan (promosyon ve
        ekonomi sınıfı dahil) tüm havayolu bilet rezervasyonları İGP kapsamı
        dışında olup ilgili havayolu firmasının iptal koşulları ve uygulamaları
        geçerlidir. İGP ücretlendirmesinde uçak ve/ veya otobüs ulaşım tutarı
        hariç konaklama ve/veya diğer hizmetler tutarı baz alınarak İGP ücreti
        tahsil edilir.
      </p>
      <p>
        <strong>7-</strong> İGP uygulaması yalnızca, 2024 ve 2025 yılı için
        belirlenen kampanyalı ve belirli yurtiçi tesislerde yapılacak otel
        konaklamaları için geçerlidir. İGP kapsamı dışındaki otel konaklama
        rezervasyonları için ilgili sözleşmedeki iptal koşulları geçerli
        olacaktır.
      </p>
      <p>
        <strong>8-</strong> İGP uygulaması yurtdışı otel konaklaması/seyahat
        rezervasyonlarını kapsamamaktadır. Yurtdışı otel konaklamasında/seyahat
        uygulamalarında Yurtdışı Seyahat Güvence Paketi satın alındığı takdirde
        bu ürünün kendisine ait olan teminat kapsamları geçerli olacaktır.
      </p>
      <p>
        <strong>9-</strong> 2024 ve 2025 yılı İGP bedelleri yurtiçi otel
        konaklama rezervasyon tutarının yüzde 1’ini kapsayacak şekildedir.
      </p>
      <p>
        <strong>10-</strong> Salgın hastalık İGP kapsamına dahildir.
      </p>
      <p>
        <strong>11-</strong>{' '}
        {`Her tesisin kendine ait iptal politikası farklılık
        göstermektedir. "İGP " satın alınan rezervasyonlarda 72 saate kadar
        iptal hakkı tanınmaktadır. İGP seçili ürünlerde geçerlidir.`}
      </p>
      <p>
        <strong>12-</strong> Aşağıdaki hal ve koşullar İptal Güvence Paketi
        kapsamı dışında tutulacaktır:
      </p>
      <p>
        <strong>a.</strong> Tesise giriş tarihine 72 saat ve daha az kalan
        sürelerde yapılan iptaller;
      </p>
      <p>
        <strong>b.</strong> Müşteri tarafından rezervasyon ücreti tesise giriş
        tarihinden 72 saat öncesine kadar ödenmemiş olan işlemler;
      </p>
      <p>
        <strong>c.</strong> Ulaşım ve transfer ücretleri;
      </p>
      <p>
        <strong>d.</strong> Rezervasyon değişiklikleri ve değişiklikten
        kaynaklanan farklar;
      </p>
      <p>
        <strong>e.</strong> 14 geceden fazla yapılan rezervasyonlar;
      </p>
      <p>
        <strong>f.</strong> tesise giriş tarihinden en az 5 gün önce yapılmamış
        olan rezervasyonlar;
      </p>
      <p>
        <strong>g.</strong> Sel, seylap, deprem, volkanik patlamalar, heyelan,
        fırtına ve meteor düşmesi gibi doğal afetler sonucu ortaya çıkan
        zararlar. Harp veya harp niteliğindeki harekât, ihtilal, isyan,
        ayaklanma ve bunlardan doğan iç kargaşalıklar.
      </p>
      <p>
        <strong>d.</strong>{' '}
        {`3713 sayılı Terörle Mücadele Kanunu'nda belirtilen
        terör eylemleri ve sabotaj ile bunları önlemek ve etkilerini azaltmak
        amacıyla yetkili organlar tarafından yapılan müdahaleler. Nükleer
        rizikolar veya nükleer biyolojik ve kimyasal silah kullanımı ya da
        nükleer biyolojik ve kimyasal maddelerin açığa çıkmasına neden olacak
        her türlü saldırı ve sabotaj. Politik riskler ve grevler 'den meydana
        gelecek zarar ve hasarlar.`}
      </p>
      <p>
        <strong>Ek Madde - 3</strong>
      </p>
      <p>Termal ve Doğa Otelleri Fırsat Kampanyası Koşulları</p>
      <p>
        - Kampanya, 23 Eylül 2024 tarihi itibariyle yapılacak seçili ürün
        rezervasyonlarında ve konaklamalarda geçerlidir.
      </p>
      <p>
        - Kampanya, seçili yurt içi otellerinde geçerlidir. Ürün gruplarına göre
        ödeme koşulları değişiklik göstermektedir.
      </p>
      <p>- Kampanya, sadece kredi kartı ile yapılan ödemelerde geçerlidir.</p>
      <p>- Bu kampanya başka kampanyalarla birleştirilemez.</p>
      <p>
        - Kampanya, 23 Eylül 2024 itibariyle tüm satış kanallarımızdan yapılacak
        rezervasyonlarda geçerlidir. Ek hizmetlerde (Vize, Uçak, Transfer,
        Etkinlik, Müze Kart bedeli vb. hizmetler) geçerli değildir.
      </p>
      <p>
        - Kampanya süresi ve kurgusunda meydana gelen değişiklik hakkı SATICI’ya
        aittir.
      </p>
      <p>- Kampanya; %25 ön ödemeli termal otellerde 16 gün,</p>
      <p>%25 ön ödemeli yakın bölge ve doğa otellerinde 16 gün,</p>
      <p>
        Ön ödemesiz yurt içi otellerde ise 6 gün öncesine kadar yapılan
        rezervasyonlarda geçerlidir.
      </p>
      <p>
        {`- Yukarıdaki kampanya koşullarının tümü sağlandığı takdirde "Masterpass"
        altyapısı ile rezervasyon tutarının ürün gruplarına göre belirlenmiş
        (aşağıdaki detayları yer alan) oranı kredi kartından çekilerek
        rezervasyonunuz güvence altına alınır. Sonrasında ürün gruplarına göre
        belirlenen tarihlerde ön provizyon ve kalan tutarın tahsilat işlemleri
        gerçekleştirilir.`}
      </p>
    </div>
  )
}
