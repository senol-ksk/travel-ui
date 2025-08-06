export interface Account {
  birthdate: string
  confirmAgreement: boolean
  confirmKVKK: boolean
  currentKVKKFileName: string | null
  email: string
  gender: number
  id: ID
  identityNumber: string
  isFacebookConnected: boolean
  isForeign: boolean
  isGoogleConnected: boolean
  isInEmailPromoList: boolean
  isInSmsPromoList: boolean
  isMobileConnectActivated: boolean
  isPhoneNumberConfirmed: boolean
  loginProvider: 'site'
  mobilePhone: string
  mobilePhoneNumberFull: string
  name: string
  passportNumber: string
  passportValidity: string
  surname: string
  totalRewardAmount: number | null
}
