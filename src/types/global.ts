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
