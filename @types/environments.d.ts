namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXT_PUBLIC_SERVICE_PATH: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_SCOPE_CODE: string
    NEXT_PUBLIC_OL_ROUTE: string
    NEXT_PUBLIC_SECURITY_ROUTE: string
    NEXT_PUBLIC_SECURE_STRING: string
    NEXT_PUBLIC_DEVICE_ID: string
    NEXT_PUBLIC_GET_SESSION_TOKEN: string
    NEXT_PUBLIC_SCOPE_NAME: string
    NEXT_PUBLIC_API_GW_ROUTE: string
    NEXT_PUBLIC_API_DESTINATION_ROUTE: string
    NEXT_PUBLIC_API_GW_KEY: string
    NEXT_PUBLIC_HOTEL_SOCKET_URL: string
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string
    NEXT_PUBLIC_CMS_CDN: string
    // server envs
    CMS_CDN: string
    API_GW_ROUTE: string
    API_DESTINATION_ROUTE: string
    SERVICE_PATH: string
    APP_NAME: string
    SCOPE_CODE: string
    OL_ROUTE: string
    SECURITY_ROUTE: string
    SECURE_STRING: string
    DEVICE_ID: string
    GET_SESSION_TOKEN: string
    SCOPE_NAME: string
    API_GW_KEY: string
    APP_TITLE: string
  }
}
