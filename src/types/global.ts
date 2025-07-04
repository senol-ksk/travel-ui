export enum ModuleNames {
  FLIGHT = 'Flight',
  HOTEL = 'Hotel',
}

export type GetSecurityTokenResponse = {
  succeeded: boolean
  result: string
  errors: []
  messageEvents: []
}

export enum InvoiceType {
  Individual = '0',
  Corporate = '1',
}

export type OfficialHolidayServiceResponse = {
  succeeded: boolean
  result: {
    id: ID
    officialHolidayTypeId: ID
    countryId: ID
    cityId: null
    description: string
    day: string
    languageId: ID
    languageCode: string
  }[]
}

export interface InstallmentApiResponse {
  installment: {
    installmentInfoList: {
      amountPerInstallment: number
      bankName: string
      binList: string
      cardProgramName: string
      installmentCount: number
      totalAmount: number
    }[]
    installmentType: number
  }
}
