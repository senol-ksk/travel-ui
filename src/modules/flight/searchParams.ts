import {
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
} from 'nuqs'
import { z } from 'zod'

const cabinClassSchema = z.object({
  value: z.string().or(z.number()),
  title: z.string(),
})

const passnegerCounts = z.object({
  Adult: z.number(),
  Child: z.number(),
  Infant: z.number(),
})

const destinationScheam = z.object({
  code: z.string(),
  iata: z.array(z.string()),
  type: z.number(),
  isDomestic: z.boolean(),
  id: z.number().or(z.string()),
})

export const flightSearchParams = {
  origin: parseAsJson(destinationScheam.parse),
  destination: parseAsJson(destinationScheam.parse),
  departureDate: parseAsIsoDate,
  returnDate: parseAsIsoDate,
  activeTripKind: parseAsString,
  cabinClass: parseAsJson(cabinClassSchema.parse),
  passengerCounts: parseAsJson(passnegerCounts.parse),
}

export const serializeFlightSearchParams = createSerializer(flightSearchParams)

const expam = {
  params: {
    appName: 'fulltrip.prod.webapp.html',
    scopeName: 'FULLTRIP',
    scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
    searchToken:
      'C539D4510D3FED86C12EFE8926B991F8ACD5DAA7801D6E69877B46985F416F82',
    FlightSearchPanel: {
      ActiveTripKind: 2,
      SearchLegs: [
        {
          DepartureTime: '2025-03-13',
          CabinClass: 0,
          MaxConnections: 0,
          Origin: {
            code: 'IST',
            iata: ['IST', 'SAW'],
            type: 1,
            isDomestic: true,
            id: 291,
          },
          Destination: {
            code: 'IZM',
            iata: ['ADB'],
            type: 1,
            isDomestic: true,
            id: 292,
          },
        },
        {
          DepartureTime: '2025-03-16',
          CabinClass: 0,
          MaxConnections: 0,
          Origin: {
            code: 'IZM',
            iata: ['ADB'],
            type: 1,
            isDomestic: true,
            id: 292,
          },
          Destination: {
            code: 'IST',
            iata: ['IST', 'SAW'],
            type: 1,
            isDomestic: true,
            id: 291,
          },
        },
      ],
      PassengerCounts: { Adult: 1, Child: 0, Infant: 0 },
      Domestic: true,
      CabinClass: { value: 0, title: 'Ekonomi' },
      ReceivedProviders: [],
    },
  },
  apiRoute: 'FlightService',
  apiAction: 'api/Flight/Search',
  sessionToken:
    '3809494E4CDD56CDCDA3CED42BDC56C4D134A1E8C98E621A66E858CAFC8F50E1',
  appName: 'fulltrip.prod.webapp.html',
  scopeName: 'FULLTRIP',
  scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
  requestType:
    'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
  Device: 'Web',
  LanguageCode: 'tr_TR',
}
