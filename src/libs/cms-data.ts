import { serviceRequest } from '@/network'

type CMSMasterWidgetParams = [
  {
    id: 7630
    title: 'facebook'
    typeId: 175
    collectionId: 82
    point: 'social_menu'
    params: {
      sort_description: {
        value: ''
      }
      description: {
        value: '<p><br></p>'
      }
      btn_text: {
        value: ''
      }
      link: {
        value: 'https://www.facebook.com/Fulltripcom'
      }
      image: {
        value: ''
      }
      svg: {
        value: '<div class="d-md-none d-flex">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">\r\n  <g clip-path="url(#clip0_4637_406)">\r\n    <path d="M16 0C7.17764 0 0 7.17764 0 16C0 24.8217 7.17764 32 16 32C24.8217 32 32 24.8217 32 16C32 7.17764 24.823 0 16 0ZM19.9791 16.5633H17.376V25.8413H13.5187C13.5187 25.8413 13.5187 20.7718 13.5187 16.5633H11.6852V13.2841H13.5187V11.1631C13.5187 9.64408 14.2406 7.27044 17.4114 7.27044L20.2697 7.2814V10.4645C20.2697 10.4645 18.5328 10.4645 18.1951 10.4645C17.8574 10.4645 17.3773 10.6334 17.3773 11.3578V13.2848H20.3161L19.9791 16.5633Z" fill="#F5F5F5"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_4637_406">\r\n      <rect width="32" height="32" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>\r\n<div class="d-md-flex d-none">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\r\n  <g clip-path="url(#clip0_473_77)">\r\n    <path d="M12 0C5.38323 0 0 5.38323 0 12C0 18.6163 5.38323 24 12 24C18.6163 24 24 18.6163 24 12C24 5.38323 18.6173 0 12 0ZM14.9843 12.4225H13.032V19.381H10.139C10.139 19.381 10.139 15.5788 10.139 12.4225H8.76388V9.9631H10.139V8.37235C10.139 7.23306 10.6804 5.45283 13.0586 5.45283L15.2023 5.46105V7.84838C15.2023 7.84838 13.8996 7.84838 13.6463 7.84838C13.3931 7.84838 13.0329 7.97503 13.0329 8.51833V9.96359H15.2371L14.9843 12.4225Z" fill="#202124"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_473_77">\r\n      <rect width="24" height="24" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>'
      }
      view_country: {
        value: ''
      }
    }
    ordering: 1
    language: 'tr'
    active: true
  },
  {
    id: 8940
    title: 'Popüler Aramalar'
    typeId: 220
    collectionId: 82
    point: 'popular_destinations'
    params: {
      hotel: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 392
            name: 'Bodrum'
            slug: 'bodrum'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 482
            name: 'Kuşadası'
            slug: 'kusadasi'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      flight: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'IST'
            iata: ['SAW', 'IST']
            typeId: 0
            domestic: true
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'IZM'
            iata: ['ADB']
            typeId: 0
            domestic: true
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'ANK'
            iata: ['ESB']
            typeId: 0
            domestic: true
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'AYT'
            iata: ['AYT', 'GZP']
            typeId: 0
            domestic: true
          },
          {
            id: 25549
            name: 'Paris'
            slug: 'paris'
            code: 'PAR'
            iata: ['CDG', 'ORY', 'BVA']
            typeId: 0
            domestic: false
          },
          {
            id: 5253
            name: 'Londra'
            slug: 'londra'
            code: 'LON'
            iata: ['LHR', 'LCY', 'LGW', 'LTN', 'STN']
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      carrental: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'IST'
            iata: ['true']
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'IZM'
            iata: ['true']
            typeId: 0
            domestic: false
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'ANK'
            iata: ['true']
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'AYT'
            iata: ['true']
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      tour: {
        destinations: [
          {
            id: 300221
            name: 'Assos Bozcaada Kazdağları Turları'
            slug: 'null'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 300253
            name: 'Festival Turları'
            slug: 'null'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 300399
            name: 'Dubai Turları'
            slug: 'null'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 300328
            name: 'Mavi Yolculuk Turları'
            slug: 'null'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 300362
            name: 'Yılbaşına Özel Kültür Turları'
            slug: 'null'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      bus: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 295
            name: 'Kayseri'
            slug: 'kayseri'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      transfer: {
        destinations: [
          {
            id: 40
            name: 'Ataşehir'
            slug: 'atasehir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 41
            name: 'Beykoz'
            slug: 'beykoz'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 79
            name: 'Beşiktaş'
            slug: 'besiktas'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 60
            name: 'Maltepe'
            slug: 'maltepe'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 84
            name: 'Aksaray'
            slug: 'aksaray'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
    }
    ordering: 1
    language: 'tr'
    active: true
  },
  {
    id: 6497
    title: 'Master Footer'
    typeId: 173
    collectionId: 82
    point: 'footer'
    params: {
      flight_title: {
        value: 'Uçak Bileti'
      }
      flight: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 259
            name: 'Adana'
            slug: 'adana'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 5253
            name: 'Londra'
            slug: 'londra'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 125064
            name: 'Paris'
            slug: 'paris-125064'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 85869
            name: 'New York'
            slug: 'newyork'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 392
            name: 'Bodrum'
            slug: 'bodrum'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 410
            name: 'Dalaman'
            slug: 'dalaman'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 284949
            name: 'Miami'
            slug: 'miami284949'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 21131
            name: 'Roma'
            slug: 'roma21131'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 12198
            name: 'Amsterdam'
            slug: 'amsterdamnl'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      otel_title: {
        value: 'Otel'
      }
      otel: {
        destinations: [
          {
            id: 470
            name: 'Kemer'
            slug: 'kemer'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 392
            name: 'Bodrum'
            slug: 'bodrum'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 382
            name: 'Belek'
            slug: 'belek'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 407
            name: 'Çeşme'
            slug: 'cesme'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 490
            name: 'Marmaris'
            slug: 'marmaris'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 355
            name: 'Alanya'
            slug: 'alanya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 482
            name: 'Kuşadası'
            slug: 'kusadasi'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 431
            name: 'Fethiye'
            slug: 'fethiye'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 410
            name: 'Dalaman'
            slug: 'dalaman'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      tour_title: {
        value: 'Tur'
      }
      tour: {
        destinations: [
          {
            id: 300241
            name: 'Ege Akdeniz Turları'
            slug: 'ege-akdeniz-turlari'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 304422
            name: 'Baştan Başa Balkanlar'
            slug: 'bastan-basa-balkanlar'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305323
            name: 'Uzakdoğu Turları'
            slug: 'uzakdogu-turlari305323'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 306002
            name: 'Büyük İtalya Turları '
            slug: 'buyuk-italya-turlari306002'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 303561
            name: 'Karadeniz Turları'
            slug: 'karadeniz-turlari303561'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 300288
            name: 'Kapadokya Turları'
            slug: 'kapadokya-turlari'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305324
            name: 'Yurtiçi Kültür Turları'
            slug: 'yurtici-kultur-turlari'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 304427
            name: 'Dubai Turları'
            slug: 'dubai-turlari304427'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305505
            name: 'Balayı Turları'
            slug: 'balayi-turlari'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 304574
            name: 'Amerika Turları'
            slug: 'amerika-turlari304574'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305356
            name: 'Japonya Turları'
            slug: 'japonya-turlari305356'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305319
            name: 'Avrupa Turları'
            slug: 'avrupa-turlari305319'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      car_title: {
        value: 'Araç Kiralama'
      }
      car: {
        destinations: [
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 259
            name: 'Adana'
            slug: 'adana'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 318
            name: 'Trabzon'
            slug: 'trabzon'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 392
            name: 'Bodrum'
            slug: 'bodrum'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 410
            name: 'Dalaman'
            slug: 'dalaman'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 124529
            name: 'Berlin'
            slug: 'berlin-124529'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 37905
            name: 'Paris'
            slug: 'paris37905'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 5253
            name: 'Londra'
            slug: 'londra'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 295
            name: 'Kayseri'
            slug: 'kayseri'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      bus_title: {
        value: 'Otobüs Bileti'
      }
      bus: {
        destinations: [
          {
            id: 292
            name: 'İzmir'
            slug: 'izmir'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 264
            name: 'Ankara'
            slug: 'ankara'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 265
            name: 'Antalya'
            slug: 'antalya'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 392
            name: 'Bodrum'
            slug: 'bodrum'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 274
            name: 'Bursa'
            slug: 'bursa'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 285
            name: 'Gaziantep'
            slug: 'gaziantep'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 305
            name: 'Muğla'
            slug: 'mugla'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 318
            name: 'Trabzon'
            slug: 'trabzon'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 238749
            name: 'Sivas'
            slug: 'sivas238749'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 291
            name: 'İstanbul'
            slug: 'istanbul'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 295
            name: 'Kayseri'
            slug: 'kayseri'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 312
            name: 'Samsun'
            slug: 'samsun'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      transfer_title: {
        value: 'Transfer'
      }
      transfer: {
        destinations: [
          {
            id: 3591
            name: 'Antalya Havalimanı (ayt)'
            slug: 'antalya-havalimani-ayt'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 6791
            name: 'Adnan Menderes Havalimanı Izmir (adb)'
            slug: 'adnan-menderes-havalimani-izmir-adb'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 6656
            name: 'Ankara Esenboğa Havalimanı(esb)'
            slug: 'ankara-esenboga-havalimaniesb'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 5762
            name: 'Bodrum Milas Havalimanı (bjv)'
            slug: 'bodrum-milas-havalimani-bjv'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 5464
            name: 'Dalaman Havalimanı (dlm)'
            slug: 'dalaman-havalimani-dlm'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 7828
            name: 'Trabzon Havalimanı'
            slug: 'trabzon-havalimani'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 7865
            name: 'Gaziantep Havalimanı'
            slug: 'gaziantep-havalimani'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 3
            name: 'Istanbul Havalimanı'
            slug: 'istanbul-havalimani'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 4630
            name: 'Kemer'
            slug: 'kemer'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 10976
            name: 'Samsun Çarşamba Havalimanı(szf)'
            slug: 'samsun-carsamba-havalimaniszf'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 7730
            name: 'Adana Şakirpaşa Havalimanı (ada)'
            slug: 'adana-sakirpasa-havalimani-ada'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
          {
            id: 5784
            name: 'Kuşadası'
            slug: 'kusadasi'
            code: 'null'
            iata: null
            typeId: 0
            domestic: false
          },
        ]
        value: ''
      }
      footer_menu: {
        menus: [
          {
            id: 375
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'Fulltrip'
            url: '/hakkimizda'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 1
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:30.153'
            updatedBy: 'serkans_fulltrip'
            updatedDate: '2024-05-31T17:42:57.4109764+03:00'
            items: []
          },
          {
            id: 380
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'Yardım'
            url: '/iletisim'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 2
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:35.0939395+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 378
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'Kullanım Şartları'
            url: '/kullanim-sartlari-ve-genel-kosullar'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 3
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:33.3555287+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 377
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'Gizlilik ve Güvenlik'
            url: '/gizlilik-ve-guvenlik'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 4
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:31.9651754+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 381
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'Sıkça Sorulan Sorular'
            url: '/yardim/populer-sorular'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 5
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:36.2021513+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 379
            poolId: 55
            parentId: null
            language: 'tr'
            title: 'KVKK'
            url: '/kisisel-verilerin-korunmasi-kanunu'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 5
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:34.100859+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
        ]
        value: '55,'
      }
      social_menu: {
        menus: [
          {
            id: 384
            poolId: 57
            parentId: null
            language: 'tr'
            title: 'Facebook'
            url: 'https://www.facebook.com/Fultripcom'
            urlTarget: null
            comment: 'bizi takip edin'
            icon: 'icon-facebook2'
            image: null
            fileId: null
            active: true
            ordering: 1
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:39.45'
            updatedBy: 'serra_fulltrip'
            updatedDate: '2024-06-03T16:43:24.8801534+03:00'
            items: []
          },
          {
            id: 385
            poolId: 57
            parentId: null
            language: 'tr'
            title: 'Instagram'
            url: 'https://www.instagram.com/travelfulltrip/'
            urlTarget: null
            comment: null
            icon: 'icon-instagram'
            image: null
            fileId: null
            active: true
            ordering: 2
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:40.587'
            updatedBy: 'serra_fulltrip'
            updatedDate: '2024-06-03T16:44:14.5563417+03:00'
            items: []
          },
          {
            id: 386
            poolId: 57
            parentId: null
            language: 'tr'
            title: 'Twitter'
            url: 'https://x.com/Fulltripcom'
            urlTarget: null
            comment: null
            icon: 'icon-twitter'
            image: null
            fileId: null
            active: true
            ordering: 3
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:41.623'
            updatedBy: 'serra_fulltrip'
            updatedDate: '2024-06-03T16:47:47.5124698+03:00'
            items: []
          },
          {
            id: 387
            poolId: 57
            parentId: null
            language: 'tr'
            title: 'Youtube'
            url: 'https://www.youtube.com/@fulltrip9802'
            urlTarget: null
            comment: null
            icon: 'icon-youtube'
            image: null
            fileId: null
            active: true
            ordering: 4
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:43.023'
            updatedBy: 'serra_fulltrip'
            updatedDate: '2024-06-03T16:45:32.9871719+03:00'
            items: []
          },
        ]
        value: '57,'
      }
      customer_service: {
        value: '<div class="d-none d-md-block">\r\n<div class="d-flex align-items-center gap-2">\r\n<div>\r\n<svg class="d-md-none d-block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">\r\n  <g clip-path="url(#clip0_4637_413)">\r\n    <path d="M0.252325 7.14754C1.46014 11.9461 8.05538 18.5459 12.853 19.7482C13.5007 19.9124 14.1661 19.996 14.8342 19.9973C16.1039 19.9967 17.354 19.6846 18.4749 19.0885C19.8586 18.3658 20.3944 16.6583 19.6717 15.2747C19.5397 15.0221 19.3703 14.7909 19.1693 14.5889L17.2735 12.6932C16.4515 11.871 15.2098 11.6362 14.1444 12.1015C13.6472 12.3159 13.1937 12.6199 12.8067 12.9985C12.6449 13.1594 12.3468 13.1848 11.9188 13.0685C9.65164 12.1471 7.85297 10.3488 6.93121 8.08185C6.8167 7.6538 6.84032 7.35479 7.0021 7.19395C7.38091 6.80652 7.68527 6.35277 7.90001 5.85528C8.36411 4.79004 8.12942 3.54931 7.30836 2.72715L5.41257 0.832264C4.78282 0.194757 3.88487 -0.100831 2.99965 0.0378897C2.10442 0.169367 1.32682 0.722831 0.909357 1.52563C-0.00606277 3.25117 -0.240557 5.25742 0.252325 7.14754ZM2.5207 2.36901C2.67119 2.08094 2.95072 1.88255 3.27229 1.83554C3.32247 1.82755 3.37322 1.82358 3.42407 1.82374C3.68837 1.82366 3.94168 1.92935 4.12748 2.11728L6.02236 4.01216C6.31394 4.30035 6.40006 4.73729 6.23958 5.11456C6.11546 5.41042 5.93836 5.68117 5.71701 5.91342C5.05404 6.61974 4.84651 7.63975 5.18083 8.54899C5.837 11.0028 9.00241 14.1646 11.4517 14.8198C12.3645 15.1531 13.3873 14.942 14.0936 14.2745C14.3245 14.0534 14.5936 13.8761 14.8879 13.7511C15.2654 13.5902 15.7028 13.6763 15.9912 13.9683L17.8861 15.8632C18.112 16.0867 18.2168 16.4052 18.1678 16.7193C18.1199 17.0413 17.92 17.3206 17.6307 17.47C16.3036 18.1828 14.7548 18.3634 13.2993 17.9752C9.16959 16.9473 3.05417 10.8319 2.01451 6.70406C1.62646 5.24718 1.80746 3.69725 2.5207 2.36901Z" fill="white"></path>\r\n    <path d="M18.0861 10.8207C18.5393 11.0359 19.0812 10.8431 19.2966 10.39C21.0178 6.76219 19.4721 2.42597 15.8443 0.704836C13.8708 -0.231486 11.5808 -0.230856 9.60775 0.706607C9.14947 0.911302 8.94387 1.44874 9.14857 1.90703C9.35326 2.36531 9.89071 2.57091 10.349 2.36621C10.362 2.36042 10.3748 2.35432 10.3875 2.34791C13.1078 1.05581 16.3604 2.21352 17.6525 4.93379C18.3558 6.41425 18.3558 8.13251 17.6525 9.61296C17.4396 10.0662 17.6335 10.6063 18.0861 10.8207Z" fill="white"></path>\r\n    <path d="M14.009 9.84647C14.3639 10.2013 14.9392 10.2013 15.294 9.84647C16.7132 8.42691 16.7132 6.12579 15.294 4.70623C13.8562 3.33197 11.5917 3.33197 10.1538 4.70623C9.8051 5.06724 9.8151 5.64259 10.1762 5.99128C10.5283 6.33142 11.0867 6.33142 11.4389 5.99128C12.1579 5.30437 13.29 5.30437 14.009 5.99128C14.7186 6.70106 14.7186 7.8516 14.009 8.56142C13.6528 8.91499 13.6481 9.4879 14.0017 9.84415C14.0032 9.84576 14.0049 9.84738 14.009 9.84647Z" fill="white"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_4637_413">\r\n      <rect width="20" height="20" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>\r\n<p class="fw-semibold fs-4"><a class="text-dark" href="tel:08508781484">0850 878 14</a>84</p>\r\n</div><p class="text-dark small">09:00 - 18:00 arasında arayabilirsiniz</p>\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n<div class="d-md-none d-block">\r\n<div class="d-flex align-items-center gap-2 justify-content-center">\r\n<div>\r\n<svg class="d-md-none d-block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">\r\n  <g clip-path="url(#clip0_4637_413)">\r\n    <path d="M0.252325 7.14754C1.46014 11.9461 8.05538 18.5459 12.853 19.7482C13.5007 19.9124 14.1661 19.996 14.8342 19.9973C16.1039 19.9967 17.354 19.6846 18.4749 19.0885C19.8586 18.3658 20.3944 16.6583 19.6717 15.2747C19.5397 15.0221 19.3703 14.7909 19.1693 14.5889L17.2735 12.6932C16.4515 11.871 15.2098 11.6362 14.1444 12.1015C13.6472 12.3159 13.1937 12.6199 12.8067 12.9985C12.6449 13.1594 12.3468 13.1848 11.9188 13.0685C9.65164 12.1471 7.85297 10.3488 6.93121 8.08185C6.8167 7.6538 6.84032 7.35479 7.0021 7.19395C7.38091 6.80652 7.68527 6.35277 7.90001 5.85528C8.36411 4.79004 8.12942 3.54931 7.30836 2.72715L5.41257 0.832264C4.78282 0.194757 3.88487 -0.100831 2.99965 0.0378897C2.10442 0.169367 1.32682 0.722831 0.909357 1.52563C-0.00606277 3.25117 -0.240557 5.25742 0.252325 7.14754ZM2.5207 2.36901C2.67119 2.08094 2.95072 1.88255 3.27229 1.83554C3.32247 1.82755 3.37322 1.82358 3.42407 1.82374C3.68837 1.82366 3.94168 1.92935 4.12748 2.11728L6.02236 4.01216C6.31394 4.30035 6.40006 4.73729 6.23958 5.11456C6.11546 5.41042 5.93836 5.68117 5.71701 5.91342C5.05404 6.61974 4.84651 7.63975 5.18083 8.54899C5.837 11.0028 9.00241 14.1646 11.4517 14.8198C12.3645 15.1531 13.3873 14.942 14.0936 14.2745C14.3245 14.0534 14.5936 13.8761 14.8879 13.7511C15.2654 13.5902 15.7028 13.6763 15.9912 13.9683L17.8861 15.8632C18.112 16.0867 18.2168 16.4052 18.1678 16.7193C18.1199 17.0413 17.92 17.3206 17.6307 17.47C16.3036 18.1828 14.7548 18.3634 13.2993 17.9752C9.16959 16.9473 3.05417 10.8319 2.01451 6.70406C1.62646 5.24718 1.80746 3.69725 2.5207 2.36901Z" fill="white"></path>\r\n    <path d="M18.0861 10.8207C18.5393 11.0359 19.0812 10.8431 19.2966 10.39C21.0178 6.76219 19.4721 2.42597 15.8443 0.704836C13.8708 -0.231486 11.5808 -0.230856 9.60775 0.706607C9.14947 0.911302 8.94387 1.44874 9.14857 1.90703C9.35326 2.36531 9.89071 2.57091 10.349 2.36621C10.362 2.36042 10.3748 2.35432 10.3875 2.34791C13.1078 1.05581 16.3604 2.21352 17.6525 4.93379C18.3558 6.41425 18.3558 8.13251 17.6525 9.61296C17.4396 10.0662 17.6335 10.6063 18.0861 10.8207Z" fill="white"></path>\r\n    <path d="M14.009 9.84647C14.3639 10.2013 14.9392 10.2013 15.294 9.84647C16.7132 8.42691 16.7132 6.12579 15.294 4.70623C13.8562 3.33197 11.5917 3.33197 10.1538 4.70623C9.8051 5.06724 9.8151 5.64259 10.1762 5.99128C10.5283 6.33142 11.0867 6.33142 11.4389 5.99128C12.1579 5.30437 13.29 5.30437 14.009 5.99128C14.7186 6.70106 14.7186 7.8516 14.009 8.56142C13.6528 8.91499 13.6481 9.4879 14.0017 9.84415C14.0032 9.84576 14.0049 9.84738 14.009 9.84647Z" fill="white"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_4637_413">\r\n      <rect width="20" height="20" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>\r\n<p class="fw-semibold fs-6"><a class="text-white" href="tel:08508781484">0850 878 14</a>84</p>\r\n</div><p class="text-white small">09:00 - 18:00 arasında arayabilirsiniz</p>\r\n</div>'
      }
      description: {
        value: 'Fulltrip sitesinin tüm seyahat hizmetlerini gerçekleştiren Yeni Karamürsel Turizm ve Seyahat Acentası, 3102 üye numaralı TÜRSAB A grubu ve 8821128-1 kodlu IATA üyesi seyahat acentası olup 1618 sayılı Seyahat Acentaları ve Seyahat Acentaları Birliği Kanunu’na tabi olarak hizmet sunmaktadır.'
      }
    }
    ordering: 1
    language: 'tr'
    active: true
  },
  {
    id: 9290
    title: 'Header Info'
    typeId: 230
    collectionId: 82
    point: 'header_info'
    params: {
      description: {
        value: '<span class="d-lg-block d-none d-flex align-items-center gap-2">\r\n    Erken Rezervasyonda %50’ye Varan İndirimler İçin \r\n    <span class="border d-inline-block bg-primary rounded-pill text-white px-3 p-1 fs-6">\r\n        Son Gün 24 Mart</span> <a href="/otel-listesi/erken-rezervasyon" class="px-lg-5 text-header fw-semibold d-inline-flex align-items-center">Hemen İncele \r\n        <svg class="mx-md-2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">\r\n            <path d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75Z" fill="black"></path>\r\n        </svg>\r\n    </a>\r\n</span>\r\n\r\n\r\n<span class="d-lg-none d-block"><span style="font-size:12px;">Erken Rezervasyonda %50’ye Varan İndirimler İçin </span><div><div class="row d-flex justify-content-center "><div class="col-5 text-center  border d-inline-block bg-primary text-white rounded-pill p-2 mb-2" style="font-size:10px;">Son Gün 24 Mart</div><div class="col-6 col-md-7"> <a href="/otel-listesi/erken-rezervasyon" class="px-lg-5 text-header fw-semibold">\r\n    Hemen İncele <svg class="mx-md-2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">\r\n  <path d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75Z" fill="black"></path>\r\n</svg>\r\n    \r\n </a></div></div></div></span> \r\n\r\n'
      }
      sort_description: {
        value: ''
      }
      btn_text: {
        value: 'Hemen İncele!'
      }
      link: {
        value: '/otel-listesi/erken-rezervasyon'
      }
    }
    ordering: 1
    language: 'tr'
    active: true
  },
  {
    id: 7033
    title: 'Master Header'
    typeId: 174
    collectionId: 82
    point: 'header'
    params: {
      top_bar_info: {
        value: '<p>Otel ve tur alışverişlerinize 7.500 TL\'ye varan Bankkart Lira  hediye! <strong><a href="https://tatil.prontotour.com/kampanyalar/banka-kampanyalari/7500-tlye-varan-bankkart-lira-hediye" target="_blank">Detaylar için tıklayınız</a></strong><br></p>'
      }
      main_menu: {
        menus: [
          {
            id: 371
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Uçak'
            url: '/ucak-bileti'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 1
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:25.77'
            updatedBy: 'basar_fulltrip'
            updatedDate: '2025-01-03T10:07:28.2462818+03:00'
            items: []
          },
          {
            id: 370
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Otel'
            url: '/otel'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 2
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:24.613'
            updatedBy: 'basar_fulltrip'
            updatedDate: '2025-01-03T10:07:24.9867092+03:00'
            items: []
          },
          {
            id: 372
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Araç'
            url: '/arac'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 3
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:26.6814106+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 373
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Otobüs'
            url: '/otobus'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 4
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:27.7263289+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 374
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Transfer'
            url: '/transfer'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 5
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:28.7947108+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 692
            poolId: 54
            parentId: null
            language: 'tr'
            title: 'Tur'
            url: '/tur'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 6
            createdBy: 'basar_fulltrip'
            createdDate: '2024-07-12T17:55:16.0638819+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
        ]
        value: '54,'
      }
      help_menu: {
        menus: [
          {
            id: 382
            poolId: 56
            parentId: null
            language: 'tr'
            title: 'Sıkça Sorulan Sorular'
            url: '/yardim/populer-sorular'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 2
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:37.3162972+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
          {
            id: 383
            poolId: 56
            parentId: null
            language: 'tr'
            title: 'Geri Bildirim'
            url: '/talep-formu'
            urlTarget: null
            comment: null
            icon: null
            image: null
            fileId: null
            active: true
            ordering: 3
            createdBy: 'cihaty_fulltrip'
            createdDate: '2024-05-28T18:09:38.4925543+03:00'
            updatedBy: null
            updatedDate: null
            items: []
          },
        ]
        value: '56,'
      }
    }
    ordering: 1
    language: 'tr'
    active: true
  },
  {
    id: 7631
    title: 'Instagram'
    typeId: 175
    collectionId: 82
    point: 'social_menu'
    params: {
      sort_description: {
        value: ''
      }
      description: {
        value: '<p><br></p>'
      }
      btn_text: {
        value: ''
      }
      link: {
        value: 'https://www.instagram.com/travelfulltrip'
      }
      image: {
        value: ''
      }
      svg: {
        value: '<div class="d-md-none d-flex">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">\r\n  <g clip-path="url(#clip0_4637_397)">\r\n    <path d="M16 18.5284C17.3964 18.5284 18.5284 17.3964 18.5284 16C18.5284 14.6036 17.3964 13.4716 16 13.4716C14.6036 13.4716 13.4716 14.6036 13.4716 16C13.4716 17.3964 14.6036 18.5284 16 18.5284Z" fill="#F5F5F5"></path>\r\n    <path d="M19.2337 9.61047H12.7663C11.9288 9.61047 11.1256 9.94318 10.5334 10.5354C9.94113 11.1276 9.60843 11.9308 9.60843 12.7684V19.2336C9.60843 20.0712 9.94113 20.8744 10.5334 21.4666C11.1256 22.0588 11.9288 22.3915 12.7663 22.3915H19.2337C20.0712 22.3915 20.8744 22.0588 21.4667 21.4666C22.0589 20.8744 22.3916 20.0712 22.3916 19.2336V12.7663C22.391 11.9291 22.0581 11.1264 21.4659 10.5347C20.8738 9.94289 20.0709 9.61047 19.2337 9.61047ZM16 20.1389C15.1813 20.1393 14.3809 19.8969 13.7 19.4424C13.019 18.9878 12.4882 18.3416 12.1746 17.5853C11.861 16.8291 11.7788 15.9968 11.9382 15.1938C12.0977 14.3908 12.4917 13.6531 13.0705 13.074C13.6492 12.495 14.3867 12.1006 15.1897 11.9407C15.9926 11.7808 16.8249 11.8627 17.5813 12.1759C18.3377 12.4891 18.9843 13.0196 19.4392 13.7003C19.8941 14.3809 20.1369 15.1813 20.1369 15.9999C20.1357 17.097 19.6996 18.1487 18.9241 18.9247C18.1486 19.7006 17.097 20.1372 16 20.1389ZM20.1621 12.8842C19.9596 12.8846 19.7615 12.8249 19.5929 12.7126C19.4243 12.6003 19.2928 12.4406 19.2151 12.2535C19.1374 12.0665 19.117 11.8606 19.1564 11.6619C19.1958 11.4632 19.2933 11.2807 19.4365 11.1375C19.5797 10.9943 19.7622 10.8968 19.9609 10.8574C20.1596 10.818 20.3655 10.8384 20.5525 10.9161C20.7396 10.9938 20.8993 11.1253 21.0116 11.2939C21.1239 11.4625 21.1836 11.6606 21.1832 11.8631C21.1826 12.1337 21.0749 12.3931 20.8835 12.5845C20.6921 12.7758 20.4327 12.8836 20.1621 12.8842Z" fill="#F5F5F5"></path>\r\n    <path d="M16 0C12.8355 0 9.74207 0.938384 7.11088 2.69649C4.4797 4.45459 2.42894 6.95345 1.21793 9.87707C0.00693251 12.8007 -0.309921 16.0177 0.307443 19.1214C0.924806 22.2251 2.44866 25.0761 4.6863 27.3137C6.92394 29.5513 9.77487 31.0752 12.8786 31.6926C15.9823 32.3099 19.1993 31.9931 22.1229 30.7821C25.0466 29.5711 27.5454 27.5203 29.3035 24.8891C31.0616 22.2579 32 19.1645 32 16C32 11.7565 30.3143 7.68687 27.3137 4.68629C24.3131 1.68571 20.2435 0 16 0ZM24 19.2337C23.9989 20.4974 23.4964 21.7091 22.6028 22.6027C21.7091 23.4964 20.4975 23.9989 19.2337 24H12.7663C11.5027 23.9983 10.2914 23.4956 9.39787 22.6021C8.50438 21.7086 8.00168 20.4973 8.00001 19.2337V12.7663C8.00168 11.5027 8.50438 10.2914 9.39787 9.39787C10.2914 8.50437 11.5027 8.00167 12.7663 8H19.2337C20.4973 8.00167 21.7086 8.50437 22.6021 9.39787C23.4956 10.2914 23.9983 11.5027 24 12.7663V19.2337Z" fill="#F5F5F5"></path>\r\n    <path d="M17.6875 5.25C17.274 5.25 16.9375 5.58645 16.9375 6C16.9375 6.41352 17.274 6.75 17.6875 6.75C18.101 6.75 18.4375 6.41352 18.4375 6C18.4375 5.58645 18.1011 5.25 17.6875 5.25ZM17.874 6.0264H17.752V6.46131H17.5712C17.5712 6.46131 17.5712 6.22368 17.5712 6.0264H17.4852V5.87269H17.5712V5.77327C17.5712 5.70207 17.605 5.5908 17.7537 5.5908L17.8876 5.59132V5.74052C17.8876 5.74052 17.8062 5.74052 17.7904 5.74052C17.7746 5.74052 17.7521 5.74844 17.7521 5.7824V5.87272H17.8898L17.874 6.0264Z" fill="#F5F5F5"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_4637_397">\r\n      <rect width="32" height="32" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>\r\n<div class="d-md-flex d-none">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\r\n  <g clip-path="url(#clip0_473_68)">\r\n    <path d="M12 13.8961C13.0473 13.8961 13.8963 13.0471 13.8963 11.9998C13.8963 10.9525 13.0473 10.1035 12 10.1035C10.9527 10.1035 10.1037 10.9525 10.1037 11.9998C10.1037 13.0471 10.9527 13.8961 12 13.8961Z" fill="#202124"></path>\r\n    <path d="M14.4253 7.20801H9.57475C8.94661 7.20801 8.34419 7.45754 7.90002 7.9017C7.45586 8.34587 7.20633 8.94828 7.20633 9.57643V14.4254C7.20633 15.0535 7.45586 15.6559 7.90002 16.1001C8.34419 16.5443 8.94661 16.7938 9.57475 16.7938H14.4253C15.0534 16.7938 15.6558 16.5443 16.1 16.1001C16.5442 15.6559 16.7937 15.0535 16.7937 14.4254V9.57485C16.7933 8.94698 16.5436 8.34497 16.0994 7.90114C15.6553 7.45732 15.0531 7.20801 14.4253 7.20801ZM12 15.1043C11.386 15.1046 10.7857 14.9228 10.275 14.5819C9.76428 14.241 9.36616 13.7563 9.13097 13.1891C8.89578 12.6219 8.83408 11.9977 8.95368 11.3955C9.07328 10.7932 9.3688 10.24 9.80287 9.80566C10.2369 9.37137 10.7901 9.07557 11.3923 8.95566C11.9945 8.83576 12.6187 8.89714 13.186 9.13205C13.7533 9.36695 14.2382 9.76482 14.5794 10.2753C14.9205 10.7859 15.1026 11.3861 15.1026 12.0001C15.1018 12.8229 14.7747 13.6117 14.1931 14.1936C13.6114 14.7756 12.8228 15.1031 12 15.1043ZM15.1216 9.66327C14.9697 9.66358 14.8211 9.6188 14.6947 9.5346C14.5682 9.4504 14.4696 9.33057 14.4114 9.19029C14.3531 9.05001 14.3378 8.89559 14.3673 8.74658C14.3969 8.59758 14.47 8.46071 14.5774 8.35329C14.6848 8.24588 14.8217 8.17276 14.9707 8.1432C15.1197 8.11364 15.2741 8.12897 15.4144 8.18725C15.5547 8.24553 15.6745 8.34413 15.7587 8.47056C15.8429 8.597 15.8877 8.74558 15.8874 8.89748C15.887 9.10045 15.8062 9.29499 15.6626 9.43852C15.5191 9.58204 15.3246 9.66285 15.1216 9.66327Z" fill="#202124"></path>\r\n    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519938 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0ZM18 14.4253C17.9992 15.3731 17.6223 16.2818 16.9521 16.9521C16.2819 17.6223 15.3731 17.9992 14.4253 18H9.57474C8.62705 17.9987 7.71853 17.6217 7.04841 16.9516C6.37828 16.2815 6.00126 15.373 6.00001 14.4253V9.57474C6.00126 8.62704 6.37828 7.71852 7.04841 7.0484C7.71853 6.37828 8.62705 6.00125 9.57474 6H14.4253C15.373 6.00125 16.2815 6.37828 16.9516 7.0484C17.6217 7.71852 17.9988 8.62704 18 9.57474V14.4253Z" fill="#202124"></path>\r\n    <path d="M13.2656 3.9375C12.9555 3.9375 12.7031 4.18984 12.7031 4.5C12.7031 4.81014 12.9555 5.0625 13.2656 5.0625C13.5758 5.0625 13.8281 4.81014 13.8281 4.5C13.8281 4.18984 13.5758 3.9375 13.2656 3.9375ZM13.4055 4.5198H13.314V4.84598H13.1784C13.1784 4.84598 13.1784 4.66776 13.1784 4.5198H13.1139V4.40452H13.1784V4.32995C13.1784 4.27655 13.2038 4.1931 13.3152 4.1931L13.4157 4.19349V4.30539C13.4157 4.30539 13.3547 4.30539 13.3428 4.30539C13.3309 4.30539 13.314 4.31133 13.314 4.3368V4.40454H13.4174L13.4055 4.5198Z" fill="#202124"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_473_68">\r\n      <rect width="24" height="24" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>'
      }
      view_country: {
        value: ''
      }
    }
    ordering: 2
    language: 'tr'
    active: true
  },
  {
    id: 7632
    title: 'Twitter'
    typeId: 175
    collectionId: 82
    point: 'social_menu'
    params: {
      sort_description: {
        value: ''
      }
      description: {
        value: '<p><br></p>'
      }
      btn_text: {
        value: ''
      }
      link: {
        value: 'https://twitter.com/Fulltripcom'
      }
      image: {
        value: ''
      }
      svg: {
        value: '<div class="d-flex d-md-none">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">\r\n  <g clip-path="url(#clip0_4637_394)">\r\n    <path d="M9.14799 8.21204L20.9827 23.6854H22.796L11.096 8.21204H9.14799Z" fill="#F5F5F5"></path>\r\n    <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 7.164 32 16 32C24.836 32 32 24.836 32 16C32 7.164 24.836 0 16 0ZM20.084 25.6427L14.924 18.9027L9.028 25.6427H5.75067L13.3947 16.904L5.33333 6.35733H12.0827L16.7413 12.5187L22.132 6.35733H25.4053L18.2573 14.5253L26.6667 25.6413L20.084 25.6427Z" fill="#F5F5F5"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_4637_394">\r\n      <rect width="32" height="32" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>\r\n<div class="d-md-flex d-none">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\r\n  <g clip-path="url(#clip0_473_65)">\r\n    <path d="M6.86099 6.15918L15.737 17.7642H17.097L8.32199 6.15918H6.86099Z" fill="#202124"></path>\r\n    <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM15.063 19.232L11.193 14.177L6.771 19.232H4.313L10.046 12.678L4 4.768H9.062L12.556 9.389L16.599 4.768H19.054L13.693 10.894L20 19.231L15.063 19.232Z" fill="#202124"></path>\r\n  </g>\r\n  <defs>\r\n    <clipPath id="clip0_473_65">\r\n      <rect width="24" height="24" fill="white"></rect>\r\n    </clipPath>\r\n  </defs>\r\n</svg>\r\n</div>'
      }
      view_country: {
        value: ''
      }
    }
    ordering: 3
    language: 'tr'
    active: true
  },
  {
    id: 7633
    title: 'Youtube'
    typeId: 175
    collectionId: 82
    point: 'social_menu'
    params: {
      sort_description: {
        value: ''
      }
      description: {
        value: '<p><br></p>'
      }
      btn_text: {
        value: ''
      }
      link: {
        value: 'https://www.youtube.com/channel/UC2wDbFsprfkAYrmS5jQfIDw'
      }
      image: {
        value: ''
      }
      svg: {
        value: '<div class="d-flex d-md-none">\r\n<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">\r\n  <path d="M16.67 14.2801L19.64 15.9901L16.67 17.7101L13.69 19.4301V12.5601L16.67 14.2801Z" fill="#F5F5F5"></path>\r\n  <path d="M16 1C13.0333 1 10.1332 1.87973 7.66645 3.52796C5.19972 5.17618 3.27713 7.51886 2.14181 10.2597C1.0065 13.0006 0.709449 16.0166 1.28823 18.9264C1.86701 21.8361 3.29562 24.5088 5.3934 26.6066C7.49119 28.7044 10.1639 30.133 13.0737 30.7118C15.9834 31.2906 18.9994 30.9935 21.7403 29.8582C24.4812 28.7229 26.8238 26.8003 28.4721 24.3336C30.1203 21.8668 31 18.9667 31 16C30.9986 12.0222 29.4178 8.20772 26.605 5.39499C23.7923 2.58225 19.9778 1.00144 16 1ZM25 19.46C25.0014 20.1155 24.7512 20.7465 24.3008 21.2229C23.8505 21.6993 23.2346 21.9846 22.58 22.02L17.14 22.35C16.3808 22.4 15.6192 22.4 14.86 22.35L9.42001 22.02C8.76546 21.9846 8.14947 21.6993 7.69917 21.2229C7.24886 20.7465 6.99859 20.1155 7.00001 19.46V12.54C6.99862 11.8845 7.24889 11.2535 7.69919 10.7771C8.14949 10.3008 8.76546 10.0154 9.42001 9.98L14.86 9.65C15.6192 9.59996 16.3808 9.59996 17.14 9.65L22.58 9.98C23.2346 10.0154 23.8505 10.3008 24.3008 10.7771C24.7511 11.2535 25.0014 11.8845 25 12.54V19.46Z" fill="#F5F5F5"></path>\r\n</svg>\r\n</div>\r\n<div class="d-md-flex d-none">\r\n<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n<g clip-path="url(#clip0_2998_2)">\r\n<path d="M12.5026 10.7119L14.7301 11.9944L12.5026 13.2844L10.2676 14.5744V9.42188L12.5026 10.7119Z" fill="#202124"></path>\r\n<path d="M12 0.75C9.77497 0.75 7.59989 1.4098 5.74984 2.64597C3.89979 3.88213 2.45785 5.63914 1.60636 7.69481C0.754875 9.75048 0.532087 12.0125 0.966171 14.1948C1.40025 16.3771 2.47171 18.3816 4.04505 19.955C5.61839 21.5283 7.62295 22.5998 9.80524 23.0338C11.9875 23.4679 14.2495 23.2451 16.3052 22.3936C18.3609 21.5422 20.1179 20.1002 21.354 18.2502C22.5902 16.4001 23.25 14.225 23.25 12C23.2489 9.01665 22.0633 6.15579 19.9538 4.04624C17.8442 1.93669 14.9834 0.751079 12 0.75ZM18.75 14.595C18.7511 15.0866 18.5634 15.5599 18.2256 15.9172C17.8879 16.2744 17.4259 16.4884 16.935 16.515L12.855 16.7625C12.2856 16.8 11.7144 16.8 11.145 16.7625L7.06501 16.515C6.57409 16.4884 6.1121 16.2744 5.77438 15.9172C5.43665 15.5599 5.24894 15.0866 5.25001 14.595V9.405C5.24896 8.91337 5.43667 8.4401 5.77439 8.08284C6.11212 7.72558 6.5741 7.51158 7.06501 7.485L11.145 7.2375C11.7144 7.19997 12.2856 7.19997 12.855 7.2375L16.935 7.485C17.4259 7.51158 17.8879 7.72558 18.2256 8.08284C18.5633 8.4401 18.751 8.91337 18.75 9.405V14.595Z" fill="#202124"></path>\r\n</g>\r\n<defs>\r\n<clipPath id="clip0_2998_2">\r\n<rect width="30" height="30" fill="white"></rect>\r\n</clipPath>\r\n</defs>\r\n</svg>\r\n\r\n</div>'
      }
      view_country: {
        value: ''
      }
    }
    ordering: 4
    language: 'tr'
    active: true
  },
  {
    id: 7634
    title: 'TikTok'
    typeId: 175
    collectionId: 82
    point: 'social_menu'
    params: {
      sort_description: {
        value: ''
      }
      description: {
        value: '<p><br></p>'
      }
      btn_text: {
        value: ''
      }
      link: {
        value: 'https://www.tiktok.com/@travelfulltrip'
      }
      image: {
        value: ''
      }
      svg: {
        value: '<div class="d-md-none d-block"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 1000 1000" width="30" height="30" class="rounded-pill">\r\n  <!-- Beyaz arka plan ekleniyor -->\r\n  <rect width="100%" height="100%" fill="gray"></rect>\r\n    <path d="M906.25 0H93.75C42.19 0 0 42.19 0 93.75v812.49c0 51.57 42.19 93.75 93.75 93.75l812.5.01c51.56 0 93.75-42.19 93.75-93.75V93.75C1000 42.19 957.81 0 906.25 0zM684.02 319.72c-32.42-21.13-55.81-54.96-63.11-94.38-1.57-8.51-2.45-17.28-2.45-26.25H515l-.17 414.65c-1.74 46.43-39.96 83.7-86.8 83.7-14.57 0-28.27-3.63-40.35-9.99-27.68-14.57-46.63-43.58-46.63-76.97 0-47.96 39.02-86.98 86.97-86.98 8.95 0 17.54 1.48 25.66 4.01V421.89c-8.41-1.15-16.95-1.86-25.66-1.86-105.01 0-190.43 85.43-190.43 190.45 0 64.42 32.18 121.44 81.3 155.92 30.93 21.72 68.57 34.51 109.14 34.51 105.01 0 190.43-85.43 190.43-190.43V400.21c40.58 29.12 90.3 46.28 143.95 46.28V343.03c-28.89 0-55.8-8.59-78.39-23.31z" fill="#fff"></path>\r\n</svg></div>\r\n<div class="d-md-block d-none"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 1000 1000" width="25" height="25" class="rounded-pill">\r\n  <path d="M906.25 0H93.75C42.19 0 0 42.19 0 93.75v812.49c0 51.57 42.19 93.75 93.75 93.75l812.5.01c51.56 0 93.75-42.19 93.75-93.75V93.75C1000 42.19 957.81 0 906.25 0zM684.02 319.72c-32.42-21.13-55.81-54.96-63.11-94.38-1.57-8.51-2.45-17.28-2.45-26.25H515l-.17 414.65c-1.74 46.43-39.96 83.7-86.8 83.7-14.57 0-28.27-3.63-40.35-9.99-27.68-14.57-46.63-43.58-46.63-76.97 0-47.96 39.02-86.98 86.97-86.98 8.95 0 17.54 1.48 25.66 4.01V421.89c-8.41-1.15-16.95-1.86-25.66-1.86-105.01 0-190.43 85.43-190.43 190.45 0 64.42 32.18 121.44 81.3 155.92 30.93 21.72 68.57 34.51 109.14 34.51 105.01 0 190.43-85.43 190.43-190.43V400.21c40.58 29.12 90.3 46.28 143.95 46.28V343.03c-28.89 0-55.8-8.59-78.39-23.31z"></path>\r\n</svg></div>\r\n'
      }
      view_country: {
        value: ''
      }
    }
    ordering: 5
    language: 'tr'
    active: true
  },
]

type CampaingCategories = {
  id: ID
  parentId: null
  idMap: null
  language: string
  title: string
  description: null
  slug: string
  redirectUrl: null
  items: null
}

type CategoryContent = {
  id: 813
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: null
  params: {
    sub_title: {
      value: string
    }
    sort_description: {
      value: string
    }
    description_title: {
      value: string
    }
    description: {
      value: string
    }
    terms_Of_conditions_title: {
      value: ''
    }
    terms_Of_conditions: {
      value: string
    }
    promation: {
      value: string
    }
    promation_code: {
      value: string
    }
    btn_name: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    view_country_code: {
      value: ''
    }
  }
  title: string
  description: null
  categoryId: ID
  widgetCollectionId: ID
  publicationDate: null
  publicationEndDate: null
  metaTitle: null
  metaDescription: null
  metaKeyword: null
  layout: null
  schema: null
  ordering: number
  active: boolean
  imageUrl: null
  fileUrl: null
}

export function getContent<ContentType>(slug: string) {
  return serviceRequest<ContentType>({
    axiosOptions: {
      url: 'api/cms/content',
      params: { slug },
    },
  })
}

export function getWidgetsByCollectionSlug() {
  return serviceRequest<CMSMasterWidgetParams>({
    axiosOptions: {
      url: 'api/cms/getWidgetsByCollectionSlug',
    },
  })
}

export function getCategoriesByParent(slug = 'kampanyalar') {
  return serviceRequest<CampaingCategories[]>({
    axiosOptions: {
      url: 'api/cms/getCategoriesByParent',
      params: { slug },
    },
  })
}

export function getContentsByCategorySlug(categorySlug = 'kampanyalar') {
  return serviceRequest<CategoryContent[]>({
    axiosOptions: {
      url: 'api/cms/getContentsByCategorySlug',
      params: { categorySlug },
    },
  })
}

type ContentDetail = {
  id: ID
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: null
  params: {
    sub_title: {
      value: string
    }
    sort_description: {
      value: string
    }
    description_title: {
      value: ''
    }
    description: {
      value: string
    }
    terms_Of_conditions_title: {
      value: string
    }
    terms_Of_conditions: {
      value: string
    }
    promation: {
      value: ''
    }
    promation_code: {
      value: ''
    }
    btn_name: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    view_country_code: {
      value: ''
    }
  }
  title: string
  description: null
  categoryId: ID
  widgetCollectionId: ID
  publicationDate: null
  publicationEndDate: null
  metaTitle: null
  metaDescription: null
  metaKeyword: null
  layout: null
  schema: null
  ordering: number
  active: true
  imageUrl: null
  fileUrl: null
}
export function getContentBySlugAsync(slug: string) {
  return serviceRequest<ContentDetail>({
    axiosOptions: {
      url: 'api/cms/getContentBySlugAsync',
      params: { slug },
    },
  })
}

export function cdnImageUrl(src: string) {
  if (typeof window === null) return `${process.env.CMS_CDN}/${src}`

  return `${process.env.NEXT_PUBLIC_CMS_CDN}/${src}`
}
